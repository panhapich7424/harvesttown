/**
 * Simple 2D Vector utility class for game math
 */
export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  static one(): Vector2 {
    return new Vector2(1, 1);
  }

  static from(point: { x: number; y: number }): Vector2 {
    return new Vector2(point.x, point.y);
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalized(): Vector2 {
    const mag = this.magnitude();
    if (mag === 0) return Vector2.zero();
    return this.divide(mag);
  }

  distance(other: Vector2): number {
    return this.subtract(other).magnitude();
  }

  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  lerp(target: Vector2, t: number): Vector2 {
    const clampedT = Math.max(0, Math.min(1, t));
    return new Vector2(
      this.x + (target.x - this.x) * clampedT,
      this.y + (target.y - this.y) * clampedT
    );
  }

  moveTowards(target: Vector2, maxDistance: number): Vector2 {
    const direction = target.subtract(this);
    const distance = direction.magnitude();
    
    if (distance <= maxDistance) {
      return target.clone();
    }
    
    return this.add(direction.normalized().multiply(maxDistance));
  }

  equals(other: Vector2, tolerance: number = 0.001): boolean {
    return Math.abs(this.x - other.x) < tolerance && Math.abs(this.y - other.y) < tolerance;
  }

  toString(): string {
    return `Vector2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }
}