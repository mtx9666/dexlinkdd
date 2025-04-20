// Sound utility for managing audio effects
class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isEnabled: boolean = true;

  private constructor() {
    // Initialize on first user interaction
    if (typeof window !== 'undefined') {
      window.addEventListener('click', () => {
        if (!this.audioContext) {
          this.audioContext = new AudioContext();
        }
      }, { once: true });
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public async loadSound(url: string, id: string) {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(id, audioBuffer);
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  }

  public playSound(id: string, options: { volume?: number; fadeIn?: boolean } = {}) {
    if (!this.isEnabled || !this.audioContext || !this.sounds.has(id)) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    source.buffer = this.sounds.get(id)!;
    
    if (options.fadeIn) {
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        options.volume || 1,
        this.audioContext.currentTime + 0.5
      );
    } else {
      gainNode.gain.value = options.volume || 1;
    }

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    source.start();

    return { source, gainNode };
  }

  public toggleSound(enabled: boolean) {
    this.isEnabled = enabled;
  }
}

export const soundManager = SoundManager.getInstance(); 