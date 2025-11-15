import * as Phaser from 'phaser';
import { soundGenerator } from '../utils/SoundGenerator';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.maxCombo = data.maxCombo || 0;
    this.difficulty = data.difficulty || 1;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

    // Game Over text with animation - adjusted for 700x500 (landscape)
    const gameOverText = this.add
      .text(width / 2, 60, 'Game Over!', {
        fontSize: '52px',
        fill: '#fff',
        fontStyle: 'bold',
        stroke: '#ff0000',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: gameOverText,
      alpha: 1,
      scale: { from: 0.5, to: 1 },
      duration: 500,
      ease: 'Back.easeOut',
    });

    // Stats panel - adjusted for 700x500 (landscape)
    const statsY = 150;

    // Score
    this.add
      .text(width / 2, statsY, `Score: ${this.finalScore}`, {
        fontSize: '36px',
        fill: '#ffd700',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Max Combo
    this.add
      .text(width / 2, statsY + 50, `Max Combo: x${this.maxCombo}`, {
        fontSize: '24px',
        fill: '#ff6b6b',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Level reached
    this.add
      .text(width / 2, statsY + 85, `Level: ${this.difficulty}`, {
        fontSize: '24px',
        fill: '#4ecdc4',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Coins earned
    const coinsEarned = Math.floor(this.finalScore * 0.1);
    const coinText = this.add
      .text(width / 2, statsY + 130, `+${coinsEarned} 🪙`, {
        fontSize: '28px',
        fill: '#4caf50',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Coin animation
    this.tweens.add({
      targets: coinText,
      scale: { from: 0.8, to: 1.1 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    // Performance rating - adjusted for 700x500
    let rating = '⭐';
    if (this.finalScore >= 500) rating = '⭐⭐⭐';
    else if (this.finalScore >= 300) rating = '⭐⭐';

    this.add
      .text(width / 2, statsY + 180, rating, {
        fontSize: '40px',
      })
      .setOrigin(0.5);

    // Buttons - adjusted for 700x500
    const buttonsY = 450;

    // Play again button
    const playAgainBtn = this.add
      .text(width / 2 - 100, buttonsY, 'Chơi lại', {
        fontSize: '22px',
        fill: '#fff',
        backgroundColor: '#667eea',
        padding: { x: 20, y: 10 },
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playAgainBtn.on('pointerover', () => {
      playAgainBtn.setStyle({ backgroundColor: '#764ba2' });
      this.tweens.add({
        targets: playAgainBtn,
        scale: 1.1,
        duration: 100,
      });
    });

    playAgainBtn.on('pointerout', () => {
      playAgainBtn.setStyle({ backgroundColor: '#667eea' });
      this.tweens.add({
        targets: playAgainBtn,
        scale: 1,
        duration: 100,
      });
    });

    playAgainBtn.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Back button - adjusted for 500x700
    const backBtn = this.add
      .text(width / 2 + 100, buttonsY, 'Thoát', {
        fontSize: '22px',
        fill: '#fff',
        backgroundColor: '#ee5a6f',
        padding: { x: 20, y: 10 },
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => {
      backBtn.setStyle({ backgroundColor: '#c73e51' });
      this.tweens.add({
        targets: backBtn,
        scale: 1.1,
        duration: 100,
      });
    });

    backBtn.on('pointerout', () => {
      backBtn.setStyle({ backgroundColor: '#ee5a6f' });
      this.tweens.add({
        targets: backBtn,
        scale: 1,
        duration: 100,
      });
    });

    backBtn.on('pointerdown', () => {
      // Navigate back to game list
      window.history.back();
    });

    // Falling confetti animation
    if (this.finalScore >= 300) {
      this.createConfetti();
    }
  }

  createConfetti() {
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(-200, 0);
      const colors = [0xffd700, 0xff6b6b, 0x4ecdc4, 0xa29bfe, 0xfd79a8];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const confetti = this.add.circle(x, y, 5, color);
      
      this.tweens.add({
        targets: confetti,
        y: 700,
        x: x + Phaser.Math.Between(-100, 100),
        angle: Phaser.Math.Between(0, 720),
        duration: Phaser.Math.Between(2000, 4000),
        ease: 'Sine.easeInOut',
        onComplete: () => confetti.destroy(),
      });
    }
  }
}
