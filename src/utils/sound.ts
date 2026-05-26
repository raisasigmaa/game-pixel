// Web Audio API Retro Sound Effects Synthesizer

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private backgroundLoopInterval: any = null;
  private isMusicPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.isMuted;
  }

  getMuteStatus() {
    return this.isMuted;
  }

  // Plays a classic retro laser/slash sound
  playAttack(type: 'knight' | 'mage' | 'rogue' = 'knight') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      if (type === 'knight') {
        // Broad low to high frequency slash
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'mage') {
        // Magic magic fire ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else {
        // Fast rogue slash
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Plays an explosion/damage sound
  playHit() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(40, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignored
    }
  }

  // Classic dual-tone retro coin pick up
  playCoin() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      const playTone = (freq: number, start: number, duration: number) => {
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'square';
        o.frequency.value = freq;
        o.connect(g);
        g.connect(this.ctx.destination);
        g.gain.setValueAtTime(0.06, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + duration);
        o.start(start);
        o.stop(start + duration);
      };

      playTone(987.77, now, 0.08); // B5 note
      playTone(1318.51, now + 0.08, 0.25); // E6 note
    } catch {}
  }

  // High-pitch level up arpeggio
  playLevelUp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
      const noteDuration = 0.07;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        
        o.type = 'triangle';
        o.frequency.value = freq;
        o.connect(g);
        g.connect(this.ctx.destination);
        
        const start = now + idx * noteDuration;
        g.gain.setValueAtTime(0.12, start);
        g.gain.exponentialRampToValueAtTime(0.01, start + 0.15);
        
        o.start(start);
        o.stop(start + 0.2);
      });
    } catch {}
  }

  // Soft upgrade/heal effect
  playHeal() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.3);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  // Descending sad gamer over tone
  playGameOver() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [440, 415.3, 392, 349.23, 293.66, 220, 146.83]; // A4, G#4, G4, F4, D4, A3, D3
      const noteDuration = 0.15;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        
        o.type = 'sawtooth';
        o.frequency.value = freq;
        o.connect(g);
        g.connect(this.ctx.destination);
        
        const start = now + idx * noteDuration;
        g.gain.setValueAtTime(0.1, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
        
        o.start(start);
        o.stop(start + 0.3);
      });
    } catch {}
  }

  // Start continuous 8-bit melody loop
  startMusic() {
    if (this.isMuted || this.isMusicPlaying) return;
    try {
      this.initCtx();
      this.isMusicPlaying = true;
      
      const melody = [
        261.63, 293.66, 329.63, 349.23, 392.00, 392.00, 440.00, 392.00,
        349.23, 329.63, 293.66, 261.63, 392.00, 392.00, 349.23, 329.63,
        293.66, 293.66, 329.63, 261.63, 220.00, 220.00, 246.94, 261.63,
        293.66, 329.63, 293.66, 261.63, 246.94, 196.00, 220.00, 261.63
      ];
      
      let step = 0;
      const stepDuration = 0.25; // Quarter second per note

      this.backgroundLoopInterval = setInterval(() => {
        if (this.isMuted || !this.isMusicPlaying) return;
        try {
          this.initCtx();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          
          // Play current note in the loop
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          
          // Retro triangle channel (bassiness)
          o.type = 'triangle';
          o.frequency.value = melody[step % melody.length] / 2; // Bass octaves
          o.connect(g);
          g.connect(this.ctx.destination);
          
          g.gain.setValueAtTime(0.04, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + stepDuration - 0.02);
          
          o.start(now);
          o.stop(now + stepDuration);

          // Add a synchronized high chime occasionally on even beats
          if (step % 2 === 0) {
            const highO = this.ctx.createOscillator();
            const highG = this.ctx.createGain();
            highO.type = 'sine';
            highO.frequency.value = melody[(step + 4) % melody.length] * 2; // Arpeggiator harmonies
            highO.connect(highG);
            highG.connect(this.ctx.destination);

            highG.gain.setValueAtTime(0.015, now);
            highG.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            highO.start(now);
            highO.stop(now + 0.15);
          }

          step++;
        } catch {
          // Keep loop resilient
        }
      }, stepDuration * 1000);

    } catch (e) {
      console.warn('Could not launch synth soundtrack:', e);
    }
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.backgroundLoopInterval) {
      clearInterval(this.backgroundLoopInterval);
      this.backgroundLoopInterval = null;
    }
  }
}

export const sfx = new SoundSynthesizer();
