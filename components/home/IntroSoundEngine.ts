/**
 * Web Audio API sound engine for the homepage cinematic intro sequence.
 * Follows the SFX class pattern from AsteroidsGame.
 */
export class IntroSoundEngine {
  private ctx: AudioContext | null = null;
  private humNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;
  private phosphorNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;
  private _enabled = false;
  private gestureCleanup: (() => void) | null = null;

  private ensure(): AudioContext | null {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch (e) {
        console.warn('[IntroSoundEngine] Failed to create AudioContext:', e);
        return null;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Enable audio — awaits AudioContext resume before marking ready.
   *  If the browser blocks autoplay (no user gesture yet), sets up one-time
   *  interaction listeners so sounds play as soon as the user clicks/taps/types. */
  async enable(): Promise<boolean> {
    const c = this.ensure();
    if (!c) return false;
    try {
      await c.resume();
    } catch {
      // AudioContext.resume() can fail in restricted environments
    }
    this._enabled = true;

    // If context is still suspended (browser requires user gesture),
    // listen for first interaction to resume it. Sounds already scheduled
    // on the suspended context will play once currentTime starts advancing.
    if (c.state === 'suspended') {
      const resume = () => {
        c.resume().catch(() => {});
        cleanup();
      };
      const cleanup = () => {
        document.removeEventListener('click', resume);
        document.removeEventListener('touchstart', resume);
        document.removeEventListener('keydown', resume);
        this.gestureCleanup = null;
      };
      document.addEventListener('click', resume);
      document.addEventListener('touchstart', resume, { passive: true });
      document.addEventListener('keydown', resume);
      this.gestureCleanup = cleanup;
    }

    return true;
  }

  get enabled() {
    return this._enabled;
  }

  /** Start screen: coin-insert chirp — ascending 2-note chime */
  coinInsert() {
    const c = this.ensure();
    if (!c || !this._enabled) return;

    const now = c.currentTime;
    const freqs = [880, 1320];
    freqs.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.1, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.12);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.15);
    });
  }

  /** Phase 1: Slow, dramatic game-over melody — 4 descending square-wave notes */
  gameOverMelody() {
    const c = this.ensure();
    if (!c || !this._enabled) return;

    const freqs = [440, 370, 311, 220];
    const noteDuration = 0.4;
    const now = c.currentTime;

    freqs.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + i * noteDuration);
      gain.gain.setValueAtTime(0.12, now + i * noteDuration);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * noteDuration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now + i * noteDuration);
      osc.stop(now + (i + 1) * noteDuration + 0.05);
    });
  }

  /** Phase 1-2: Ambient CRT hum — detuned 60 Hz sine pair */
  startCrtHum() {
    const c = this.ensure();
    if (!c || !this._enabled || this.humNodes) return;

    const gain = c.createGain();
    gain.gain.setValueAtTime(0.03, c.currentTime);
    const osc1 = c.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(59.5, c.currentTime);
    const osc2 = c.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(60.5, c.currentTime);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(c.destination);
    osc1.start();
    osc2.start();
    this.humNodes = { osc1, osc2, gain };
  }

  stopCrtHum() {
    if (!this.humNodes) return;
    const { osc1, osc2, gain } = this.humNodes;
    const c = this.ctx;
    if (c) {
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);
    }
    try { osc1.stop(c ? c.currentTime + 0.15 : 0); } catch { /* already stopped */ }
    try { osc2.stop(c ? c.currentTime + 0.15 : 0); } catch { /* already stopped */ }
    this.humNodes = null;
  }

  /** Phase 3: CRT power-down — descending whine + thunk */
  crtPowerDown() {
    const c = this.ensure();
    if (!c || !this._enabled) return;

    const now = c.currentTime;

    // Descending whine
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2000, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.8);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.85);

    // Thunk at end — noise burst through lowpass
    const bufferSize = Math.floor(c.sampleRate * 0.05);
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = c.createBufferSource();
    noise.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, now + 0.7);
    const noiseGain = c.createGain();
    noiseGain.gain.setValueAtTime(0.1, now + 0.7);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(c.destination);
    noise.start(now + 0.7);
    noise.stop(now + 0.9);
  }

  /** Phase 4: CRT warm-up rising tone */
  crtWarmUp() {
    const c = this.ensure();
    if (!c || !this._enabled) return;

    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  /** Phase 4: Green phosphor ambient hum — beating sine pair */
  startPhosphorHum() {
    const c = this.ensure();
    if (!c || !this._enabled || this.phosphorNodes) return;

    const gain = c.createGain();
    gain.gain.setValueAtTime(0.025, c.currentTime);
    const osc1 = c.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(59.5, c.currentTime);
    const osc2 = c.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(60.5, c.currentTime);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(c.destination);
    osc1.start();
    osc2.start();
    this.phosphorNodes = { osc1, osc2, gain };
  }

  stopPhosphorHum() {
    if (!this.phosphorNodes) return;
    const { osc1, osc2, gain } = this.phosphorNodes;
    const c = this.ctx;
    if (c) {
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
    }
    try { osc1.stop(c ? c.currentTime + 0.1 : 0); } catch { /* already stopped */ }
    try { osc2.stop(c ? c.currentTime + 0.1 : 0); } catch { /* already stopped */ }
    this.phosphorNodes = null;
  }

  /** Phase 4: Text appearance blip */
  textBlip() {
    const c = this.ensure();
    if (!c || !this._enabled) return;

    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1000, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  /** Phase 5: Unplug — dry power-off click */
  unplugClick() {
    const c = this.ensure();
    if (!c || !this._enabled) return;

    const now = c.currentTime;
    const bufferSize = Math.floor(c.sampleRate * 0.02);
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = c.createBufferSource();
    noise.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.Q.setValueAtTime(1, now);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    noise.start(now);
    noise.stop(now + 0.04);
  }

  /** Phase 7: Rebirth — ascending whoosh */
  rebirthWhoosh() {
    const c = this.ensure();
    if (!c || !this._enabled) return;

    const now = c.currentTime;

    // Ascending noise sweep
    const bufferSize = Math.floor(c.sampleRate * 0.8);
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = c.createBufferSource();
    noise.buffer = buffer;
    const bpf = c.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(200, now);
    bpf.frequency.exponentialRampToValueAtTime(8000, now + 0.5);
    bpf.Q.setValueAtTime(0.5, now);
    const noiseGain = c.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    noise.connect(bpf);
    bpf.connect(noiseGain);
    noiseGain.connect(c.destination);
    noise.start(now);
    noise.stop(now + 0.85);

    // Ascending sine sweep
    const osc = c.createOscillator();
    const oscGain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.5);
    oscGain.gain.setValueAtTime(0.1, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc.connect(oscGain);
    oscGain.connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.75);
  }

  /** Cleanup everything */
  dispose() {
    this.gestureCleanup?.();
    this.stopCrtHum();
    this.stopPhosphorHum();
    this._enabled = false;
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
