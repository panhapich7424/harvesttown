// Asset manifest will be loaded dynamically

import Phaser from "phaser";

import Phaser from "phaser";

import Phaser from "phaser";

import Phaser from "phaser";

import Phaser from "phaser";

import Phaser from "phaser";

import Phaser from "phaser";

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
    // Load spritesheets directly
    this.load.spritesheet('player_idle', 'assets/Character/Idle.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    
    this.load.spritesheet('player_walk', 'assets/Character/Walk.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    
    this.load.spritesheet('spring_crops', 'assets/Objects/Spring Crops.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    // Load images
    this.load.image('tileset_spring', 'assets/Tileset/Tileset Spring.png');
    this.load.image('house', 'assets/Objects/House.png');
    this.load.image('chest', 'assets/Objects/chest.png');
    this.load.image('maple_tree', 'assets/Objects/Maple Tree.png');
    this.load.image('interior', 'assets/Objects/Interior.png');
    this.load.image('fence', 'assets/Objects/Fence\'s copiar.png');
    this.load.image('road', 'assets/Objects/Road copiar.png');

    // Load animal sprites
    this.load.image('chicken_yellow', 'assets/Farm Animals/Baby Chicken Yellow.png');
    this.load.image('chicken_blonde', 'assets/Farm Animals/Chicken Blonde  Green.png');
    this.load.image('chicken_red', 'assets/Farm Animals/Chicken Red.png');
    this.load.image('cow_female', 'assets/Farm Animals/Female Cow Brown.png');
    this.load.image('cow_male', 'assets/Farm Animals/Male Cow Brown.png');

    // Create a simple tilemap for testing
    const mapData = this.createTestMap();
    this.cache.tilemap.add('test_map', { format: 1, data: mapData });

    // Load additional UI assets (create simple colored rectangles as placeholders)
    this.load.image('ui_panel', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    
    // Create pixel art cursor
    this.createPixelCursor();
  }

  private createTestMap(): any {
    // Create a simple 50x40 tile map for testing
    const mapWidth = 50;
    const mapHeight = 40;
    const tileSize = 32;

    const layers = [{
      name: 'ground',
      width: mapWidth,
      height: mapHeight,
      data: [],
      visible: true,
      opacity: 1
    }];

    // Fill with grass tiles (assuming tile index 1 is grass)
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        // Create some variation in the ground
        if (x < 5 || x >= mapWidth - 5 || y < 5 || y >= mapHeight - 5) {
          layers[0].data.push(2); // Border tiles
        } else if ((x + y) % 7 === 0) {
          layers[0].data.push(3); // Some variation
        } else {
          layers[0].data.push(1); // Default grass
        }
      }
    }

    return {
      width: mapWidth,
      height: mapHeight,
      tilewidth: tileSize,
      tileheight: tileSize,
      layers: layers,
      tilesets: [{
        firstgid: 1,
        name: 'tileset_spring',
        tilewidth: tileSize,
        tileheight: tileSize,
        tilecount: 100,
        columns: 10,
        image: 'assets/Tileset/Tileset Spring.png',
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