import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useCallback, useMemo } from "react";
import { Star, Sparkles, Zap, Trophy } from "lucide-react";

interface LevelUpCelebrationProps {
  isVisible: boolean;
  newLevel: number;
  onComplete: () => void;
}

// Generate celebration sound using Web Audio API
const playCelebrationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a series of ascending tones for celebration
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = "sine";
      
      const startTime = audioContext.currentTime + index * 0.1;
      const duration = 0.3;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });

    // Add a final triumphant chord
    setTimeout(() => {
      const chordFreqs = [523.25, 659.25, 783.99];
      chordFreqs.forEach((freq) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = freq;
        osc.type = "triangle";
        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        osc.start();
        osc.stop(audioContext.currentTime + 0.8);
      });
    }, 400);
  } catch (e) {
    console.log("Audio not supported");
  }
};

// Particle component
const Particle = ({ delay, x, y, color }: { delay: number; x: number; y: number; color: string }) => (
  <motion.div
    className={`absolute w-3 h-3 rounded-full ${color}`}
    initial={{ 
      x: 0, 
      y: 0, 
      scale: 0, 
      opacity: 1 
    }}
    animate={{ 
      x: x, 
      y: y, 
      scale: [0, 1.5, 0],
      opacity: [1, 1, 0]
    }}
    transition={{ 
      duration: 1.5, 
      delay: delay,
      ease: "easeOut"
    }}
  />
);

// Star burst component
const StarBurst = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ scale: 0, rotate: 0, opacity: 0 }}
    animate={{ 
      scale: [0, 1.5, 0],
      rotate: [0, 180],
      opacity: [0, 1, 0]
    }}
    transition={{ duration: 1, delay }}
  >
    <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
  </motion.div>
);

export function LevelUpCelebration({ isVisible, newLevel, onComplete }: LevelUpCelebrationProps) {
  // Generate particles with memoization
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const angle = (i / 30) * Math.PI * 2;
      const distance = 100 + Math.random() * 150;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        delay: Math.random() * 0.3,
        color: [
          "bg-primary",
          "bg-secondary", 
          "bg-accent",
          "bg-amber-400",
          "bg-emerald-400",
          "bg-purple-400"
        ][i % 6]
      };
    });
  }, []);

  // Play sound on mount
  useEffect(() => {
    if (isVisible) {
      playCelebrationSound();
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Dark overlay */}
          <motion.div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onComplete}
          />

          {/* Center content */}
          <div className="relative">
            {/* Particles */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {particles.map((particle) => (
                <Particle
                  key={particle.id}
                  delay={particle.delay}
                  x={particle.x}
                  y={particle.y}
                  color={particle.color}
                />
              ))}
            </div>

            {/* Star bursts */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: Math.cos((i / 8) * Math.PI * 2) * 120,
                    top: Math.sin((i / 8) * Math.PI * 2) * 120,
                  }}
                >
                  <StarBurst delay={0.2 + i * 0.1} />
                </motion.div>
              ))}
            </div>

            {/* Main badge */}
            <motion.div
              className="relative z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: [0, 1.3, 1],
                rotate: [-180, 20, 0]
              }}
              transition={{ 
                duration: 0.8, 
                type: "spring",
                stiffness: 200
              }}
            >
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent blur-xl"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0.4, 0.8]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ width: 200, height: 200, marginLeft: -100, marginTop: -100 }}
              />

              {/* Level badge */}
              <motion.div 
                className="relative w-40 h-40 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-2xl"
                animate={{ 
                  boxShadow: [
                    "0 0 40px hsl(var(--primary) / 0.5)",
                    "0 0 80px hsl(var(--primary) / 0.8)",
                    "0 0 40px hsl(var(--primary) / 0.5)"
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Trophy className="w-10 h-10 text-primary-foreground mx-auto mb-1" />
                  </motion.div>
                  <motion.div
                    className="text-5xl font-display font-bold text-primary-foreground"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    {newLevel}
                  </motion.div>
                  <motion.div 
                    className="text-xs text-primary-foreground/80 uppercase tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Niveau
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* "LEVEL UP!" text */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 -top-20 whitespace-nowrap"
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-400" />
                <span className="text-3xl font-display font-bold bg-gradient-to-r from-amber-400 via-primary to-secondary bg-clip-text text-transparent">
                  LEVEL UP!
                </span>
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-28 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <p className="text-muted-foreground text-sm">
                Félicitations ! Continuez à jouer pour débloquer plus de récompenses !
              </p>
            </motion.div>

            {/* Click to close hint */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-44 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <p className="text-muted-foreground/50 text-xs">
                Cliquez pour fermer
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
