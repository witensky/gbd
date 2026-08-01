import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';
import { LoveStoryConfig } from '../types';

interface Stage1IntroProps {
  config: LoveStoryConfig;
  onNextStage: () => void;
}

export const Stage1Intro: React.FC<Stage1IntroProps> = ({ config, onNextStage }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-20 text-center z-10">
      
      {/* Subtle Glowing Aura */}
      <div className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-rose-600/15 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full soft-card border border-rose-500/30 p-6 sm:p-10 rounded-[2rem] shadow-2xl box-glow-rose relative overflow-hidden"
      >
        {/* Decorative corner light accents */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-rose-500/20 to-transparent pointer-events-none rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-amber-500/20 to-transparent pointer-events-none rounded-tl-full" />

        {/* Start / Surprise Heart Emblem */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          onClick={onNextStage}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 mx-auto mb-6 shadow-xl shadow-rose-900/60 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform group"
          title="Touche mon cœur pour commencer l'aventure..."
        >
          <div className="w-full h-full rounded-full bg-[#140b17] flex items-center justify-center relative overflow-hidden">
            <Heart className="w-10 h-10 text-rose-400 fill-rose-500/80 group-hover:scale-125 transition-transform animate-pulse" />
            <Sparkles className="w-4 h-4 text-amber-300 absolute top-2 right-2 animate-spin" />
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="font-serif-title text-3xl sm:text-4xl font-bold text-gradient-rose leading-tight mb-3 tracking-wide"
        >
          {config.introTitle}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-serif-body text-rose-200/80 text-base sm:text-lg italic max-w-lg mx-auto mb-6 leading-relaxed"
        >
          "{config.introSubtitle}"
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-4 text-[11px] uppercase tracking-[0.3em] text-rose-300/40 font-sans-body"
        >
          Appuie sur le cœur pour entrer
        </motion.p>

      </motion.div>
    </div>
  );
};
