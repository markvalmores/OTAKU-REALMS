
export class SoundManager {
  private audioCtx: AudioContext | null = null;
  private musicNode: OscillatorNode | null = null;
  private musicGain: GainNode | null = null;

  constructor() {
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  private playSound(freq: number, type: OscillatorType, duration: number, gainValue: number) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(gainValue, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  playHit() { this.playSound(200, 'square', 0.1, 0.1); }
  playDodge() { this.playSound(600, 'triangle', 0.2, 0.1); }
  playSpecial() { this.playSound(100, 'sawtooth', 0.5, 0.15); }
  playLevelUp() { 
    this.playSound(440, 'sine', 0.15, 0.1);
    setTimeout(() => this.playSound(880, 'sine', 0.25, 0.1), 150);
  }

  startCombatMusic() {
    if (!this.audioCtx || this.musicNode) return;
    this.musicNode = this.audioCtx.createOscillator();
    this.musicGain = this.audioCtx.createGain();
    this.musicNode.type = 'triangle';
    this.musicNode.frequency.setValueAtTime(50, this.audioCtx.currentTime);
    this.musicGain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
    this.musicNode.connect(this.musicGain);
    this.musicGain.connect(this.audioCtx.destination);
    this.musicNode.start();
  }

  stopCombatMusic() {
    this.musicNode?.stop();
    this.musicNode = null;
  }
}

export const soundManager = new SoundManager();
