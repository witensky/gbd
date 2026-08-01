import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { LoveStoryConfig } from '../types';

interface Stage2DeclarationsProps {
  config: LoveStoryConfig;
  onNextStage: () => void;
}

// Vintage Corner Ornament SVG
const CornerFiligree: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`w-10 h-10 sm:w-12 sm:h-12 text-amber-800/30 pointer-events-none ${className}`} viewBox="0 0 100 100" fill="currentColor">
    <path d="M10,10 C40,10 50,20 50,50 C20,50 10,40 10,10 Z M15,15 C25,30 30,35 45,45 C35,30 30,25 15,15 Z" />
    <path d="M10,10 C10,40 20,50 50,50 C50,20 40,10 10,10 Z" opacity="0.5" />
    <circle cx="20" cy="20" r="3" />
    <circle cx="35" cy="15" r="2" />
    <circle cx="15" cy="35" r="2" />
  </svg>
);

// Blooming Vintage Rose SVG Component
const BloomingRose: React.FC<{ progress: number; position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({ progress, position }) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return '-top-5 -left-5 rotate-[-15deg]';
      case 'top-right': return '-top-5 -right-5 rotate-[15deg]';
      case 'bottom-left': return '-bottom-5 -left-5 rotate-[-105deg]';
      case 'bottom-right': return '-bottom-5 -right-5 rotate-[75deg]';
    }
  };

  const scale = Math.min(1, Math.max(0, progress * 1.2));
  const opacity = Math.min(1, progress * 1.5);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale, opacity }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`absolute ${getPositionClasses()} pointer-events-none z-30 transition-all duration-700`}
    >
      <div className="relative w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center">
        {/* Glowing Aura behind blooming rose */}
        <div className="absolute inset-0 bg-rose-400/20 rounded-full blur-md animate-pulse" />
        
        {/* Flower SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Leaves */}
          <path d="M25,65 C10,60 5,40 20,45 C35,50 30,65 25,65 Z" fill="#2d4a3e" />
          <path d="M75,65 C90,60 95,40 80,45 C65,50 70,65 75,65 Z" fill="#385e4e" />
          <path d="M50,85 C40,95 60,95 50,85 Z" fill="#2d4a3e" />
          
          {/* Outer Petals */}
          <path d="M50,20 C30,15 15,35 30,55 C45,75 55,75 70,55 C85,35 70,15 50,20 Z" fill="#9f1239" opacity="0.9" />
          <path d="M50,25 C35,22 22,38 34,54 C46,70 54,70 66,54 C78,38 65,22 50,25 Z" fill="#be123c" />
          
          {/* Inner Petals Bloom */}
          <path d="M50,30 C40,28 30,40 40,50 C50,60 50,60 60,50 C70,40 60,28 50,30 Z" fill="#e11d48" />
          <path d="M50,35 C45,33 38,42 45,48 C52,54 48,54 55,48 C62,42 55,33 50,35 Z" fill="#fb7185" />
          <path d="M50,40 C47,38 42,44 47,47 C52,50 48,50 53,47 C58,44 53,38 50,40 Z" fill="#ffe4e6" />
          
          {/* Dew drop spark */}
          <circle cx="46" cy="38" r="2" fill="#ffffff" opacity="0.8" />
        </svg>
      </div>
    </motion.div>
  );
};

