// Sound notification utilities using Web Audio API

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Play a notification sound
export const playNotificationSound = (type: 'message' | 'mention' = 'message') => {
  try {
    const ctx = getAudioContext();
    
    // Resume context if suspended (required by browsers)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'mention') {
      // Higher pitched, double beep for mentions
      oscillator.frequency.value = 880; // A5
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } else {
      // Soft pop sound for regular messages
      oscillator.frequency.value = 660; // E5
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    }
  } catch (error) {
    console.log('Audio not supported or blocked');
  }
};

// Play a subtle click sound for UI interactions
export const playClickSound = () => {
  try {
    const ctx = getAudioContext();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Quick, subtle pop
    oscillator.frequency.value = 1200;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (error) {
    console.log('Audio not supported');
  }
};

// Play a success sound (pleasant ascending tone)
export const playSuccessSound = () => {
  try {
    const ctx = getAudioContext();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // First note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.frequency.value = 523.25; // C5
    osc1.type = 'sine';
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.15);

    // Second note (higher)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 659.25; // E5
    osc2.type = 'sine';
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc2.start(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 0.25);

    // Third note (highest)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.frequency.value = 783.99; // G5
    osc3.type = 'sine';
    gain3.gain.setValueAtTime(0.25, ctx.currentTime + 0.2);
    gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc3.start(ctx.currentTime + 0.2);
    osc3.stop(ctx.currentTime + 0.4);
  } catch (error) {
    console.log('Audio not supported');
  }
};

// Check if sound is enabled in localStorage
export const isSoundEnabled = (): boolean => {
  const stored = localStorage.getItem('chat_sound_enabled');
  return stored === null ? true : stored === 'true';
};

// Toggle sound setting
export const toggleSound = (): boolean => {
  const newValue = !isSoundEnabled();
  localStorage.setItem('chat_sound_enabled', String(newValue));
  return newValue;
};

// Play sound if enabled
export const playSoundIfEnabled = (type: 'message' | 'mention' = 'message') => {
  if (isSoundEnabled()) {
    playNotificationSound(type);
  }
};

// Play click sound if enabled
export const playClickIfEnabled = () => {
  if (isSoundEnabled()) {
    playClickSound();
  }
};

// Play success sound if enabled
export const playSuccessIfEnabled = () => {
  if (isSoundEnabled()) {
    playSuccessSound();
  }
};
