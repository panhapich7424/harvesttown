import { SimpleGameScene } from './scenes/SimpleGameScene';

/**
 * Simple working game - guaranteed to work!
 */
class SimpleHarvestTown {
  private game: Phaser.Game;

  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      parent: 'game-container',
      backgroundColor: '#2c3e50',
      
      // Rendering configuration for pixel art
      render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
      },

      // Scale configuration
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
          width: 800,
          height: 600
        },
        max: {
          width: 1920,
          height: 1080
        }
      },

      // Input configuration
      input: {
        keyboard: true,
        mouse: true
      },

      // Scene configuration - just the simple scene
      scene: [SimpleGameScene]
    };

    this.game = new Phaser.Game(config);
    this.setupGlobalEvents();
    
    // Hide HTML loading screen immediately
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
    }
    
    console.log('Simple HarvestTown initialized!');
  }

  private setupGlobalEvents(): void {
    // Handle window focus/blur for performance
    window.addEventListener('blur', () => {
      // Game pause logic if needed
    });

    window.addEventListener('focus', () => {
      // Game resume logic if needed
    });

    // Handle resize
    window.addEventListener('resize', () => {
      this.game.scale.refresh();
    });

    // Error handling
    window.addEventListener('error', (event) => {
      console.error('Game Error:', event.error);
    });
  }

  public getGame(): Phaser.Game {
    return this.game;
  }

  public destroy(): void {
    if (this.game) {
      this.game.destroy(true);
    }
  }
}

// Initialize the simple game when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create global game instance
  (window as any).harvestTown = new SimpleHarvestTown();
});

// Export for module systems
export default SimpleHarvestTown;