export const Stage2Declarations: React.FC<Stage2DeclarationsProps> = ({ config, onNextStage }) => {
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedContent, setTypedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [readIndices, setReadIndices] = useState<number[]>([0]);

  const declarations = config.declarations || [];
  const currentDecl = declarations[currentIndex] || declarations[0];

  // Open envelope handler
  const handleOpenEnvelope = () => {
    setIsEnvelopeOpened(true);
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#d4af37', '#f472b6']
      });
    } catch {}
  };

  // Typewriter effect per declaration
  useEffect(() => {
    if (!isEnvelopeOpened || !currentDecl) return;
    setIsTyping(true);
    setTypedContent('');
    let idx = 0;
    const fullText = currentDecl.content;

    const timer = setInterval(() => {
      if (idx < fullText.length) {
        setTypedContent(fullText.substring(0, idx + 1));
        idx++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 32);

    return () => clearInterval(timer);
  }, [currentIndex, currentDecl, isEnvelopeOpened]);

  // Track progress fraction for blooming flowers
  const textProgress = currentDecl?.content ? typedContent.length / currentDecl.content.length : 0;

  const handleNext = () => {
    if (currentIndex < declarations.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (!readIndices.includes(nextIdx)) {
        setReadIndices(prev => [...prev, nextIdx]);
      }
    } else {
      onNextStage();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-20 z-10 select-none">
      
      {/* Background Classical Ambient Glow */}
      <div className="absolute w-[600px] h-[600px] bg-[#4a0404]/30 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-20">
        
        {/* Stage Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="font-serif-title text-2xl sm:text-3xl text-[#fdfaf6] italic tracking-wide drop-shadow-md">
            Pour {config.recipientName}
          </h2>
        </motion.div>

        {/* Phase 1: Unopened Classical Wax Envelope */}
        {!isEnvelopeOpened ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full max-w-lg cursor-pointer group"
            onClick={handleOpenEnvelope}
          >
            {/* Envelope Exterior Container */}
            <div className="relative bg-[#2d0b00] border-2 border-[#d4af37]/50 rounded-2xl p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-transform group-hover:scale-[1.02]">
              
              {/* Triangular Flap Graphic */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#4a0404] to-[#2d0b00] border-b border-[#d4af37]/30 clip-path-triangle opacity-90" />
              
              {/* Envelope Texture Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

              {/* Envelope Center Content */}
              <div className="relative z-10 py-10 flex flex-col items-center justify-center gap-4">
                
                {/* Vintage Wax Seal Button */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9f1239] via-[#881337] to-[#4c0519] border-2 border-[#d4af37] flex items-center justify-center shadow-[0_10px_25px_rgba(159,18,57,0.6)] relative group-hover:border-amber-300"
                >
                  <div className="w-16 h-16 rounded-full border border-[#d4af37]/40 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-[#d4af37] fill-[#d4af37]/30 animate-pulse" />
                  </div>
                </motion.div>

              </div>

            </div>
          </motion.div>
        ) : (

          /* Phase 2: Open Parchment Love Letter with Blooming Flowers */
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {declarations.length > 1 && (
              <div className="flex items-center justify-center gap-2 mb-5">
                {declarations.map((decl, idx) => (
                  <button
                    key={decl.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      idx === currentIndex ? 'bg-[#d4af37] scale-125' : readIndices.includes(idx) ? 'bg-[#d4af37]/60' : 'bg-white/20'
                    }`}
                    aria-label={`Voir ${decl.title}`}
                  />
                ))}
              </div>
            )}

            {/* The Classical Parchment Container */}
            <div className="relative bg-[#fdfaf6] text-[#1a0505] p-8 sm:p-12 rounded-xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] border-2 border-[#d4af37]/60 text-left min-h-[400px] flex flex-col justify-between overflow-visible">
              
              {/* Vintage Corner Filigrees */}
              <CornerFiligree className="absolute top-2 left-2" />
              <CornerFiligree className="absolute top-2 right-2 rotate-90" />
              <CornerFiligree className="absolute bottom-2 left-2 -rotate-90" />
              <CornerFiligree className="absolute bottom-2 right-2 rotate-180" />

              {/* Progressive Blooming Roses based on typing progress */}
              <BloomingRose progress={textProgress} position="top-left" />
              <BloomingRose progress={Math.max(0, textProgress - 0.25)} position="top-right" />
              <BloomingRose progress={Math.max(0, textProgress - 0.5)} position="bottom-left" />
              <BloomingRose progress={Math.max(0, textProgress - 0.75)} position="bottom-right" />

              {/* Letter Header */}
              <div>
                <div className="border-b border-[#d4af37]/40 pb-4 mb-5">
                  <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#4a0404]">
                    {currentDecl.title}
                  </h3>
                </div>

                {/* Classical Handwritten Text Body */}
                <div
                  onClick={handleNext}
                  className="font-serif-body text-base sm:text-xl leading-relaxed italic text-[#1a0505] min-h-[140px] py-2 cursor-pointer group"
                >
                  <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-[#881337] first-letter:mr-1">
                    "{typedContent}"
                  </p>
                  {isTyping && (
                    <span className="inline-block w-2 h-6 bg-[#881337] ml-1 animate-pulse" />
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#d4af37]/30 flex items-center justify-end text-xs font-serif italic text-[#881337]">
                <span>~ Avec tout mon amour</span>
              </div>

            </div>

            <div className="mt-5 text-center text-[11px] uppercase tracking-[0.3em] text-[#d4af37]/60">
              {currentIndex === declarations.length - 1 ? 'Touchez la page pour continuer' : 'Touchez pour avancer'}
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
};
