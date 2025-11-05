import { Vector2 } from '../utils/Vector2';
import { MathUtils } from '../utils/MathUtils';

export interface PlayerConfig {
  maxSpeed: number;
  acceleration: number;
  deceleration: number;
  inputDeadzone: number;
  smoothingFactor: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  interact: boolean;
  useTool: boolean;
  gamepadAxes?: { x: number; y: number };
}

/**
 * PlayerController handles player movement, input processing, and physics
 */
export class PlayerController extends Phaser.GameObjects.Container {
  private config: PlayerConfig;
  private velocity: Vector2;
  private targetVelocity: Vector2;
  private inputState: InputState;
  private lastDirection: string;
  private isMoving: boolean;
  private inputBuffer: { action: string; timestamp: number } | null;
  private lastActionTime: number;
  private snapToGrid: boolean;

  // Input references
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private gamepad: Phaser.Input.Gamepad.Gamepad | null;

  // Sprite references
  private playerSprite!: Phaser.GameObjects.Sprite;
  private shadowSprite!: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    
    // Default configuration matching spec
    this.config = {
      maxSpeed: 140,
      acceleration: 1200,
      deceleration: 1500,
      inputDeadzone: 0.12,
      smoothingFactor: 12
    };

    this.velocity = Vector2.zero();
    this.targetVelocity = Vector2.zero();
    this.lastDirection = 'down';
    this.isMoving = false;
    this.inputBuffer = null;
    this.lastActionTime = 0;
    this.snapToGrid = false;
    this.gamepad = null;

    this.inputState = {
      left: false,
      right: false,
      up: false,
      down: false,
      interact: false,
      useTool: false
    };

