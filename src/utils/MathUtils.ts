/**
 * Math utility functions for game development
 */
export class MathUtils {
  /**
   * Clamp a value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Linear interpolation between two values
   */
  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * MathUtils.clamp(t, 0, 1);
  }

  /**
   * Move a value towards a target by a maximum distance
   */
  static moveTowards(current: number, target: number, maxDelta: number): number {
    const difference = target - current;
    if (Math.abs(difference) <= maxDelta) {
      return target;
    }
    return current + Math.sign(difference) * maxDelta;
  }

  /**
   * Convert world coordinates to tile coordinates
   */
  static worldToTile(worldX: number, worldY: number, tileSize: number = 32): { x: number; y: number } {
    return {
      x: Math.floor(worldX / tileSize),
      y: Math.floor(worldY / tileSize)
    };
  }

  /**
   * Convert tile coordinates to world coordinates (center of tile)
   */
  static tileToWorld(tileX: number, tileY: number, tileSize: number = 32): { x: number; y: number } {
    return {
      x: tileX * tileSize + tileSize / 2,
      y: tileY * tileSize + tileSize / 2
    };
  }

  /**
   * Check if a point is within a rectangle
   */
  static pointInRect(px: number, py: number, rx: number, ry: number, rw: number, rh: number): boolean {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
  }

  /**
   * Get distance between two points
   */
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Normalize angle to 0-2π range
   */
  static normalizeAngle(angle: number): number {
    while (angle < 0) angle += Math.PI * 2;
    while (angle >= Math.PI * 2) angle -= Math.PI * 2;
    return angle;
  }

  /**
   * Get direction from velocity (0=right, 1=down, 2=left, 3=up)
   */
  static getDirectionFromVelocity(vx: number, vy: number): number {
    if (Math.abs(vx) > Math.abs(vy)) {
      return vx > 0 ? 0 : 2; // right or left
    } else {
      return vy > 0 ? 1 : 3; // down or up
    }
  }

  /**
   * Get 8-direction from velocity (includes diagonals)
   */
  static get8DirectionFromVelocity(vx: number, vy: number): string {
    const threshold = 0.1;
    
    if (Math.abs(vx) < threshold && Math.abs(vy) < threshold) {
      return 'idle';
    }

    if (Math.abs(vx) > Math.abs(vy)) {
      if (vx > 0) {
        return vy > threshold ? 'down_right' : vy < -threshold ? 'up_right' : 'right';
      } else {
        return vy > threshold ? 'down_left' : vy < -threshold ? 'up_left' : 'left';
      }
    } else {
      if (vy > 0) {
        return vx > threshold ? 'down_right' : vx < -threshold ? 'down_left' : 'down';
      } else {
        return vx > threshold ? 'up_right' : vx < -threshold ? 'up_left' : 'up';
      }
    }
  }
}