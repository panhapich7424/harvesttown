import { Vector2 } from '../utils/Vector2';
import { MathUtils } from '../utils/MathUtils';

export interface CameraConfig {
  followLerpFactor: number;
  lookaheadDistance: number;
  mapBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  deadzone: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * CameraSystem handles smooth camera following with lookahead and bounds clamping
 */
export class CameraSystem {
  private scene: Phaser.Scene;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private config: CameraConfig;
  private target: Phaser.GameObjects.GameObject | null;
  private targetPosition: Vector2;
  private targetVelocity: Vector2;
  private cameraTarget: Vector2;
  private isShaking: boolean;
  private originalZoom: number;

  constructor(scene: Phaser.Scene, config?: Partial<CameraConfig>) {
    this.scene = scene;
    this.camera = scene.cameras.main;
    this.target = null;
    this.targetPosition = Vector2.zero();
    this.targetVelocity = Vector2.zero();
    this.cameraTarget = Vector2.zero();
    this.isShaking = false;
    this.originalZoom = 1;

    // Default configuration
    this.config = {
      followLerpFactor: 0.08,
      lookaheadDistance: 32,
      mapBounds: {
        x: 0,
        y: 0,
        width: 1600,
        height: 1200
      },
      deadzone: {
        x: 100,
        y: 100,
        width: 200,
        height: 150
      },
      ...config
    };

    this.setupCamera();
  }

  private setupCamera(): void {
    // Set initial camera properties
    this.camera.setZoom(2); // 2x zoom for pixel art
    this.originalZoom = this.camera.zoom;
    
    // Set camera bounds
    this.camera.setBounds(
      this.config.mapBounds.x,
      this.config.mapBounds.y,
      this.config.mapBounds.width,
      this.config.mapBounds.height
    );

    // Enable camera effects
    this.camera.setRoundPixels(true); // Crisp pixel art
  }

  /**
   * Set the target for the camera to follow
   */
  public setTarget(target: Phaser.GameObjects.GameObject): void {
    this.target = target;
    
    if (target) {
      this.targetPosition.set(target.x, target.y);
      this.cameraTarget.set(target.x, target.y);
      
      // Immediately snap camera to target
      this.camera.centerOn(target.x, target.y);
    }
  }

  /**
   * Update camera position and effects
   */
  public update(dt: number): void {
    if (!this.target) return;

    this.updateTargetTracking();
    this.calculateCameraTarget();
    this.updateCameraPosition(dt);
    this.clampCameraToBounds();
  }

  private updateTargetTracking(): void {
    if (!this.target) return;

    const newPosition = new Vector2(this.target.x, this.target.y);
    
    // Calculate velocity from position change
    this.targetVelocity = newPosition.subtract(this.targetPosition);
    this.targetPosition = newPosition;
  }

  private calculateCameraTarget(): void {
    if (!this.target) return;

    // Base target is the target's position
    this.cameraTarget.set(this.targetPosition.x, this.targetPosition.y);

    // Add lookahead based on velocity
    const velocityMagnitude = this.targetVelocity.magnitude();
    if (velocityMagnitude > 10) { // Only apply lookahead if moving fast enough
      const normalizedVelocity = this.targetVelocity.normalized();
      const lookahead = normalizedVelocity.multiply(this.config.lookaheadDistance);
      this.cameraTarget = this.cameraTarget.add(lookahead);
    }
  }

  private updateCameraPosition(dt: number): void {
    const currentCameraPos = new Vector2(this.camera.scrollX + this.camera.width / 2, 
                                        this.camera.scrollY + this.camera.height / 2);
    
    // Check if target is outside deadzone
    const deadzoneLeft = currentCameraPos.x - this.config.deadzone.width / 2;
    const deadzoneRight = currentCameraPos.x + this.config.deadzone.width / 2;
    const deadzoneTop = currentCameraPos.y - this.config.deadzone.height / 2;
    const deadzoneBottom = currentCameraPos.y + this.config.deadzone.height / 2;

    let shouldMove = false;
    let newCameraPos = currentCameraPos.clone();

    // Check horizontal deadzone
    if (this.cameraTarget.x < deadzoneLeft) {
      newCameraPos.x = this.cameraTarget.x + this.config.deadzone.width / 2;
      shouldMove = true;
    } else if (this.cameraTarget.x > deadzoneRight) {
      newCameraPos.x = this.cameraTarget.x - this.config.deadzone.width / 2;
      shouldMove = true;
    }

    // Check vertical deadzone
    if (this.cameraTarget.y < deadzoneTop) {
      newCameraPos.y = this.cameraTarget.y + this.config.deadzone.height / 2;
      shouldMove = true;
    } else if (this.cameraTarget.y > deadzoneBottom) {
      newCameraPos.y = this.cameraTarget.y - this.config.deadzone.height / 2;
      shouldMove = true;
    }

    // Smooth camera movement
    if (shouldMove || this.isShaking) {
      const lerpedPos = currentCameraPos.lerp(newCameraPos, this.config.followLerpFactor);
      this.camera.centerOn(lerpedPos.x, lerpedPos.y);
    }
  }

