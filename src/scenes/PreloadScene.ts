/**
 * PreloadScene handles loading all game assets with a progress bar
 */
export class PreloadScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  private percentText!: Phaser.GameObjects.Text;
  private assetText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.createLoadingScreen();
    this.setupLoadingEvents();
    this.loadAssets();
  }

  private createLoadingScreen(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Progress bar background
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    // Progress bar fill
    this.progressBar = this.add.graphics();

    // Loading text
    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading HarvestTown...', {
      font: '20px Arial',
      color: '#ffffff'
    });
    this.loadingText.setOrigin(0.5, 0.5);

    // Percentage text
    this.percentText = this.add.text(width / 2, height / 2, '0%', {
      font: '18px Arial',
      color: '#ffffff'
    });
    this.percentText.setOrigin(0.5, 0.5);

    // Asset loading text
    this.assetText = this.add.text(width / 2, height / 2 + 50, '', {
      font: '14px Arial',
      color: '#ffffff'
    });
    this.assetText.setOrigin(0.5, 0.5);
  }

  private setupLoadingEvents(): void {
    // Update progress bar
    this.load.on('progress', (value: number) => {
      this.percentText.setText(Math.floor(value * 100) + '%');
      
      this.progressBar.clear();
      this.progressBar.fillStyle(0x27ae60, 1);
      this.progressBar.fillRect(
        this.cameras.main.width / 2 - 150,
        this.cameras.main.height / 2 - 15,
        300 * value,
        30
      );

      // Update HTML progress bar if it exists
      const htmlProgress = document.getElementById('progress') as HTMLElement;
      if (htmlProgress) {
        htmlProgress.style.width = (value * 100) + '%';
      }
    });

    // Show which file is being loaded
    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      this.assetText.setText('Loading: ' + file.key);
    });

    // Hide HTML loading screen when complete
    this.load.on('complete', () => {
      const loadingDiv = document.getElementById('loading');
      if (loadingDiv) {
        loadingDiv.style.display = 'none';
      }
    });
  }

  private loadAssets(): void {
    // Create placeholder sprites using canvas (no external files needed)
    this.createPlayerSprites();
    this.createTilesetSprite();
    
    // Create a simple tilemap for testing
    const mapData = this.createTestMap();
    this.cache.tilemap.add('test_map', { format: 1, data: mapData });

    // Create pixel art cursor
    this.createPixelCursor();
  }

  private createPlayerSprites(): void {
    // Create player idle sprite
    const idleCanvas = document.createElement('canvas');
    idleCanvas.width = 128; // 32x4 frames
    idleCanvas.height = 32;
    const idleCtx = idleCanvas.getContext('2d')!;
    
    // Draw 4 idle frames (down, left, right, up)
    const colors = ['#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2'];
    for (let i = 0; i < 4; i++) {
      idleCtx.fillStyle = colors[i];
      idleCtx.fillRect(i * 32 + 8, 8, 16, 24); // Body
      idleCtx.fillStyle = '#f5a623';
      idleCtx.fillRect(i * 32 + 12, 4, 8, 8); // Head
    }
    
    this.load.spritesheet('player_idle', idleCanvas.toDataURL(), {
      frameWidth: 32,
      frameHeight: 32
    });

    // Create player walk sprite
    const walkCanvas = document.createElement('canvas');
    walkCanvas.width = 512; // 32x16 frames (4 directions x 4 frames each)
    walkCanvas.height = 32;
    const walkCtx = walkCanvas.getContext('2d')!;
    
    // Draw 16 walk frames
    for (let i = 0; i < 16; i++) {
      const offset = (i % 4) * 2; // Simple animation offset
      walkCtx.fillStyle = '#4a90e2';
      walkCtx.fillRect(i * 32 + 8, 8 + offset, 16, 24 - offset); // Body
      walkCtx.fillStyle = '#f5a623';
      walkCtx.fillRect(i * 32 + 12, 4, 8, 8); // Head
    }
    
    this.load.spritesheet('player_walk', walkCanvas.toDataURL(), {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  private createTilesetSprite(): void {
    // Create a simple tileset
    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = 320; // 10x10 tiles
    tileCanvas.height = 320;
    const tileCtx = tileCanvas.getContext('2d')!;
    
    // Create different tile types
    const tileColors = [
      '#000000', // 0 - black (unused)
      '#7cb342', // 1 - grass
      '#8d6e63', // 2 - dirt
      '#4caf50', // 3 - dark grass
      '#2196f3', // 4 - water
      '#ff9800'  // 5 - sand
    ];
    
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const tileIndex = (x + y * 10) % tileColors.length;
        tileCtx.fillStyle = tileColors[tileIndex];
        tileCtx.fillRect(x * 32, y * 32, 32, 32);
        
        // Add border for visibility
        tileCtx.strokeStyle = '#333333';
        tileCtx.lineWidth = 1;
        tileCtx.strokeRect(x * 32, y * 32, 32, 32);
      }
    }
    
    this.load.image('tileset_spring', tileCanvas.toDataURL());
  }

  private createTestMap(): any {
    // Create a simple 50x40 tile map for testing
    const mapWidth = 50;
    const mapHeight = 40;
    const tileSize = 32;

    // Fill with grass tiles (assuming tile index 1 is grass)
    const data: number[] = [];
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        // Create some variation in the ground
        if (x < 5 || x >= mapWidth - 5 || y < 5 || y >= mapHeight - 5) {
          data.push(2); // Border tiles
        } else if ((x + y) % 7 === 0) {
          data.push(3); // Some variation
        } else {
          data.push(1); // Default grass
        }
      }
    }

    return {
      width: mapWidth,
      height: mapHeight,
      tilewidth: tileSize,
      tileheight: tileSize,
      layers: [{
        name: 'ground',
        width: mapWidth,
        height: mapHeight,
        data: data,
        visible: true,
        opacity: 1
      }],
      tilesets: [{
        firstgid: 1,
        name: 'tileset_spring',
        tilewidth: tileSize,
        tileheight: tileSize,
        tilecount: 100,
        columns: 10,
        image: 'tileset_spring',
        imagewidth: 320,
        imageheight: 320
      }]
    };
  }

  private createPixelCursor(): void {
    // Create a simple 16x16 pixel cursor
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    
    // Draw a simple cursor
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 2, 12);
    ctx.fillRect(0, 0, 8, 2);
    ctx.fillRect(0, 10, 6, 2);
    ctx.fillRect(4, 6, 2, 6);
    
    // Add black outline
    ctx.fillStyle = '#000000';
    ctx.fillRect(2, 0, 1, 12);
    ctx.fillRect(0, 2, 8, 1);
    ctx.fillRect(0, 9, 6, 1);
    ctx.fillRect(6, 10, 1, 2);
    ctx.fillRect(3, 6, 1, 6);
    ctx.fillRect(6, 6, 1, 6);
    
    this.load.image('cursor', canvas.toDataURL());
  }

  create(): void {
    // Clean up loading screen elements
    this.progressBar.destroy();
    this.progressBox.destroy();
    this.loadingText.destroy();
    this.percentText.destroy();
    this.assetText.destroy();

    // Show completion message briefly
    const completeText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'Loading Complete!\nStarting Game...',
      {
        font: '24px Arial',
        color: '#27ae60',
        align: 'center'
      }
    );
    completeText.setOrigin(0.5, 0.5);

    // Fade out and start game scene
    this.cameras.main.fadeOut(500, 0, 0, 0);
    
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene');
    });
  }
}