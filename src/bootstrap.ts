import { PreloadScene } from './scenes/PreloadScene';
import { GameScene } from './scenes/GameScene';

/**
 * Main game configuration and initialization
 */
class HarvestTown {
  private game: Phaser.Game;

  constructor() {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
      parent: 'game-container',
      backgroundColor: '#2c3e50',
      
      // Physics configuration
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },

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
        gamepad: true,
        keyboard: true,
        mouse: true,
        touch: true
      },

      // Scene configuration
      scene: [PreloadScene, GameScene],

      // Audio configuration
      audio: {
        disableWebAudio: false
      }
    };

    this.game = new Phaser.Game(config);
    this.setupGlobalEvents();
  }

  private setupGlobalEvents(): void {
    // Handle window focus/blur for performance
    window.addEventListener('blur', () => {
      this.game.sound.pauseAll();
    });

    window.addEventListener('focus', () => {
      this.game.sound.resumeAll();
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.game.sound.pauseAll();
      } else {
        this.game.sound.resumeAll();
      }
    });

    // Handle resize
    window.addEventListener('resize', () => {
      this.game.scale.refresh();
    });

    // Error handling
    window.addEventListener('error', (event) => {
      console.error('Game Error:', event.error);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason);
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

// Initialize the game when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create global game instance
  (window as any).harvestTown = new HarvestTown();
});

// Export for module systems
export default HarvestTown;