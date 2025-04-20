'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, Twitter, MessageSquare, Send,
  LineChart, CandlestickChart, BarChart,
  Bitcoin, Coins, TrendingUp, Activity,
  Github, ArrowUpDown, Repeat
} from 'lucide-react';
import { soundManager } from '@/lib/sound';

interface IntroAnimationProps {
  onComplete: () => void;
}

// Define floating elements with their properties
const floatingElements = [
  // Social Media Icons
  { icon: Twitter, size: 24, color: 'text-primary/40' },
  { icon: MessageSquare, size: 28, color: 'text-primary/40' },
  { icon: Send, size: 26, color: 'text-primary/40' },
  { icon: Github, size: 24, color: 'text-primary/40' },
  // Trading Symbols
  { icon: LineChart, size: 32, color: 'text-primary/30' },
  { icon: CandlestickChart, size: 30, color: 'text-primary/30' },
  { icon: BarChart, size: 28, color: 'text-primary/30' },
  { icon: TrendingUp, size: 26, color: 'text-primary/30' },
  { icon: Activity, size: 30, color: 'text-primary/30' },
  { icon: ArrowUpDown, size: 24, color: 'text-primary/30' },
  // Crypto Symbols
  { icon: Bitcoin, size: 34, color: 'text-primary/35' },
  { icon: Coins, size: 32, color: 'text-primary/35' },
  { icon: Repeat, size: 28, color: 'text-primary/35' },
];

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [showEnter, setShowEnter] = useState(false);

  // Load sounds on mount
  useEffect(() => {
    const loadSounds = async () => {
      await Promise.all([
        soundManager.loadSound('/sounds/intro-appear.mp3', 'intro'),
        soundManager.loadSound('/sounds/hover.mp3', 'hover'),
        soundManager.loadSound('/sounds/click.mp3', 'click'),
      ]);
      // Play intro sound with fade in
      soundManager.playSound('intro', { volume: 0.4, fadeIn: true });
    };
    loadSounds();
  }, []);

  // Handle hover sound
  const handleHover = () => {
    soundManager.playSound('hover', { volume: 0.2 });
  };

  // Handle click sound and animation complete
  const handleClick = () => {
    soundManager.playSound('click', { volume: 0.3 });
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-background z-50 flex items-center justify-center flex-col overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Background Effects */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_65%)]" />
        </motion.div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => {
            const element = floatingElements[i % floatingElements.length];
            const Icon = element.icon;
            const randomX = Math.random() * 100;
            const randomDelay = Math.random() * 10;
            const randomDuration = Math.random() * 15 + 20;
            const startY = Math.random() * 100;

            return (
              <motion.div
                key={i}
                className={`absolute ${element.color}`}
                initial={{
                  x: `${randomX}vw`,
                  y: `${startY}vh`,
                  rotate: Math.random() * 360,
                  opacity: 0,
                }}
                animate={{
                  y: [null, '-120vh'],
                  rotate: [null, Math.random() * 720 - 360],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: randomDuration,
                  delay: randomDelay,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  width: element.size,
                  height: element.size,
                }}
              >
                <Icon size={element.size} />
              </motion.div>
            );
          })}
        </div>

        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          onAnimationComplete={() => setShowEnter(true)}
          className="relative"
        >
          {/* Outer Ring */}
          <motion.div
            className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary to-primary/30"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 8, ease: "linear", repeat: Infinity },
              scale: { duration: 2, ease: "easeInOut", repeat: Infinity },
            }}
            style={{ filter: 'blur(8px)' }}
          />

          {/* Globe Effect Container */}
          <motion.div
            className="w-40 h-40 relative bg-background rounded-full flex items-center justify-center overflow-hidden"
            animate={{
              boxShadow: [
                '0 0 20px rgba(var(--primary), 0.3)',
                '0 0 40px rgba(var(--primary), 0.5)',
                '0 0 20px rgba(var(--primary), 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            {/* Globe Grid Lines */}
            <div className="absolute inset-0">
              {/* Horizontal Lines */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`h-${i}`}
                  className="absolute w-full h-px bg-primary/10"
                  style={{ top: `${(i + 1) * 12.5}%` }}
                  animate={{
                    rotateX: [0, 45, 0],
                    scaleY: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "linear",
                  }}
                />
              ))}
              {/* Vertical Lines */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`v-${i}`}
                  className="absolute h-full w-px bg-primary/10"
                  style={{ left: `${(i + 1) * 12.5}%` }}
                  animate={{
                    rotateY: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "linear",
                  }}
                />
              ))}
            </div>

            {/* Spinning Text Container */}
            <motion.div
              className="relative z-10"
              animate={{
                rotateY: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <span className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent tracking-wider">
                DXL
              </span>
            </motion.div>

            {/* Glowing Meridian */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: '2px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Text Elements */}
        <motion.div className="text-center space-y-2 mt-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-3xl font-semibold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent"
          >
            Trade Smarter. Execute Faster.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="text-lg text-muted-foreground font-light tracking-wide"
          >
            Advanced Trading · Real-Time Analytics · AI-Powered Insights
          </motion.p>
        </motion.div>

        {/* Enter Button */}
        {showEnter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
              onHoverStart={handleHover}
            >
              {/* Animated border effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/80 via-primary to-primary/80 rounded-xl blur-sm opacity-70" />
              <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/80 via-primary to-primary/80 rounded-xl" />
              
              <Button
                size="lg"
                className="relative px-12 py-6 bg-background hover:bg-background/90 text-primary text-lg font-medium rounded-xl shadow-2xl backdrop-blur-sm transition-all duration-300 border-t border-primary/20"
                onClick={handleClick}
              >
                <div className="absolute inset-0 bg-primary/5 rounded-xl" />
                <div className="relative flex items-center justify-center gap-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="tracking-wide">ENTER PLATFORM</span>
                </div>
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Floating Particles */}
        <motion.div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                repeatType: 'loop',
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 