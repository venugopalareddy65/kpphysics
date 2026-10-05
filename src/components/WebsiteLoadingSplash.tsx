import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Atom } from 'lucide-react';

interface WebsiteLoadingSplashProps {
  onFinishLoading: () => void;
}

export const WebsiteLoadingSplash: React.FC<WebsiteLoadingSplashProps> = ({
  onFinishLoading
}) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, prev + 8);
      });
    }, 55);

    const timer = setTimeout(() => {
      onFinishLoading();
    }, 950);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinishLoading]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#04091A] via-[#091534] to-[#060D24] text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden"
    >
      {/* Ambient Radial Glows */}
      <div className="absolute w-96 h-96 rounded-full bg-blue-500/15 blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-amber-400/10 blur-3xl -bottom-20 -right-20 pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-md w-full text-center space-y-6">
        {/* Animated 3-Ring Quantum Atomic Orbital Graphic */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer Rotating Ring 1 */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/50"
          />

          {/* Tilted Elliptical Orbital Ring 2 */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border-2 border-amber-400/60"
            style={{ transform: 'rotateX(60deg)' }}
          />

          {/* Pulsing Core Nucleus */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              boxShadow: [
                '0 0 20px rgba(251, 191, 36, 0.35)',
                '0 0 40px rgba(56, 189, 248, 0.65)',
                '0 0 20px rgba(251, 191, 36, 0.35)'
              ]
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-cyan-400 text-slate-950 flex items-center justify-center shadow-xl"
          >
            <Atom className="w-9 h-9 animate-spin" style={{ animationDuration: '6s' }} />
          </motion.div>

          {/* Floating Formula Badges */}
          <motion.span
            animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-8 font-mono text-xs font-bold text-amber-300 bg-slate-900/90 border border-amber-400/30 px-2 py-0.5 rounded-md"
          >
            E = mc²
          </motion.span>
          <motion.span
            animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
            className="absolute -bottom-2 -left-10 font-mono text-xs font-bold text-cyan-300 bg-slate-900/90 border border-cyan-400/30 px-2 py-0.5 rounded-md"
          >
            F = q(v × B)
          </motion.span>
        </div>

        {/* Academy Branding & Motto */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-1.5"
        >
          <div className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
            Initializing Interactive Physics Lab
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            KP Physics <span className="text-amber-400">Academy</span>
          </h1>
          <p className="text-xs text-slate-300">
            Master Physics. Build Your Future.
          </p>
        </motion.div>

        {/* Smooth Progress Bar + Percentage Readout */}
        <div className="w-64 space-y-2">
          <div className="h-1.5 w-full bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/60">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.15 }}
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Loading Curriculum &amp; Simulations...</span>
            <span className="text-amber-400 font-bold tabular-nums">{progress}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