  private clampCameraToBounds(): void {
    const halfWidth = this.camera.width / (2 * this.camera.zoom);
    const halfHeight = this.camera.height / (2 * this.camera.zoom);

    const minX = this.config.mapBounds.x + halfWidth;
    const maxX = this.config.mapBounds.x + this.config.mapBounds.width - halfWidth;
    const minY = this.config.mapBounds.y + halfHeight;
    const maxY = this.config.mapBounds.y + this.config.mapBounds.height - halfHeight;

    const currentX = this.camera.scrollX + halfWidth;
    const currentY = this.camera.scrollY + halfHeight;

    const clampedX = MathUtils.clamp(currentX, minX, maxX);
    const clampedY = MathUtils.clamp(currentY, minY, maxY);

    if (clampedX !== currentX || clampedY !== currentY) {
      this.camera.centerOn(clampedX, clampedY);
    }
  }

  /**
   * Shake the camera for impact effects
   */
  public shake(duration: number = 300, intensity: number = 5): void {
    this.isShaking = true;
    
    this.camera.shake(duration, intensity * 0.01, false, (camera, progress) => {
      if (progress >= 1) {
        this.isShaking = false;
      }
    });
  }

  /**
   * Flash the camera for damage or special effects
   */
  public flash(duration: number = 200, color: number = 0xffffff, alpha: number = 0.5): void {
    this.camera.flash(duration, color >> 16 & 255, color >> 8 & 255, color & 255, false, alpha);
  }

  /**
   * Fade the camera in or out
   */
  public fade(duration: number = 1000, fadeOut: boolean = true, color: number = 0x000000): void {
    if (fadeOut) {
      this.camera.fadeOut(duration, color >> 16 & 255, color >> 8 & 255, color & 255);
    } else {
      this.camera.fadeIn(duration, color >> 16 & 255, color >> 8 & 255, color & 255);
    }
  }

  /**
   * Zoom the camera smoothly
   */
  public zoomTo(targetZoom: number, duration: number = 1000): void {
    this.scene.tweens.add({
      targets: this.camera,
      zoom: targetZoom,
      duration: duration,
      ease: 'Power2'
    });
  }

  /**
   * Pan the camera to a specific position
   */
  public panTo(x: number, y: number, duration: number = 1000): void {
    const targetScrollX = x - this.camera.width / (2 * this.camera.zoom);
    const targetScrollY = y - this.camera.height / (2 * this.camera.zoom);

    this.scene.tweens.add({
      targets: this.camera,
      scrollX: targetScrollX,
      scrollY: targetScrollY,
      duration: duration,
      ease: 'Power2'
    });
  }

  /**
   * Set camera bounds (useful for different areas/maps)
   */
  public setBounds(x: number, y: number, width: number, height: number): void {
    this.config.mapBounds = { x, y, width, height };
    this.camera.setBounds(x, y, width, height);
  }

  /**
   * Set camera deadzone
   */
  public setDeadzone(x: number, y: number, width: number, height: number): void {
    this.config.deadzone = { x, y, width, height };
  }

  /**
   * Get world position from screen coordinates
   */
  public screenToWorld(screenX: number, screenY: number): Vector2 {
    const worldX = (screenX / this.camera.zoom) + this.camera.scrollX;
    const worldY = (screenY / this.camera.zoom) + this.camera.scrollY;
    return new Vector2(worldX, worldY);
  }

  /**
   * Get screen position from world coordinates
   */
  public worldToScreen(worldX: number, worldY: number): Vector2 {
    const screenX = (worldX - this.camera.scrollX) * this.camera.zoom;
    const screenY = (worldY - this.camera.scrollY) * this.camera.zoom;
    return new Vector2(screenX, screenY);
  }

  /**
   * Check if a world position is visible on screen
   */
  public isVisible(worldX: number, worldY: number, margin: number = 0): boolean {
    const left = this.camera.scrollX - margin;
    const right = this.camera.scrollX + this.camera.width / this.camera.zoom + margin;
    const top = this.camera.scrollY - margin;
    const bottom = this.camera.scrollY + this.camera.height / this.camera.zoom + margin;

    return worldX >= left && worldX <= right && worldY >= top && worldY <= bottom;
  }

  /**
   * Get camera center position in world coordinates
   */
  public getCenterPosition(): Vector2 {
    return new Vector2(
      this.camera.scrollX + this.camera.width / (2 * this.camera.zoom),
      this.camera.scrollY + this.camera.height / (2 * this.camera.zoom)
    );
  }

  /**
   * Reset camera to default settings
   */
  public reset(): void {
    this.camera.setZoom(this.originalZoom);
    this.camera.clearTint();
    this.camera.setAlpha(1);
    this.isShaking = false;
  }

  /**
   * Get the current camera instance
   */
  public getCamera(): Phaser.Cameras.Scene2D.Camera {
    return this.camera;
  }

  /**
   * Cleanup camera system
   */
  public destroy(): void {
    this.target = null;
    // Camera is managed by Phaser, no explicit cleanup needed
  }
}