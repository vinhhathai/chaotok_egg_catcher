/**
 * Sound Generator using Web Audio API
 * Tạo sound effects không cần file audio
 */

class SoundGenerator {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.3;
    this.initialized = false;
    this.init();
  }

  init() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
        this.initialized = true;

      } else {
        console.warn('⚠️ Web Audio API not supported');
      }
    } catch (e) {
      console.error('❌ Failed to initialize SoundGenerator:', e);
    }
  }

  // Resume context (needed for some browsers)
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {

      });
    } else if (this.audioContext) {

    }
  }

  // Catch egg sound (pop/plop)
  playCatchEgg() {
    if (!this.audioContext) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    // Oscillator for the "plop" sound
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Frequency sweep (high to low)
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    
    // Volume envelope
    gainNode.gain.setValueAtTime(this.masterVolume * 0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.type = 'sine';
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Golden egg catch (special chime)
  playCatchGoldenEgg() {
    if (!this.audioContext) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    // Multiple oscillators for chord
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      osc.frequency.value = freq;
      gainNode.gain.setValueAtTime(this.masterVolume * 0.2, now + i * 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4 + i * 0.05);
      
      osc.type = 'sine';
      osc.start(now + i * 0.05);
      osc.stop(now + 0.4 + i * 0.05);
    });
  }

  // Miss egg sound (negative tone)
  playMissEgg() {
    if (!this.audioContext) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Descending frequency
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
    
    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    osc.type = 'sawtooth';
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Hit bomb sound (explosion)
  playHitBomb() {
    if (!this.audioContext) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    // White noise for explosion
    const bufferSize = this.audioContext.sampleRate * 0.3;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 0.2);
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(this.masterVolume * 0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    noise.start(now);
    noise.stop(now + 0.3);
  }

  // Combo sound (ascending notes)
  playCombo(comboCount) {
    if (!this.audioContext) return;
    this.resume();

    const now = this.audioContext.currentTime;
    const baseFreq = 440 + (comboCount * 20);
    
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.1);
    
    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    osc.type = 'triangle';
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Level up sound (fanfare)
  playLevelUp() {
    if (!this.audioContext) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    // Victory fanfare notes
    const melody = [523.25, 587.33, 659.25, 783.99];
    
    melody.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      osc.frequency.value = freq;
      gainNode.gain.setValueAtTime(this.masterVolume * 0.25, now + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3 + i * 0.1);
      
      osc.type = 'square';
      osc.start(now + i * 0.1);
      osc.stop(now + 0.3 + i * 0.1);
    });
  }

  // Game over sound (sad trombone)
  playGameOver() {
    if (!this.audioContext) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    const notes = [392, 349.23, 329.63, 293.66];
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      osc.frequency.value = freq;
      gainNode.gain.setValueAtTime(this.masterVolume * 0.3, now + i * 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4 + i * 0.2);
      
      osc.type = 'sawtooth';
      osc.start(now + i * 0.2);
      osc.stop(now + 0.4 + i * 0.2);
    });
  }

  // Victory sound (high score)
  playVictory() {
    if (!this.audioContext) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    // Victory arpeggio
    const melody = [523.25, 659.25, 783.99, 1046.50];
    
    melody.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      osc.frequency.value = freq;
      gainNode.gain.setValueAtTime(this.masterVolume * 0.3, now + i * 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5 + i * 0.08);
      
      osc.type = 'sine';
      osc.start(now + i * 0.08);
      osc.stop(now + 0.5 + i * 0.08);
    });
  }

  // Background music (simple loop)
  playBackgroundMusic() {
    if (!this.audioContext) return;
    this.resume();

    // Simple pleasant melody loop
    const melody = [
      { freq: 523.25, duration: 0.3 }, // C5
      { freq: 587.33, duration: 0.3 }, // D5
      { freq: 659.25, duration: 0.3 }, // E5
      { freq: 523.25, duration: 0.3 }, // C5
      { freq: 659.25, duration: 0.3 }, // E5
      { freq: 587.33, duration: 0.6 }, // D5
    ];

    let time = this.audioContext.currentTime;
    
    melody.forEach((note) => {
      const osc = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      osc.frequency.value = note.freq;
      gainNode.gain.setValueAtTime(this.masterVolume * 0.1, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + note.duration);
      
      osc.type = 'sine';
      osc.start(time);
      osc.stop(time + note.duration);
      
      time += note.duration;
    });
  }

  // Set master volume (0 to 1)
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  // Test sound (for debugging)
  playTestSound() {
    if (!this.audioContext) {
      console.error('❌ Audio context not initialized');
      return;
    }
    
    this.resume();

    
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    osc.frequency.value = 440; // A4 note
    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    osc.type = 'sine';
    osc.start(now);
    osc.stop(now + 0.5);
    

  }
}

// Export singleton instance
export const soundGenerator = new SoundGenerator();
