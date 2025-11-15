import * as Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  preload() {
    // Load background
    this.load.svg('background', '/assets/egg-catch/backgrounds/farm-scene.svg', { scale: 1 });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

    // Title - adjusted for 700x500 (landscape)
    this.add
      .text(width / 2, 80, '🥚 Egg Catch', {
        fontSize: '48px',
        fill: '#fff',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Instructions - smaller text
    this.add
      .text(width / 2, 170, 'Di chuyển chuột/ngón tay\nđể bắt trứng rơi!', {
        fontSize: '20px',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 3,
        align: 'center',
      })
      .setOrigin(0.5);

    // Click to start - adjusted position
    const startText = this.add
      .text(width / 2, 260, '👆 Nhấn để bắt đầu', {
        fontSize: '26px',
        fill: '#ffff00',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Blink animation
    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.3 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Start on click/touch
    this.input.once('pointerdown', () => {
      this.startCountdown();
    });
  }

  startCountdown() {
    const { width, height } = this.cameras.main;

    // Clear scene
    this.children.removeAll();

    // Background
    this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

    let count = 3;
    const countdownText = this.add
      .text(width / 2, height / 2, count.toString(), {
        fontSize: '100px',
        fill: '#fff',
        fontStyle: 'bold',
        stroke: '#ff0000',
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    // Countdown timer
    const timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (count > 0) {
          // Show number
          countdownText.setText(count.toString());
          countdownText.setAlpha(0);

          // Animation
          this.tweens.add({
            targets: countdownText,
            alpha: { from: 0, to: 1 },
            scale: { from: 2, to: 1 },
            duration: 300,
            ease: 'Back.easeOut',
          });

          // Play sound (beep)
          this.playBeep(count === 1 ? 800 : 600);

          count--;
        } else {
          // GO!
          countdownText.setText('GO!');
          countdownText.setFill('#00ff00');
          countdownText.setStroke('#000', 10);
          countdownText.setAlpha(0);

          this.tweens.add({
            targets: countdownText,
            alpha: { from: 0, to: 1 },
            scale: { from: 2, to: 1.5 },
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
              // Play GO sound
              this.playBeep(1000);

              // Start game after 500ms
              this.time.delayedCall(500, () => {
                this.scene.start('GameScene');
              });
            },
          });

          timer.remove();
        }
      },
      loop: true,
    });
  }

  playBeep(frequency) {
    // Simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.type = 'square';
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
      console.warn('Audio not available');
    }
  }
}
