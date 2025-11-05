import { PlayerController } from '../systems/PlayerController';
import { CameraSystem } from '../systems/CameraSystem';
import { AnimationManager } from '../systems/AnimationManager';

/**
 * Main game scene where all gameplay happens
 */
export class GameScene extends Phaser.Scene {
  private player!: PlayerController;
  private cameraSystem!: CameraSystem;
  private animationManager!: AnimationManager;
  private tilemap!: Phaser.Tilemaps.Tilemap;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  
  // Debug elements
  private debugText!: Phaser.GameObjects.Text;
  private showDebug: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.setupWorld();
    this.createPlayer();
    this.setupCamera();
    this.setupInput();
    this.setupDebug();
    this.setupEventListeners();

    // Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  private setupWorld(): void {
    // Create tilemap from cached data
    this.tilemap = this.make.tilemap({ key: 'test_map' });
    
    // Add tileset
    const tileset = this.tilemap.addTilesetImage('tileset_spring', 'tileset_spring');
    
    if (!tileset) {
      console.error('Failed to load tileset');
      return;
    }

    // Create ground layer
    this.groundLayer = this.tilemap.createLayer('ground', tileset, 0, 0)!;
    
    if (this.groundLayer) {
      this.groundLayer.setScale(1);
    }

    // Set world bounds based on tilemap
    const mapWidth = this.tilemap.widthInPixels;
    const mapHeight = this.tilemap.heightInPixels;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
  }

  private createPlayer(): void {
    // Create animation manager first
    this.animationManager = new AnimationManager(this);
    this.animationManager.createPlayerAnimations();
    this.animationManager.createCropAnimations();

    // Create player at center of map
    const startX = this.tilemap.widthInPixels / 2;
    const startY = this.tilemap.heightInPixels / 2;
    
    this.player = new PlayerController(this, startX, startY);
    this.add.existing(this.player);
  }

  private setupCamera(): void {
    // Configure camera system
    this.cameraSystem = new CameraSystem(this, {
      followLerpFactor: 0.08,
      lookaheadDistance: 32,
      mapBounds: {
        x: 0,
        y: 0,
        width: this.tilemap.widthInPixels,
        height: this.tilemap.heightInPixels
      },
      deadzone: {
        x: 100,
        y: 100,
        width: 200,
        height: 150
      }
    });

    // Set player as camera target
    this.cameraSystem.setTarget(this.player);
  }

  private setupInput(): void {
    // Debug toggle
    this.input.keyboard!.on('keydown-F3', () => {
      this.showDebug = !this.showDebug;
      this.debugText.setVisible(this.showDebug);
    });

    // Camera controls for testing
    this.input.keyboard!.on('keydown-ONE', () => {
      this.cameraSystem.zoomTo(1, 500);
    });

    this.input.keyboard!.on('keydown-TWO', () => {
      this.cameraSystem.zoomTo(2, 500);
    });

    this.input.keyboard!.on('keydown-THREE', () => {
      this.cameraSystem.zoomTo(3, 500);
    });

    // Test camera shake
    this.input.keyboard!.on('keydown-X', () => {
      this.cameraSystem.shake(300, 10);
    });
  }

  private setupDebug(): void {
    // Create debug text
    this.debugText = this.add.text(10, 10, '', {
      font: '14px Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    });
    this.debugText.setScrollFactor(0); // Keep on screen
    this.debugText.setDepth(1000); // Always on top
    this.debugText.setVisible(this.showDebug);
  }

  private setupEventListeners(): void {
    // Listen for player actions
    this.events.on('player-action', (data: any) => {
      this.handlePlayerAction(data);
    });
  }

  private handlePlayerAction(data: any): void {
    const { action, playerPos, tilePos, direction } = data;
    
    switch (action) {
      case 'interact':
        this.handleInteraction(tilePos, direction);
        break;
      case 'useTool':
        this.handleToolUse(tilePos, direction);
        break;
    }
  }

  private handleInteraction(tilePos: { x: number; y: number }, direction: string): void {
    // Get the tile in front of the player
    const targetTile = this.getTargetTile(tilePos, direction);
    
    // For now, just log the interaction
    console.log(`Interacting with tile at ${targetTile.x}, ${targetTile.y}`);
    
    // Add visual feedback
    this.showInteractionFeedback(targetTile.x * 32 + 16, targetTile.y * 32 + 16);
  }

  private handleToolUse(tilePos: { x: number; y: number }, direction: string): void {
    // Get the tile in front of the player
    const targetTile = this.getTargetTile(tilePos, direction);
    
    // For now, just log the tool use
    console.log(`Using tool on tile at ${targetTile.x}, ${targetTile.y}`);
    
    // Add visual feedback
    this.showToolFeedback(targetTile.x * 32 + 16, targetTile.y * 32 + 16);
  }

  private getTargetTile(playerTile: { x: number; y: number }, direction: string): { x: number; y: number } {
    let targetX = playerTile.x;
    let targetY = playerTile.y;

    switch (direction) {
      case 'up':
        targetY -= 1;
        break;
      case 'down':
        targetY += 1;
        break;
      case 'left':
        targetX -= 1;
        break;
      case 'right':
        targetX += 1;
        break;
    }

    return { x: targetX, y: targetY };
  }

  private showInteractionFeedback(worldX: number, worldY: number): void {
    // Create a simple visual feedback
    const feedback = this.add.circle(worldX, worldY, 16, 0x00ff00, 0.5);
    
    this.tweens.add({
      targets: feedback,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        feedback.destroy();
      }
    });
  }

  private showToolFeedback(worldX: number, worldY: number): void {
    // Create a different visual feedback for tool use
    const feedback = this.add.circle(worldX, worldY, 16, 0xff6600, 0.5);
    
    this.tweens.add({
      targets: feedback,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        feedback.destroy();
      }
    });
  }

  update(time: number, delta: number): void {
    const dt = delta / 1000; // Convert to seconds

    // Update player
    this.player.update(dt);

    // Update camera
    this.cameraSystem.update(dt);

    // Update debug info
    if (this.showDebug) {
      this.updateDebugInfo();
    }
  }

  private updateDebugInfo(): void {
    const playerPos = this.player.getPosition();
    const playerVel = this.player.getVelocity();
    const fps = Math.round(this.game.loop.actualFps);
    const cameraPos = this.cameraSystem.getCenterPosition();

    const debugInfo = [
      `FPS: ${fps}`,
      `Player: (${Math.round(playerPos.x)}, ${Math.round(playerPos.y)})`,
      `Velocity: (${Math.round(playerVel.x)}, ${Math.round(playerVel.y)})`,
      `Speed: ${Math.round(playerVel.magnitude())}`,
      `Direction: ${this.player.getDirection()}`,
      `Moving: ${this.player.isPlayerMoving()}`,
      `Camera: (${Math.round(cameraPos.x)}, ${Math.round(cameraPos.y)})`,
      `Zoom: ${this.cameras.main.zoom.toFixed(1)}`,
      '',
      'Controls:',
      'WASD/Arrows - Move',
      'E/Space - Interact',
      'Right Click - Use Tool',
      'F3 - Toggle Debug',
      '1/2/3 - Zoom Levels',
      'X - Camera Shake'
    ];

    this.debugText.setText(debugInfo.join('\n'));
  }

  // Cleanup
  destroy(): void {
    this.events.off('player-action');
    super.destroy();
  }
}