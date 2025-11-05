/**
 * AnimationManager handles creation and management of all game animations
 */
export class AnimationManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Create all player animations
   */
  public createPlayerAnimations(): void {
    this.createPlayerIdleAnimations();
    this.createPlayerWalkAnimations();
  }

  private createPlayerIdleAnimations(): void {
    // Idle animations for 4 directions
    this.scene.anims.create({
      key: 'player_idle_down',
      frames: this.scene.anims.generateFrameNumbers('player_idle', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'player_idle_up',
      frames: this.scene.anims.generateFrameNumbers('player_idle', { start: 3, end: 3 }),
      frameRate: 1,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'player_idle_left',
      frames: this.scene.anims.generateFrameNumbers('player_idle', { start: 1, end: 1 }),
      frameRate: 1,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'player_idle_right',
      frames: this.scene.anims.generateFrameNumbers('player_idle', { start: 2, end: 2 }),
      frameRate: 1,
      repeat: -1
    });
  }

  private createPlayerWalkAnimations(): void {
    // Walking animations for 4 directions
    this.scene.anims.create({
      key: 'player_walk_down',
      frames: this.scene.anims.generateFrameNumbers('player_walk', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'player_walk_up',
      frames: this.scene.anims.generateFrameNumbers('player_walk', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'player_walk_left',
      frames: this.scene.anims.generateFrameNumbers('player_walk', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'player_walk_right',
      frames: this.scene.anims.generateFrameNumbers('player_walk', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1
    });
  }

  /**
   * Create crop growth animations
   */
  public createCropAnimations(): void {
    // Parsnip growth stages
    this.scene.anims.create({
      key: 'parsnip_stage_0',
      frames: this.scene.anims.generateFrameNumbers('spring_crops', { start: 0, end: 0 }),
      frameRate: 1,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'parsnip_stage_1',
      frames: this.scene.anims.generateFrameNumbers('spring_crops', { start: 1, end: 1 }),
      frameRate: 1,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'parsnip_stage_2',
      frames: this.scene.anims.generateFrameNumbers('spring_crops', { start: 2, end: 2 }),
      frameRate: 1,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'parsnip_stage_3',
      frames: this.scene.anims.generateFrameNumbers('spring_crops', { start: 3, end: 3 }),
      frameRate: 1,
      repeat: 0
    });

    // Cauliflower growth stages
    this.scene.anims.create({
      key: 'cauliflower_stage_0',
      frames: this.scene.anims.generateFrameNumbers('spring_crops', { start: 8, end: 8 }),
      frameRate: 1,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'cauliflower_stage_1',
      frames: this.scene.anims.generateFrameNumbers('spring_crops', { start: 9, end: 9 }),
      frameRate: 1,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'cauliflower_stage_2',
      frames: this.scene.anims.generateFrameNumbers('spring_crops', { start: 10, end: 10 }),
      frameRate: 1,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'cauliflower_stage_3',
      frames: this.scene.anims.generateFrameNumbers('spring_crops', { start: 11, end: 11 }),
      frameRate: 1,
      repeat: 0
    });

    // Potato growth stages
    this.scene.anims.create({
      key: 'potato_stage_0',
      frames: this.scene.anims.generateFrameNumbers('spring_crops', { start: 16, end: 16 }),
      frameRate: 1,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'potato_stage_1',
      frames: this.scene.anims.generateFrameNumbers('spring_crops', { start: 17, end: 17 }),
      frameRate: 1,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'potato_stage_2',
      frames: this.scene.anims.generateFrameNumbers('spring_crops', { start: 18, end: 18 }),
      frameRate: 1,
      repeat: 0
    });

    this.scene.anims.create({
      key: 'potato_stage_3',
      frames: this.scene.anims.generateFrameNumbers('spring_crops', { start: 19, end: 19 }),
      frameRate: 1,
      repeat: 0
    });
  }

  /**
   * Create UI animations
   */
  public createUIAnimations(): void {
    // Inventory slot highlight
    this.scene.anims.create({
      key: 'slot_highlight',
      frames: [
        { key: 'ui_slot', frame: 0 },
        { key: 'ui_slot', frame: 1 }
      ],
      frameRate: 2,
      repeat: -1,
      yoyo: true
    });

    // Button press animation
    this.scene.anims.create({
      key: 'button_press',
      frames: [
        { key: 'ui_button', frame: 0 },
        { key: 'ui_button', frame: 1 },
        { key: 'ui_button', frame: 0 }
      ],
      frameRate: 10,
      repeat: 0
    });
  }

  /**
   * Create particle effect animations
   */
  public createParticleAnimations(): void {
    // Dust particles when tilling
    this.scene.anims.create({
      key: 'dust_particle',
      frames: this.scene.anims.generateFrameNumbers('particles', { start: 0, end: 3 }),
      frameRate: 12,
      repeat: 0
    });

    // Water splash particles
    this.scene.anims.create({
      key: 'water_splash',
      frames: this.scene.anims.generateFrameNumbers('particles', { start: 4, end: 7 }),
      frameRate: 15,
      repeat: 0
    });

    // Harvest sparkle effect
    this.scene.anims.create({
      key: 'harvest_sparkle',
      frames: this.scene.anims.generateFrameNumbers('particles', { start: 8, end: 11 }),
      frameRate: 10,
      repeat: 0
    });
  }

  /**
   * Play animation with optional callback
   */
  public playAnimation(
    sprite: Phaser.GameObjects.Sprite, 
    animKey: string, 
    onComplete?: () => void
  ): void {
    if (onComplete) {
      sprite.once('animationcomplete', onComplete);
    }
    sprite.play(animKey);
  }

  /**
   * Smoothly transition between animations
   */
  public transitionAnimation(
    sprite: Phaser.GameObjects.Sprite,
    fromAnim: string,
    toAnim: string,
    transitionTime: number = 100
  ): void {
    // Simple crossfade transition
    const originalAlpha = sprite.alpha;
    
    this.scene.tweens.add({
      targets: sprite,
      alpha: 0,
      duration: transitionTime / 2,
      onComplete: () => {
        sprite.play(toAnim);
        this.scene.tweens.add({
          targets: sprite,
          alpha: originalAlpha,
          duration: transitionTime / 2
        });
      }
    });
  }

  /**
   * Create a looping idle animation with subtle movement
   */
  public createIdleBreathing(sprite: Phaser.GameObjects.Sprite): void {
    this.scene.tweens.add({
      targets: sprite,
      scaleY: 1.02,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Create a bobbing animation for floating objects
   */
  public createBobbing(sprite: Phaser.GameObjects.Sprite, amplitude: number = 2): void {
    const originalY = sprite.y;
    
    this.scene.tweens.add({
      targets: sprite,
      y: originalY - amplitude,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Get animation duration in milliseconds
   */
  public getAnimationDuration(animKey: string): number {
    const anim = this.scene.anims.get(animKey);
    if (!anim) return 0;
    
    return (anim.frames.length / anim.frameRate) * 1000;
  }

  /**
   * Check if animation exists
   */
  public hasAnimation(animKey: string): boolean {
    return this.scene.anims.exists(animKey);
  }

  /**
   * Remove all animations (cleanup)
   */
  public destroy(): void {
    // Phaser handles animation cleanup automatically
    // This method is here for consistency with other systems
  }
}