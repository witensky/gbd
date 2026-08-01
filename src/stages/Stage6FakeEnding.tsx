import { Heart, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

interface Stage6FakeEndingProps {
  onNextStage: () => void;
}

export const Stage6FakeEnding: React.FC<Stage6FakeEndingProps> = ({ onNextStage }) => {
  const [phase, setPhase] = useState<'ending' | 'reveal'>('ending');

  useEffect(() => {
    // Automatically transition to reveal phase after 4 seconds, or user can click
    const timer = setTimeout(() => {
      setPhase('reveal');
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'reveal') return;
    const timer = setTimeout(() => {
      onNextStage();
    }, 2600);

    return () => clearTimeout(timer);
  }, [phase, onNextStage]);

  return (
    <div
      onClick={() => {
        if (phase === 'ending') {
          setPhase('reveal');
        } else {
          onNextStage();
        }
      }}
      className="min-h-screen flex flex-col items-center justify-center relative px-4 py-24 text-center z-10 overflow-hidden cursor-pointer"
      title="Touche n'importe où pour révéler le secret..."
    >
      
      <AnimatePresence mode="wait">
        {phase === 'ending' ? (
          <motion.div
            key="fake-ending"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
            transition={{ duration: 1.2 }}
            className="max-w-xl w-full bg-[#0d0711]/90 border border-stone-800 p-10 rounded-3xl shadow-2xl relative"
          >
            <Heart className="w-16 h-16 text-stone-700 mx-auto mb-6 opacity-40 animate-pulse-slow" />

            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-300 mb-3 leading-tight">
              Voilà... je crois que j'ai tout dit.
            </h2>

            <p className="font-serif-body text-stone-400 text-base italic mb-6">
              Merci d'avoir pris le temps de parcourir chacune de ces scènes.
            </p>

            <p className="text-xs uppercase tracking-[0.3em] text-rose-400/60">
              Touchez encore une fois
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="spectacular-reveal"
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl w-full bg-[#180b1d]/90 border-2 border-amber-400/60 p-10 sm:p-14 rounded-3xl shadow-2xl box-glow-gold relative overflow-hidden"
          >
            {/* Glowing Light Burst Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 via-amber-500/20 to-rose-600/20 animate-pulse-slow pointer-events-none" />

            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5 mx-auto mb-6 shadow-2xl box-glow-gold flex items-center justify-center animate-bounce">
              <div className="w-full h-full rounded-full bg-[#180b1d] flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-amber-300" />
              </div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif-title text-3xl sm:text-4xl font-bold text-amber-300 mb-4 leading-tight text-gold-glow"
            >
              Attends... il reste quelque chose.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-serif-body text-rose-100 text-lg italic max-w-lg mx-auto mb-6 leading-relaxed"
            >
              Avant que ce chapitre ne se ferme, j'ai une toute dernière question pour toi.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="text-[11px] uppercase tracking-[0.3em] text-amber-200/70"
            >
              Touchez pour continuer
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
