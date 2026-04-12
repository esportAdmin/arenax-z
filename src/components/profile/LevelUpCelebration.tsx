import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Star, Trophy } from "lucide-react";

interface LevelUpCelebrationProps {
  isVisible: boolean;
  newLevel: number;
  onComplete: () => void;
}

const playCelebrationSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const audioContext = new AudioContextClass();
    const frequencies = [523.25, 659.25, 783.99, 1046.5];

    frequencies.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      const startTime = audioContext.currentTime + index * 0.1;
      const duration = 0.3;

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  } catch {
    console.log("Audio not supported");
  }
};

const Particle = ({
  delay,
  x,
  y,
  color,
}: {
  delay: number;
  x: number;
  y: number;
  color: string;
}) => (
  <motion.div
    className={`absolute h-3 w-3 rounded-full ${color}`}
    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
    animate={{ x, y, scale: [0, 1.5, 0], opacity: [1, 1, 0] }}
    transition={{ duration: 1.5, delay, ease: "easeOut" }}
  />
);

const StarBurst = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ scale: 0, rotate: 0, opacity: 0 }}
    animate={{ scale: [0, 1.5, 0], rotate: [0, 180], opacity: [0, 1, 0] }}
    transition={{ duration: 1, delay }}
  >
    <Star className="h-8 w-8 fill-amber-400 text-amber-400" />
  </motion.div>
);

export function LevelUpCelebration({
  isVisible,
  newLevel,
  onComplete,
}: LevelUpCelebrationProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => {
        const angle = (index / 30) * Math.PI * 2;
        const distance = 100 + Math.random() * 150;
        return {
          id: index,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          delay: Math.random() * 0.3,
          color: [
            "bg-primary",
            "bg-secondary",
            "bg-accent",
            "bg-amber-400",
            "bg-emerald-400",
            "bg-purple-400",
          ][index % 6],
        };
      }),
    [],
  );

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    playCelebrationSound();
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="pointer-events-auto absolute inset-0 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onComplete}
          />

          <div className="relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {particles.map((particle) => (
                <Particle key={particle.id} {...particle} />
              ))}
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{
                    left: Math.cos((index / 8) * Math.PI * 2) * 120,
                    top: Math.sin((index / 8) * Math.PI * 2) * 120,
                  }}
                >
                  <StarBurst delay={0.2 + index * 0.1} />
                </motion.div>
              ))}
            </div>

            <motion.div
              className="relative z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: [0, 1.3, 1], rotate: [-180, 20, 0] }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent blur-xl"
                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.4, 0.8] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ width: 200, height: 200, marginLeft: -100, marginTop: -100 }}
              />

              <motion.div
                className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent shadow-2xl"
                animate={{
                  boxShadow: [
                    "0 0 40px hsl(var(--primary) / 0.5)",
                    "0 0 80px hsl(var(--primary) / 0.8)",
                    "0 0 40px hsl(var(--primary) / 0.5)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Trophy className="mx-auto mb-1 h-10 w-10 text-primary-foreground" />
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
                    className="text-xs uppercase tracking-wider text-primary-foreground/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Level
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-[-5rem] -translate-x-1/2 whitespace-nowrap"
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-amber-400" />
                <span className="bg-gradient-to-r from-amber-400 via-primary to-secondary bg-clip-text text-3xl font-display font-bold text-transparent">
                  LEVEL UP!
                </span>
                <Sparkles className="h-6 w-6 text-amber-400" />
              </div>
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-28 -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-muted-foreground">
                Congratulations. Keep playing to unlock even more rewards.
              </p>
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-44 -translate-x-1/2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <p className="text-xs text-muted-foreground/50">
                Click anywhere to close
              </p>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