    this.setupInput();
    this.setupSprites();
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Configure physics body
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(24, 16);
    body.setOffset(-12, -8);
    body.setCollideWorldBounds(true);
  }

  private setupInput(): void {
    const scene = this.scene;
    
    // Keyboard setup
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasdKeys = scene.input.keyboard!.addKeys('W,S,A,D,E,SPACE') as { [key: string]: Phaser.Input.Keyboard.Key };

    // Mouse/touch input
    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        this.bufferAction('interact');
      } else if (pointer.rightButtonDown()) {
        this.bufferAction('useTool');
      }
    });

    // Gamepad setup
    scene.input.gamepad.on('connected', (gamepad: Phaser.Input.Gamepad.Gamepad) => {
      this.gamepad = gamepad;
    });
  }

  private setupSprites(): void {
    // Create shadow sprite
    this.shadowSprite = this.scene.add.sprite(0, 8, 'player_idle', 0);
    this.shadowSprite.setTint(0x000000);
    this.shadowSprite.setAlpha(0.3);
    this.shadowSprite.setScale(1, 0.5);
    this.add(this.shadowSprite);

    // Create main player sprite
    this.playerSprite = this.scene.add.sprite(0, 0, 'player_idle', 0);
    this.add(this.playerSprite);

    // Set up animations
    this.createAnimations();
  }

  private createAnimations(): void {
    const scene = this.scene;

    // Idle animations (4 directions)
    scene.anims.create({
      key: 'idle_down',
      frames: scene.anims.generateFrameNumbers('player_idle', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1
    });

    scene.anims.create({
      key: 'idle_up',
      frames: scene.anims.generateFrameNumbers('player_idle', { start: 3, end: 3 }),
      frameRate: 1,
      repeat: -1
    });

    scene.anims.create({
      key: 'idle_left',
      frames: scene.anims.generateFrameNumbers('player_idle', { start: 1, end: 1 }),
      frameRate: 1,
      repeat: -1
    });

    scene.anims.create({
      key: 'idle_right',
      frames: scene.anims.generateFrameNumbers('player_idle', { start: 2, end: 2 }),
      frameRate: 1,
      repeat: -1
    });

    // Walking animations (4 directions)
    scene.anims.create({
      key: 'walk_down',
      frames: scene.anims.generateFrameNumbers('player_walk', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    scene.anims.create({
      key: 'walk_up',
      frames: scene.anims.generateFrameNumbers('player_walk', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1
    });

    scene.anims.create({
      key: 'walk_left',
      frames: scene.anims.generateFrameNumbers('player_walk', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1
    });

    scene.anims.create({
      key: 'walk_right',
      frames: scene.anims.generateFrameNumbers('player_walk', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1
    });
  }

  public update(dt: number): void {
    this.handleInput(dt);
    this.updateMovement(dt);
    this.updateAnimation();
    this.processInputBuffer();
    this.updateShadow();
  }

  private handleInput(dt: number): void {
    // Reset input state
    this.inputState = {
      left: false,
      right: false,
      up: false,
      down: false,
      interact: false,
      useTool: false
    };

    // Keyboard input
    this.inputState.left = this.cursors.left.isDown || this.wasdKeys.A.isDown;
    this.inputState.right = this.cursors.right.isDown || this.wasdKeys.D.isDown;
    this.inputState.up = this.cursors.up.isDown || this.wasdKeys.W.isDown;
    this.inputState.down = this.cursors.down.isDown || this.wasdKeys.S.isDown;
    this.inputState.interact = Phaser.Input.Keyboard.JustDown(this.wasdKeys.E) || 
                              Phaser.Input.Keyboard.JustDown(this.wasdKeys.SPACE);
    
    // Gamepad input
    if (this.gamepad) {
      const leftStick = this.gamepad.leftStick;
      if (leftStick.x !== 0 || leftStick.y !== 0) {
        this.inputState.gamepadAxes = { x: leftStick.x, y: -leftStick.y };
        
        // Apply deadzone
        if (Math.abs(leftStick.x) > this.config.inputDeadzone) {
          this.inputState.left = leftStick.x < -this.config.inputDeadzone;
          this.inputState.right = leftStick.x > this.config.inputDeadzone;
        }
        if (Math.abs(leftStick.y) > this.config.inputDeadzone) {
          this.inputState.up = -leftStick.y > this.config.inputDeadzone;
          this.inputState.down = -leftStick.y < -this.config.inputDeadzone;
        }
      }

      // Gamepad buttons
      if (this.gamepad.A && Phaser.Input.Gamepad.JustDown(this.gamepad.A)) {
        this.inputState.interact = true;
      }
      if (this.gamepad.X && Phaser.Input.Gamepad.JustDown(this.gamepad.X)) {
        this.inputState.useTool = true;
      }
    }

    // Buffer actions
    if (this.inputState.interact) {
      this.bufferAction('interact');
    }
    if (this.inputState.useTool) {
      this.bufferAction('useTool');
    }

    // Calculate target velocity from input
    this.calculateTargetVelocity();
  }

  private calculateTargetVelocity(): void {
    let inputX = 0;
    let inputY = 0;

    // Digital input
    if (this.inputState.left) inputX -= 1;
    if (this.inputState.right) inputX += 1;
    if (this.inputState.up) inputY -= 1;
    if (this.inputState.down) inputY += 1;

    // Use gamepad analog input if available
    if (this.inputState.gamepadAxes) {
      const axes = this.inputState.gamepadAxes;
      if (Math.abs(axes.x) > this.config.inputDeadzone || Math.abs(axes.y) > this.config.inputDeadzone) {
        inputX = axes.x;
        inputY = axes.y;
      }
    }

    // Normalize diagonal movement
    const inputVector = new Vector2(inputX, inputY);
    if (inputVector.magnitude() > 1) {
      const normalized = inputVector.normalized();
      inputX = normalized.x;
      inputY = normalized.y;
    }

    this.targetVelocity.set(inputX * this.config.maxSpeed, inputY * this.config.maxSpeed);
  }

  private updateMovement(dt: number): void {
    const currentSpeed = this.velocity.magnitude();
    const targetSpeed = this.targetVelocity.magnitude();
    
    // Determine if we're accelerating or decelerating
    const acceleration = targetSpeed > currentSpeed ? this.config.acceleration : this.config.deceleration;
    
    // Move towards target velocity
    this.velocity = this.velocity.moveTowards(this.targetVelocity, acceleration * dt);
    
    // Apply smoothing
    const smoothingT = MathUtils.clamp(dt * this.config.smoothingFactor, 0, 1);
    this.velocity = this.velocity.lerp(this.targetVelocity, smoothingT);
    
    // Update position
    this.x += this.velocity.x * dt;
    this.y += this.velocity.y * dt;
    
    // Update movement state
    this.isMoving = this.velocity.magnitude() > 10;
    
    // Update direction if moving
    if (this.isMoving) {
      const direction = MathUtils.get8DirectionFromVelocity(this.velocity.x, this.velocity.y);
      if (direction !== 'idle') {
        // Map 8-direction to 4-direction for animations
        if (direction.includes('right')) this.lastDirection = 'right';
        else if (direction.includes('left')) this.lastDirection = 'left';
        else if (direction.includes('up')) this.lastDirection = 'up';
        else if (direction.includes('down')) this.lastDirection = 'down';
      }
    }
  }

  private updateAnimation(): void {
    const animKey = this.isMoving ? `walk_${this.lastDirection}` : `idle_${this.lastDirection}`;
    
    if (this.playerSprite.anims.currentAnim?.key !== animKey) {
      this.playerSprite.play(animKey);
    }
  }

  private updateShadow(): void {
    // Subtle bobbing effect when walking
    if (this.isMoving) {
      const bobOffset = Math.sin(this.scene.time.now * 0.01) * 1;
      this.shadowSprite.y = 8 + bobOffset;
    } else {
      this.shadowSprite.y = 8;
    }
  }

  private bufferAction(action: string): void {
    this.inputBuffer = {
      action,
      timestamp: this.scene.time.now
    };
  }

  private processInputBuffer(): void {
    if (!this.inputBuffer) return;
    
    const bufferTime = 120; // 0.12 seconds
    const actionCooldown = 250; // 0.25 seconds
    
    if (this.scene.time.now - this.inputBuffer.timestamp > bufferTime) {
      this.inputBuffer = null;
      return;
    }
    
    if (this.scene.time.now - this.lastActionTime < actionCooldown) {
      return;
    }
    
    // Process the buffered action
    this.executeAction(this.inputBuffer.action);
    this.lastActionTime = this.scene.time.now;
    this.inputBuffer = null;
  }

  private executeAction(action: string): void {
    // Get tile position for interaction
    const tilePos = MathUtils.worldToTile(this.x, this.y);
    
    // Emit events for other systems to handle
    this.scene.events.emit('player-action', {
      action,
      playerPos: { x: this.x, y: this.y },
      tilePos,
      direction: this.lastDirection
    });
  }

  // Public methods for external systems
  public getPosition(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public getVelocity(): Vector2 {
    return this.velocity.clone();
  }

  public getDirection(): string {
    return this.lastDirection;
  }

  public isPlayerMoving(): boolean {
    return this.isMoving;
  }

  public setSnapToGrid(snap: boolean): void {
    this.snapToGrid = snap;
  }

  public teleport(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.velocity.set(0, 0);
    this.targetVelocity.set(0, 0);
  }
}