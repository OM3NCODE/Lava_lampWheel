class LavaAudioEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.masterVolume = null;
        this.simmerInterval = null;
    }

    init() {
        if (this.ctx) return;
        
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContextClass();
            
            // Create master volume control
            this.masterVolume = this.ctx.createGain();
            this.masterVolume.gain.value = 0.5; // default 50% volume
            this.masterVolume.connect(this.ctx.destination);
        } catch (e) {
            console.warn("Web Audio API not supported in this browser.", e);
        }
    }

    resume() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.stopSimmer();
        }
    }

    setVolume(value) {
        this.resume();
        if (this.masterVolume) {
            // value is 0.0 to 1.0
            this.masterVolume.gain.setValueAtTime(value * 0.5, this.ctx.currentTime);
        }
    }

    // Synthesize a clean button click
    playClick() {
        if (!this.enabled) return;
        this.resume();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterVolume);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
    }

    // Synthesize a single bubble pop sound
    playPop() {
        if (!this.enabled) return;
        this.resume();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterVolume);

        // Sweeping sine/triangle wave for the bubble resonance
        osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
        const startFreq = 180 + Math.random() * 80;
        const endFreq = 500 + Math.random() * 200;
        osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.08);

        filter.type = 'bandpass';
        filter.Q.value = 3;
        filter.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.08);

        // Gain envelope
        gain.gain.setValueAtTime(0.01, this.ctx.currentTime); // start soft
        gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.01); // peak
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1); // decay

        osc.start();
        osc.stop(this.ctx.currentTime + 0.11);

        // Add a high-frequency click/burst for the burst skin effect
        this.playBurstClick();
    }

    playBurstClick() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.masterVolume);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(3000, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.01);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.015);
    }

    // Play a continuous simmering/boiling sound loop when lamp shakes
    startSimmer() {
        if (!this.enabled) return;
        this.resume();
        if (!this.ctx || this.simmerInterval) return;

        // Trigger periodic soft pop-like sounds to sound like boiling lava
        this.simmerInterval = setInterval(() => {
            if (Math.random() > 0.25) {
                this.playSoftSimmerBubble();
            }
        }, 60);
    }

    stopSimmer() {
        if (this.simmerInterval) {
            clearInterval(this.simmerInterval);
            this.simmerInterval = null;
        }
    }

    playSoftSimmerBubble() {
        if (!this.ctx || !this.enabled) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterVolume);

        osc.type = 'sine';
        // Lower pitch and softer volume than main pop
        const pitch = 80 + Math.random() * 120;
        osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(pitch * 2.5, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.13);
    }

    // Synthesize a beautiful, space-age victory chime/chord
    playChime() {
        if (!this.enabled) return;
        this.resume();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Pentatonic major chord notes: C4 (261.63), E4 (329.63), G4 (392.00), C5 (523.25), E5 (659.25), G5 (783.99)
        const chord = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];

        // Create a delay line for spacey echo effect
        const delay = this.ctx.createDelay(1.0);
        delay.delayTime.value = 0.25;

        const feedback = this.ctx.createGain();
        feedback.gain.value = 0.4;

        delay.connect(feedback);
        feedback.connect(delay); // delay loop

        const chimeGain = this.ctx.createGain();
        chimeGain.gain.setValueAtTime(0.4, now);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

        chimeGain.connect(this.masterVolume);
        chimeGain.connect(delay);
        delay.connect(this.masterVolume);

        chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const oscGain = this.ctx.createGain();

            osc.connect(oscGain);
            oscGain.connect(chimeGain);

            osc.type = 'triangle';
            osc.frequency.value = freq;

            // Arpeggiate notes slightly
            const noteStart = now + idx * 0.07;
            oscGain.gain.setValueAtTime(0, now);
            oscGain.gain.setValueAtTime(0.15, noteStart);
            oscGain.gain.exponentialRampToValueAtTime(0.001, noteStart + 1.2);

            osc.start(noteStart);
            osc.stop(noteStart + 1.3);
        });
    }
}

// Export singleton instance
const audio = new LavaAudioEngine();
window.LavaAudio = audio;
