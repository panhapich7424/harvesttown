/**
 * Simple working game scene with basic graphics
 */
export class SimpleGameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: any;
  private debugText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'SimpleGameScene' });
  }

  create(): void {
    // Create a simple world background
    this.add.rectangle(800, 600, 1600, 1200, 0x4CAF50); // Green background

    // Create some ground tiles
    for (let x = 0; x < 50; x++) {
      for (let y = 0; y < 40; y++) {
        const tileColor = (x + y) % 2 === 0 ? 0x8BC34A : 0x4CAF50;
        this.add.rectangle(x * 32 + 16, y * 32 + 16, 32, 32, tileColor);
      }
    }

    // Create player as a simple rectangle
    this.player = this.add.rectangle(400, 300, 24, 32, 0x2196F3);
    this.player.setStrokeStyle(2, 0xFFFFFF);

    // Add player head
    const head = this.add.circle(400, 290, 8, 0xFFC107);
    head.setStrokeStyle(1, 0x000000);

    // Make head follow player
    this.player.setData('head', head);

    // Setup input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys('W,S,A,D');

    // Setup camera
    this.cameras.main.setBounds(0, 0, 1600, 1280);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(2);

    // Debug text
    this.debugText = this.add.text(10, 10, '', {
      font: '16px Arial',
      color: '#000000',
      backgroundColor: '#ffffff',
      padding: { x: 8, y: 4 }
    });
    this.debugText.setScrollFactor(0);
    this.debugText.setDepth(1000);

    // Instructions
    const instructions = this.add.text(this.cameras.main.width / 2, 50, 
      'WASD or Arrow Keys to Move\nF3 for Debug Info', {
      font: '18px Arial',
      color: '#000000',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 5 },
      align: 'center'
    });
    instructions.setOrigin(0.5, 0);
    instructions.setScrollFactor(0);
    instructions.setDepth(1000);

    // Debug toggle
    this.input.keyboard!.on('keydown-F3', () => {
      this.debugText.visible = !this.debugText.visible;
    });

    console.log('Simple game scene created successfully!');
  }

  update(): void {
    const speed = 200;
    let velocityX = 0;
    let velocityY = 0;

    // Handle input
    if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
      velocityX = -speed;
    } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
      velocityX = speed;
    }

    if (this.cursors.up.isDown || this.wasdKeys.W.isDown) {
      velocityY = -speed;
    } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
      velocityY = speed;
    }

    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }

    // Move player
    this.player.x += velocityX * (1/60);
    this.player.y += velocityY * (1/60);

    // Move head with player
    const head = this.player.getData('head');
    if (head) {
      head.x = this.player.x;
      head.y = this.player.y - 10;
    }

    // Update debug info
    this.debugText.setText([
      `FPS: ${Math.round(this.game.loop.actualFps)}`,
      `Player: (${Math.round(this.player.x)}, ${Math.round(this.player.y)})`,
      `Velocity: (${Math.round(velocityX)}, ${Math.round(velocityY)})`,
      `Camera: (${Math.round(this.cameras.main.scrollX)}, ${Math.round(this.cameras.main.scrollY)})`,
      '',
      'Controls:',
      'WASD/Arrows - Move',
      'F3 - Toggle Debug'
    ].join('\n'));
  }
}