// Jest setup file for testing
import 'jest';

// Mock Phaser for testing
(global as any).Phaser = {
  GameObjects: {
    Container: class MockContainer {
      x: number = 0;
      y: number = 0;
      scene: any;
      body: any = { setSize: jest.fn(), setOffset: jest.fn(), setCollideWorldBounds: jest.fn() };
      
      constructor(scene: any, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
      }
      
      add = jest.fn();
    },
    Sprite: class MockSprite {
      x: number = 0;
      y: number = 0;
      anims: any = { currentAnim: null, play: jest.fn() };
      setTint = jest.fn();
      setAlpha = jest.fn();
      setScale = jest.fn();
      play = jest.fn();
    }
  },
  Scene: class MockScene {
    add = {
      existing: jest.fn(),
      sprite: jest.fn(() => new (global as any).Phaser.GameObjects.Sprite())
    };
    physics = {
      add: {
        existing: jest.fn()
      }
    };
    input = {
      keyboard: {
        createCursorKeys: jest.fn(() => ({
          left: { isDown: false },
          right: { isDown: false },
          up: { isDown: false },
          down: { isDown: false }
        })),
        addKeys: jest.fn(() => ({
          W: { isDown: false },
          S: { isDown: false },
          A: { isDown: false },
          D: { isDown: false },
          E: { isDown: false },
          SPACE: { isDown: false }
        }))
      },
      gamepad: {
        on: jest.fn()
      },
      on: jest.fn()
    };
    anims = {
      create: jest.fn(),
      generateFrameNumbers: jest.fn(() => []),
      get: jest.fn(),
      exists: jest.fn(() => true)
    };
    events = {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn()
    };
    time = {
      now: Date.now()
    };
    tweens = {
      add: jest.fn()
    };
  },
  Input: {
    Keyboard: {
      JustDown: jest.fn(() => false)
    },
    Gamepad: {
      JustDown: jest.fn(() => false)
    }
  }
} as any;

// Mock performance for timing
(global as any).performance = {
  now: jest.fn(() => Date.now())
};