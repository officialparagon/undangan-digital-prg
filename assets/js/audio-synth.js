/**
 * Paragon Party - Cyber EDM Audio Engine
 * Procedural Web Audio API synth + Custom Audio Stream Support
 */

class PartyAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.tempo = 128; // BPM
    this.intervalId = null;
    this.step = 0;
    this.customAudio = null;
    this.mode = 'synth'; // 'synth' or 'custom'
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playKick(time) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.35);

    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.36);
  }

  playHiHat(time, open = false) {
    if (!this.audioCtx) return;
    const dur = open ? 0.2 : 0.05;
    const bufferSize = this.audioCtx.sampleRate * dur;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(open ? 0.25 : 0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    noise.start(time);
    noise.stop(time + dur);
  }

  playSynthNote(freq, time, dur = 0.22) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const filter = this.audioCtx.createBiquadFilter();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, time);
    filter.frequency.exponentialRampToValueAtTime(450, time + dur);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + dur);
  }

  playBass(freq, time, dur = 0.35) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const filter = this.audioCtx.createBiquadFilter();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, time);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + dur);
  }

  startSynthLoop() {
    const secondsPerBeat = 60.0 / this.tempo;
    const stepTime = secondsPerBeat / 4; // 16th notes
    let nextNoteTime = this.audioCtx.currentTime + 0.05;

    // Melody notes in Hz (Cyber Ice EDM scale: Am / F / C / G vibe)
    const melody = [
      440, 523.25, 659.25, 880, 659.25, 523.25, 587.33, 440,
      392, 523.25, 659.25, 783.99, 659.25, 587.33, 493.88, 440
    ];
    const bassline = [110, 110, 87.31, 87.31, 130.81, 130.81, 98.0, 98.0];

    const scheduler = () => {
      while (nextNoteTime < this.audioCtx.currentTime + 0.15) {
        // Kick on every quarter note (step 0, 4, 8, 12)
        if (this.step % 4 === 0) {
          this.playKick(nextNoteTime);
        }

        // Hi-hats on off-beats (step 2, 6, 10, 14) and 16ths
        if (this.step % 2 === 1) {
          this.playHiHat(nextNoteTime, this.step % 4 === 2);
        }

        // Bass
        if (this.step % 2 === 0) {
          const bassIdx = Math.floor(this.step / 2) % bassline.length;
          this.playBass(bassline[bassIdx], nextNoteTime, stepTime * 1.8);
        }

        // Arpeggiated synth lead
        const note = melody[this.step % melody.length];
        this.playSynthNote(note, nextNoteTime, stepTime * 0.9);

        nextNoteTime += stepTime;
        this.step = (this.step + 1) % 16;
      }
    };

    this.intervalId = setInterval(scheduler, 25);
  }

  stopSynthLoop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  play(customUrl = null) {
    if (customUrl && customUrl.trim() !== '') {
      this.mode = 'custom';
      if (!this.customAudio || this.customAudio.src !== customUrl) {
        if (this.customAudio) {
          this.customAudio.pause();
        }
        this.customAudio = new Audio(customUrl);
        this.customAudio.loop = true;
      }
      this.customAudio.play().then(() => {
        this.isPlaying = true;
        this.dispatchState(true);
      }).catch(err => {
        console.warn('Custom audio playback failed, falling back to synth EDM:', err);
        this.fallbackToSynth();
      });
      return;
    }

    this.fallbackToSynth();
  }

  fallbackToSynth() {
    this.mode = 'synth';
    this.init();
    this.stopSynthLoop();
    this.startSynthLoop();
    this.isPlaying = true;
    this.dispatchState(true);
  }

  pause() {
    if (this.mode === 'custom' && this.customAudio) {
      this.customAudio.pause();
    } else {
      this.stopSynthLoop();
    }
    this.isPlaying = false;
    this.dispatchState(false);
  }

  toggle(customUrl = null) {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play(customUrl);
    }
  }

  dispatchState(playing) {
    window.dispatchEvent(new CustomEvent('paragon-audio-state', {
      detail: { playing, mode: this.mode }
    }));
  }
}

// Global instance
window.paragonAudio = new PartyAudioEngine();
