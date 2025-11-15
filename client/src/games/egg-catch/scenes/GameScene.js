import * as Phaser from 'phaser';
import { soundGenerator } from '../utils/SoundGenerator';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.score = 0;
    this.gameTime = 60; // 60 seconds
    this.lives = 3;
    this.startTime = null;
    this.combo = 0;
    this.maxCombo = 0;
    this.difficulty = 1;
    this.goldEggChance = 0.1; // 10% chance for golden egg
  }

  preload() {
    // Add loading progress feedback
    this.load.on('progress', (value) => {

    });

    this.load.on('filecomplete', (key) => {

    });

    this.load.on('loaderror', (file) => {
      console.error('Error loading:', file.key, file.src);
    });

    // Load SVG assets
    this.load.svg('background', '/assets/egg-catch/backgrounds/farm-scene.svg', { scale: 1 });
    this.load.svg('egg', '/assets/egg-catch/sprites/egg.svg', { width: 40, height: 50 });
    this.load.svg('goldEgg', '/assets/egg-catch/sprites/golden-egg.svg', { width: 40, height: 50 });
    this.load.svg('basket', '/assets/egg-catch/sprites/basket.svg', { width: 100, height: 50 });
    this.load.svg('bomb', '/assets/egg-catch/sprites/bomb.svg', { width: 50, height: 50 });
    this.load.svg('heart', '/assets/egg-catch/ui/heart-icon.svg', { width: 40, height: 40 });
    this.load.svg('coin', '/assets/egg-catch/ui/coin-icon.svg', { width: 30, height: 30 });
    this.load.svg('star', '/assets/egg-catch/ui/star-icon.svg', { width: 35, height: 35 });
  }

  create() {
    this.startTime = Date.now();
    
    // Get game dimensions
    const { width, height } = this.cameras.main;
    
    // Test audio on first interaction

    soundGenerator.resume();
    
    // Play test sound after 500ms
    setTimeout(() => {

      soundGenerator.playTestSound();
    }, 500);

    // Background image (scaled to fit 500x700)
    const bg = this.add.image(width / 2, height / 2, 'background');
    if (bg.texture.key === '__MISSING') {
      console.error('❌ Background not loaded! Creating fallback...');
      // Fallback: Create a simple gradient background
      const graphics = this.add.graphics();
      graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x90EE90, 0x90EE90, 1);
      graphics.fillRect(0, 0, width, height);
    } else {

      bg.setDisplaySize(width, height);
    }

    // Basket (player) - positioned at bottom, adjusted for 700x500
    this.basket = this.physics.add.sprite(width / 2, height - 50, 'basket')
      .setCollideWorldBounds(true)
      .setScale(0.5); // Smaller basket for smaller screen
    


    // Input handling (mouse & touch)
    this.input.on('pointermove', (pointer) => {
      this.basket.x = pointer.x;
    });

    // Touch handling for mobile
    this.input.on('pointerdown', (pointer) => {
      this.basket.x = pointer.x;
    });

    // Groups for eggs and bombs
    this.eggs = this.physics.add.group();
    this.bombs = this.physics.add.group();

    // Spawn eggs (speed increases over time)
    this.eggTimer = this.time.addEvent({
      delay: 1000,
      callback: this.spawnEgg,
      callbackScope: this,
      loop: true,
    });

    // Spawn bombs (less frequently, increases over time)
    this.bombTimer = this.time.addEvent({
      delay: 4000,
      callback: this.spawnBomb,
      callbackScope: this,
      loop: true,
    });

    // Difficulty increase timer
    this.difficultyTimer = this.time.addEvent({
      delay: 10000,
      callback: this.increaseDifficulty,
      callbackScope: this,
      loop: true,
    });

    // Collisions
    this.physics.add.overlap(this.basket, this.eggs, this.catchEgg, null, this);
    this.physics.add.overlap(this.basket, this.bombs, this.hitBomb, null, this);

    // UI with icons - adjusted for 700x500
    this.scoreText = this.add
      .text(50, 16, '0', {
        fontSize: '24px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 3,
        fontStyle: 'bold',
      })
      .setScrollFactor(0);
    
    this.add.image(22, 28, 'star').setScrollFactor(0).setScale(0.5);

    this.timerText = this.add
      .text(350, 16, '60', {
        fontSize: '24px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 3,
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0);

    // Lives with heart icons - adjusted position for 700px width
    this.livesText = this.add
      .text(650, 28, '', {
        fontSize: '24px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 3,
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5)
      .setScrollFactor(0);
    
    this.heartIcons = [];
    for (let i = 0; i < 3; i++) {
      const heart = this.add.image(580 + i * 30, 28, 'heart').setScrollFactor(0).setScale(0.6);
      this.heartIcons.push(heart);
    }

    // Combo text at bottom - adjusted for 700x500
    this.comboText = this.add
      .text(width / 2, height - 40, '', {
        fontSize: '20px',
        fill: '#ffff00',
        stroke: '#000',
        strokeThickness: 3,
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setAlpha(0);

    // Countdown timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    // Safety check: ensure groups exist before accessing
    if (!this.eggs || !this.bombs || !this.cameras || !this.cameras.main) {
      return;
    }

    const { height } = this.cameras.main;
    
    // Check eggs that fall off screen
    this.eggs.children.entries.forEach((egg) => {
      if (egg && egg.active && egg.y > height && !egg.getData('caught')) {
        this.missEgg(egg);
      }
    });

    // Check bombs that fall off screen
    this.bombs.children.entries.forEach((bomb) => {
      if (bomb && bomb.active && bomb.y > height) {
        bomb.destroy();
      }
    });
  }

  spawnEgg() {
    if (!this.scene.isActive('GameScene')) return;

    const { width } = this.cameras.main;
    const x = Phaser.Math.Between(50, width - 50);
    const isGolden = Math.random() < this.goldEggChance;
    const eggType = isGolden ? 'goldEgg' : 'egg';
    
    // Create egg sprite
    const egg = this.eggs.create(x, 0, eggType);
    
    // Check if texture loaded
    if (egg.texture.key === '__MISSING') {
      console.error('❌ Egg texture missing:', eggType);
      // Create a fallback circle
      egg.destroy();
      const graphics = this.add.graphics();
      graphics.fillStyle(isGolden ? 0xFFD700 : 0xFFFFFF, 1);
      graphics.fillCircle(0, 0, 20);
      graphics.generateTexture('fallback-egg', 40, 40);
      graphics.destroy();
      const fallbackEgg = this.eggs.create(x, 0, 'fallback-egg');

      this.setupEgg(fallbackEgg, isGolden);
    } else {

      this.setupEgg(egg, isGolden);
    }
  }

  setupEgg(egg, isGolden) {
    const baseSpeed = 150 + (this.difficulty * 20);
    egg.setVelocity(0, Phaser.Math.Between(baseSpeed, baseSpeed + 100));
    egg.setData('isGolden', isGolden);
    egg.setData('points', isGolden ? 50 : 10);
    egg.setData('caught', false); // Track if egg was caught
  }

  spawnBomb() {
    if (!this.scene.isActive('GameScene') || this.gameTime < 10) return;

    const { width } = this.cameras.main;
    const x = Phaser.Math.Between(50, width - 50);
    const bomb = this.bombs.create(x, 0, 'bomb');
    const baseSpeed = 200 + (this.difficulty * 30);
    bomb.setVelocity(0, Phaser.Math.Between(baseSpeed, baseSpeed + 100));
  }

  catchEgg(basket, egg) {
    if (!egg.active || egg.getData('caught')) return; // Check if egg is still active and not already caught
    
    const points = egg.getData('points');
    const isGolden = egg.getData('isGolden');
    
    egg.setData('caught', true); // Mark as caught
    egg.destroy();
    this.score += points;
    this.combo++;
    
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }

    this.scoreText.setText(this.score.toString());

    // Play sound

    if (isGolden) {
      soundGenerator.playCatchGoldenEgg();
    } else {
      soundGenerator.playCatchEgg();
    }

    // Show combo text
    if (this.combo >= 3) {
      soundGenerator.playCombo(this.combo);
      this.comboText.setText(`COMBO x${this.combo}!`);
      this.comboText.setAlpha(1);
      this.tweens.add({
        targets: this.comboText,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
      });
    }

    // Visual feedback
    this.tweens.add({
      targets: this.basket,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 100,
      yoyo: true,
    });

    // Particle effect
    if (isGolden) {
      this.createParticles(basket.x, basket.y, 0xffd700);
    } else {
      this.createParticles(basket.x, basket.y, 0xFFFFFF);
    }

    // Visual feedback - simple color overlay instead of flash (flash has bugs)
    // this.cameras.main.flash(50, 100, 255, 100, false, 0.2); // Removed - causes error
  }

  createParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
      const particle = this.add.circle(x, y, 3, color);
      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-50, 50),
        y: y + Phaser.Math.Between(-50, 50),
        alpha: 0,
        duration: 500,
        onComplete: () => particle.destroy(),
      });
    }
  }

  missEgg(egg) {
    if (!egg.active || egg.getData('caught')) return; // Check if egg is still active and not already caught
    
    egg.destroy();
    this.combo = 0; // Reset combo
    this.lives--;
    
    // Update heart icons
    if (this.lives >= 0 && this.lives < 3) {
      this.heartIcons[this.lives].setAlpha(0.2);
    }

    // Play sound
    soundGenerator.playMissEgg();

    // Screen shake - disabled due to Phaser bug
    // this.cameras.main.shake(200, 0.01);

    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  hitBomb(basket, bomb) {
    bomb.destroy();
    this.combo = 0; // Reset combo
    this.lives--;
    
    // Update heart icons
    if (this.lives >= 0 && this.lives < 3) {
      this.heartIcons[this.lives].setAlpha(0.2);
    }

    // Play sound
    soundGenerator.playHitBomb();

    // Flash and shake effects - disabled due to Phaser bug
    // this.cameras.main.flash(300, 255, 0, 0);
    // this.cameras.main.shake(300, 0.02);

    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  increaseDifficulty() {
    this.difficulty++;
    
    // Play sound
    soundGenerator.playLevelUp();
    
    // Increase egg spawn rate
    if (this.eggTimer.delay > 500) {
      this.eggTimer.delay -= 50;
    }

    // Increase bomb spawn rate
    if (this.bombTimer.delay > 2000) {
      this.bombTimer.delay -= 200;
    }

    // Increase golden egg chance
    if (this.goldEggChance < 0.3) {
      this.goldEggChance += 0.02;
    }

    // Visual feedback - adjusted for 500x700
    const { width, height } = this.cameras.main;
    const levelText = this.add
      .text(width / 2, height / 2, `LEVEL ${this.difficulty}!`, {
        fontSize: '42px',
        fill: '#ff0',
        stroke: '#000',
        strokeThickness: 5,
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: levelText,
      alpha: { from: 0, to: 1 },
      y: { from: height / 2, to: height / 2 - 50 },
      scale: { from: 0.5, to: 1.2 },
      duration: 500,
      yoyo: true,
      onComplete: () => levelText.destroy(),
    });
  }

  updateTimer() {
    this.gameTime--;
    this.timerText.setText(this.gameTime.toString());

    // Warning when time is low
    if (this.gameTime <= 10) {
      this.timerText.setFill('#ff0000');
      this.tweens.add({
        targets: this.timerText,
        scale: { from: 1, to: 1.2 },
        duration: 100,
        yoyo: true,
      });
    }

    if (this.gameTime <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    // Stop timers
    if (this.gameTimer) this.gameTimer.remove();
    if (this.eggTimer) this.eggTimer.remove();
    if (this.bombTimer) this.bombTimer.remove();
    if (this.difficultyTimer) this.difficultyTimer.remove();

    // Play sound
    if (this.score >= 500) {
      soundGenerator.playVictory();
    } else {
      soundGenerator.playGameOver();
    }

    // Calculate play time
    const playTime = Math.floor((Date.now() - this.startTime) / 1000);

    // Emit game over event for modal to show immediately
    this.game.events.emit('gameover', this.score, playTime);
  }
}
