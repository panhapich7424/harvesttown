/**
 * Ultra simple game that definitely works
 */
class UltraSimpleGame extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private head!: Phaser.GameObjects.Circle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: any;

  constructor() {
    super({ key: 'UltraSimpleGame' });
  }

  create(): void {
    console.log('Ultra simple game starting...');
    
    // Create a simple world background
    this.add.rectangle(800, 600, 1600, 1200, 0x4CAF50);

    // Create some ground tiles
    for (let x = 0; x < 50; x++) {
      for (let y = 0; y < 40; y++) {
        const tileColor = (x + y) % 2 === 0 ? 0x8BC34A : 0x4CAF50;
        this.add.rectangle(x * 32 + 16, y * 32 + 16, 32, 32, tileColor);
      }
    }

    // Create player
    this.player = this.add.rectangle(400, 300, 24, 32, 0x2196F3);
    this.player.setStrokeStyle(2, 0xFFFFFF);

    // Add player head
    this.head = this.add.circle(400, 290, 8, 0xFFC107);
    this.head.setStrokeStyle(1, 0x000000);

    // Setup input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys('W,S,A,D');

    // Setup camera
    this.cameras.main.setBounds(0, 0, 1600, 1280);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(2);

    // Instructions
    this.add.text(512, 50, 'WASD or Arrow Keys to Move\nGame is Working!', {
      font: '18px Arial',
      color: '#000000',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 5 },
      align: 'center'
    }).setOrigin(0.5, 0).setScrollFactor(0);

    console.log('Ultra simple game created successfully!');
  }

  update(): void {
    const speed = 3;
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
    this.player.x += velocityX;
    this.player.y += velocityY;

    // Move head with player
    this.head.x = this.player.x;
    this.head.y = this.player.y - 10;
  }
}

// Initialize game immediately
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#2c3e50',
  render: {
    pixelArt: true,
    antialias: false
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: UltraSimpleGame
};

// Start game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Starting ultra simple game...');
  const game = new Phaser.Game(config);
  (window as any).harvestTown = game;
});