import { Vector2 } from '../Vector2';

describe('Vector2', () => {
  describe('constructor', () => {
    it('should create a vector with default values', () => {
      const v = new Vector2();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
    });

    it('should create a vector with specified values', () => {
      const v = new Vector2(3, 4);
      expect(v.x).toBe(3);
      expect(v.y).toBe(4);
    });
  });

  describe('static methods', () => {
    it('should create zero vector', () => {
      const v = Vector2.zero();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
    });

    it('should create one vector', () => {
      const v = Vector2.one();
      expect(v.x).toBe(1);
      expect(v.y).toBe(1);
    });

    it('should create vector from point', () => {
      const v = Vector2.from({ x: 5, y: 6 });
      expect(v.x).toBe(5);
      expect(v.y).toBe(6);
    });
  });

  describe('basic operations', () => {
    it('should add vectors correctly', () => {
      const v1 = new Vector2(1, 2);
      const v2 = new Vector2(3, 4);
      const result = v1.add(v2);
      
      expect(result.x).toBe(4);
      expect(result.y).toBe(6);
    });

    it('should subtract vectors correctly', () => {
      const v1 = new Vector2(5, 7);
      const v2 = new Vector2(2, 3);
      const result = v1.subtract(v2);
      
      expect(result.x).toBe(3);
      expect(result.y).toBe(4);
    });

    it('should multiply by scalar correctly', () => {
      const v = new Vector2(2, 3);
      const result = v.multiply(2);
      
      expect(result.x).toBe(4);
      expect(result.y).toBe(6);
    });

    it('should divide by scalar correctly', () => {
      const v = new Vector2(6, 8);
      const result = v.divide(2);
      
      expect(result.x).toBe(3);
      expect(result.y).toBe(4);
    });
  });

  describe('magnitude and normalization', () => {
    it('should calculate magnitude correctly', () => {
      const v = new Vector2(3, 4);
      expect(v.magnitude()).toBe(5);
    });

    it('should normalize vector correctly', () => {
      const v = new Vector2(3, 4);
      const normalized = v.normalized();
      
      expect(normalized.x).toBeCloseTo(0.6);
      expect(normalized.y).toBeCloseTo(0.8);
      expect(normalized.magnitude()).toBeCloseTo(1);
    });

    it('should handle zero vector normalization', () => {
      const v = Vector2.zero();
      const normalized = v.normalized();
      
      expect(normalized.x).toBe(0);
      expect(normalized.y).toBe(0);
    });
  });

  describe('distance and dot product', () => {
    it('should calculate distance correctly', () => {
      const v1 = new Vector2(0, 0);
      const v2 = new Vector2(3, 4);
      
      expect(v1.distance(v2)).toBe(5);
    });

    it('should calculate dot product correctly', () => {
      const v1 = new Vector2(2, 3);
      const v2 = new Vector2(4, 5);
      
      expect(v1.dot(v2)).toBe(23); // 2*4 + 3*5 = 8 + 15 = 23
    });
  });

  describe('interpolation', () => {
    it('should lerp correctly', () => {
      const v1 = new Vector2(0, 0);
      const v2 = new Vector2(10, 10);
      const result = v1.lerp(v2, 0.5);
      
      expect(result.x).toBe(5);
      expect(result.y).toBe(5);
    });

    it('should clamp lerp parameter', () => {
      const v1 = new Vector2(0, 0);
      const v2 = new Vector2(10, 10);
      
      const result1 = v1.lerp(v2, -0.5);
      expect(result1.x).toBe(0);
      expect(result1.y).toBe(0);
      
      const result2 = v1.lerp(v2, 1.5);
      expect(result2.x).toBe(10);
      expect(result2.y).toBe(10);
    });

    it('should move towards target correctly', () => {
      const v1 = new Vector2(0, 0);
      const v2 = new Vector2(10, 0);
      const result = v1.moveTowards(v2, 3);
      
      expect(result.x).toBe(3);
      expect(result.y).toBe(0);
    });

    it('should not overshoot target in moveTowards', () => {
      const v1 = new Vector2(0, 0);
      const v2 = new Vector2(2, 0);
      const result = v1.moveTowards(v2, 5);
      
      expect(result.x).toBe(2);
      expect(result.y).toBe(0);
    });
  });

  describe('utility methods', () => {
    it('should check equality correctly', () => {
      const v1 = new Vector2(1, 2);
      const v2 = new Vector2(1, 2);
      const v3 = new Vector2(1.01, 2.01);
      
      expect(v1.equals(v2)).toBe(true);
      expect(v1.equals(v3)).toBe(false);
      expect(v1.equals(v3, 0.02)).toBe(true);
    });

    it('should clone correctly', () => {
      const v1 = new Vector2(3, 4);
      const v2 = v1.clone();
      
      expect(v2.x).toBe(3);
      expect(v2.y).toBe(4);
      expect(v2).not.toBe(v1); // Different objects
    });

    it('should set values correctly', () => {
      const v = new Vector2();
      v.set(7, 8);
      
      expect(v.x).toBe(7);
      expect(v.y).toBe(8);
    });

    it('should convert to string correctly', () => {
      const v = new Vector2(1.234, 5.678);
      const str = v.toString();
      
      expect(str).toBe('Vector2(1.23, 5.68)');
    });
  });
});