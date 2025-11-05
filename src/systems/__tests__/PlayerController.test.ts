import { PlayerController } from '../PlayerController';
import { Vector2 } from '../../utils/Vector2';

// Mock scene for testing
const createMockScene = () => ({
  add: {
    existing: jest.fn(),
    sprite: jest.fn(() => ({
      setTint: jest.fn(),
      setAlpha: jest.fn(),
      setScale: jest.fn(),
      anims: { currentAnim: null, play: jest.fn() },
      play: jest.fn()
    }))
  },
  physics: {
    add: {
      existing: jest.fn()
    }
  },
  input: {
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
  },
  anims: {
    create: jest.fn(),
    generateFrameNumbers: jest.fn(() => []),
    get: jest.fn(),
    exists: jest.fn(() => true)
  },
  events: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  },
  time: {
    now: Date.now()
  },
  tweens: {
    add: jest.fn()
  }
});

describe('PlayerController', () => {
  let mockScene: any;
  let player: PlayerController;

  beforeEach(() => {
    mockScene = createMockScene();
    player = new PlayerController(mockScene, 100, 100);
  });

  describe('initialization', () => {
    it('should create player at specified position', () => {
      const pos = player.getPosition();
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(100);
    });

    it('should start with zero velocity', () => {
      const velocity = player.getVelocity();
      expect(velocity.x).toBe(0);
      expect(velocity.y).toBe(0);
    });

    it('should start facing down', () => {
      expect(player.getDirection()).toBe('down');
    });

    it('should not be moving initially', () => {
      expect(player.isPlayerMoving()).toBe(false);
    });
  });

  describe('movement', () => {
    it('should update position when velocity is applied', () => {
      const initialPos = player.getPosition();
      
      // Simulate movement input by directly setting target velocity
      (player as any).targetVelocity = new Vector2(100, 0);
      
      // Update for 1 second
      player.update(1);
      
      const newPos = player.getPosition();
      expect(newPos.x).toBeGreaterThan(initialPos.x);
    });

    it('should normalize diagonal movement', () => {
      // Test that diagonal movement doesn't exceed max speed
      (player as any).inputState = {
        left: false,
        right: true,
        up: true,
        down: false,
        interact: false,
        useTool: false
      };
      
      (player as any).calculateTargetVelocity();
      const targetVel = (player as any).targetVelocity;
      
      // Diagonal movement should be normalized
      expect(targetVel.magnitude()).toBeCloseTo(140, 1); // maxSpeed = 140
    });
  });

  describe('direction tracking', () => {
    it('should update direction based on movement', () => {
      // Simulate rightward movement
      (player as any).velocity = new Vector2(100, 0);
      (player as any).isMoving = true;
      (player as any).updateMovement(0.016); // ~60fps
      
      expect(player.getDirection()).toBe('right');
    });

    it('should maintain last direction when stopped', () => {
      // Set initial direction
      (player as any).lastDirection = 'left';
      (player as any).velocity = new Vector2(0, 0);
      (player as any).isMoving = false;
      
      expect(player.getDirection()).toBe('left');
    });
  });

  describe('public methods', () => {
    it('should return current position', () => {
      const pos = player.getPosition();
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(100);
    });

    it('should teleport to new position', () => {
      player.teleport(200, 300);
      
      const pos = player.getPosition();
      expect(pos.x).toBe(200);
      expect(pos.y).toBe(300);
      
      const velocity = player.getVelocity();
      expect(velocity.x).toBe(0);
      expect(velocity.y).toBe(0);
    });

    it('should set snap to grid mode', () => {
      player.setSnapToGrid(true);
      expect((player as any).snapToGrid).toBe(true);
      
      player.setSnapToGrid(false);
      expect((player as any).snapToGrid).toBe(false);
    });
  });

  describe('input buffering', () => {
    it('should buffer actions for short duration', () => {
      const mockTime = 1000;
      mockScene.time.now = mockTime;
      
      (player as any).bufferAction('interact');
      
      expect((player as any).inputBuffer).toEqual({
        action: 'interact',
        timestamp: mockTime
      });
    });

    it('should clear expired buffer', () => {
      const mockTime = 1000;
      mockScene.time.now = mockTime;
      
      (player as any).bufferAction('interact');
      
      // Advance time beyond buffer duration
      mockScene.time.now = mockTime + 200; // 200ms > 120ms buffer time
      
      (player as any).processInputBuffer();
      
      expect((player as any).inputBuffer).toBeNull();
    });
  });

  describe('action execution', () => {
    it('should emit player-action event when executing action', () => {
      const mockEmit = jest.fn();
      mockScene.events.emit = mockEmit;
      
      (player as any).executeAction('interact');
      
      expect(mockEmit).toHaveBeenCalledWith('player-action', expect.objectContaining({
        action: 'interact',
        playerPos: expect.any(Object),
        tilePos: expect.any(Object),
        direction: expect.any(String)
      }));
    });
  });
});