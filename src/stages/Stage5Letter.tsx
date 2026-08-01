import confetti from 'canvas-confetti';
import { Heart, Mail, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { LoveStoryConfig } from '../types';

interface Stage5LetterProps {
  config: LoveStoryConfig;
  onNextStage: () => void;
}

// Botanical Floral Corner SVG with progressive Framer Motion uncurling & blooming
const ProgressiveFloralCorner: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  progress: number;
}> = ({ position, progress }) => {
  // Normalize progress so each corner blooms in its designated quartile
  let startQuartile = 0;
  if (position === 'top-left') startQuartile = 0.0;
  else if (position === 'top-right') startQuartile = 0.25;
  else if (position === 'bottom-right') startQuartile = 0.50;
  else if (position === 'bottom-left') startQuartile = 0.75;

  // Local progress from 0 to 1 for this corner
  const cornerProgress = Math.min(1, Math.max(0, (progress - startQuartile) / 0.25));

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return '-top-6 -left-6 rotate-0';
      case 'top-right':
        return '-top-6 -right-6 scale-x-[-1]';
      case 'bottom-left':
        return '-bottom-6 -left-6 scale-y-[-1]';
      case 'bottom-right':
        return '-bottom-6 -right-6 scale-x-[-1] scale-y-[-1]';
    }
  };

  return (
    <div className={`absolute ${getPositionStyles()} w-28 h-28 sm:w-36 sm:h-36 pointer-events-none z-30`}>
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
        {/* Main Vine Path */}
        <motion.path
          d="M10,10 Q40,15 60,35 T90,80 Q105,95 110,110"
          fill="none"
          stroke="#385e4e"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: cornerProgress, opacity: cornerProgress > 0.05 ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Secondary Branch Vine */}
        <motion.path
          d="M35,22 Q50,45 80,50"
          fill="none"
          stroke="#2d4a3e"
          strokeWidth="1.8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: Math.max(0, (cornerProgress - 0.2) * 1.25), opacity: cornerProgress > 0.2 ? 1 : 0 }}
        />

        {/* Leaves along Vine */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: Math.min(1, cornerProgress * 1.5), opacity: cornerProgress > 0.1 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Leaf 1 */}
          <path d="M30,16 Q42,10 40,24 Q30,22 30,16 Z" fill="#385e4e" />
          {/* Leaf 2 */}
          <path d="M50,30 Q62,22 62,38 Q50,34 50,30 Z" fill="#2d4a3e" />
          {/* Leaf 3 */}
          <path d="M75,60 Q90,55 88,72 Q75,68 75,60 Z" fill="#385e4e" />
          {/* Leaf 4 - Golden accent */}
          <path d="M22,30 Q30,42 16,40 Q18,30 22,30 Z" fill="#d4af37" opacity="0.8" />
        </motion.g>

        {/* Rose Bud 1 */}
        <motion.g
          initial={{ scale: 0, rotate: -20 }}
          animate={{
            scale: cornerProgress > 0.4 ? Math.min(1, (cornerProgress - 0.4) * 2) : 0,
            rotate: 0
          }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          transformOrigin="45 20"
        >
          <circle cx="45" cy="20" r="10" fill="#9f1239" />
          <path d="M40,15 C45,10 50,15 45,22 C40,22 38,18 40,15 Z" fill="#be123c" />
          <path d="M45,14 C50,14 52,22 47,24 Z" fill="#fb7185" />
        </motion.g>

        {/* Main Blooming Rose */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: cornerProgress > 0.6 ? Math.min(1, (cornerProgress - 0.6) * 2.5) : 0,
            opacity: cornerProgress > 0.6 ? 1 : 0
          }}
          transition={{ type: "spring", stiffness: 180, damping: 10 }}
          transformOrigin="75 42"
        >
          {/* Outer Petals */}
          <circle cx="75" cy="42" r="14" fill="#881337" />
          <path d="M63,38 C60,28 75,22 85,32 C92,42 82,54 70,52 Z" fill="#9f1239" />
          <path d="M68,32 C65,30 78,25 84,36 C88,44 78,48 72,44 Z" fill="#be123c" />
          {/* Inner Petals */}
          <path d="M71,36 C70,32 80,30 80,38 C80,42 74,42 71,36 Z" fill="#e11d48" />
          <circle cx="75" cy="38" r="4" fill="#fb7185" />
          <circle cx="74" cy="37" r="1.5" fill="#ffffff" opacity="0.9" />
        </motion.g>

        {/* Small Golden Stars / Dewdrop Sparks */}
        {cornerProgress > 0.8 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.6] }}>
            <circle cx="85" cy="20" r="2" fill="#d4af37" />
            <circle cx="28" cy="65" r="1.8" fill="#d4af37" />
          </motion.g>
        )}
      </svg>
    </div>
  );
};

export const Stage5Letter: React.FC<Stage5LetterProps> = ({ config, onNextStage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnvelopeFlapOpen, setIsEnvelopeFlapOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speed] = useState(35); // ms per character

  const fullLetter = config.loveLetter || `Mon amour,

Chaque jour passé à tes côtés est un cadeau précieux. Tu as illuminé ma vie d'une façon que je n'aurais jamais pu imaginer. Ton sourire est mon refuge, et ta douceur ma plus belle certitude.

Merci d'être cette personne extraordinaire qui rend le monde plus beau. Je t'aime plus que les mots ne sauraient le dire.`;

  // Envelope Unsealing & Opening Sequence
  const handleOpenEnvelope = () => {
    if (isOpen) return;

    // Trigger confetti on wax seal break
    try {
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#d4af37', '#e11d48', '#f472b6', '#ffffff']
      });
    } catch {}

    // Step 1: Open flap
    setIsEnvelopeFlapOpen(true);

    // Step 2: Slide letter out after flap flips open
    setTimeout(() => {
      setIsOpen(true);
    }, 450);
  };

  // Progressive Typewriter Effect once letter is open
  useEffect(() => {
    if (!isOpen) return;
    setIsTyping(true);
    setTypedText('');
    let idx = 0;

    const timer = setInterval(() => {
      if (idx < fullLetter.length) {
        setTypedText(fullLetter.substring(0, idx + 1));
        idx++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [isOpen, speed, fullLetter]);

  const handleSkipTyping = () => {
    setTypedText(fullLetter);
    setIsTyping(false);
  };

  const typingProgress = fullLetter.length > 0 ? typedText.length / fullLetter.length : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-20 z-10 select-none overflow-hidden">
      
      {/* Warm Ambient Romantic Candlelight Lighting */}
      <div className="absolute w-[600px] h-[600px] bg-amber-600/15 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-rose-900/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl w-full text-center relative z-20">
        
        {/* Stage Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-[#d4af37]/40 text-[#d4af37] text-xs font-serif uppercase tracking-widest mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>My feeling</span>
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl text-[#fdfaf6] italic tracking-wide drop-shadow-md">
            Une pensée scellée pour toi
          </h2>
        </motion.div>

        {/* MAIN ENVELOPE & PARCHMENT CONTAINER */}
        <div className="relative max-w-2xl mx-auto min-h-[460px] flex items-center justify-center">

          {/* PHASE 1: Vintage Envelope Component */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div
                key="envelope"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ y: 250, opacity: 0, scale: 0.8, transition: { duration: 0.6, ease: "easeInOut" } }}
                onClick={handleOpenEnvelope}
                className="w-full soft-card border-2 border-[#d4af37]/60 rounded-2xl p-8 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.85)] cursor-pointer group relative overflow-hidden"
              >
                {/* Envelope Triangular Top Flap */}
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: isEnvelopeFlapOpen ? -180 : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ transformOrigin: "top", transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                  className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[#4a0404] to-[#2d0b00] border-b border-[#d4af37]/40 z-0 flex items-center justify-center clip-path-triangle pointer-events-none"
                  aria-hidden="true"
                >
                  {/* Wax Seal on Top Flap */}
                  {!isEnvelopeFlapOpen && (
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9f1239] via-[#881337] to-[#4c0519] border-2 border-[#d4af37] flex items-center justify-center shadow-[0_10px_25px_rgba(159,18,57,0.7)] group-hover:border-amber-300"
                    >
                      <div className="w-16 h-16 rounded-full border border-[#d4af37]/40 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-[#d4af37] fill-[#d4af37]/40 animate-pulse" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Envelope Interior Pocket Back */}
                <div className="relative z-40 py-12 flex flex-col items-center justify-center gap-4">
                  <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#fdfaf6] tracking-wide">
                    Pour {config.recipientName}
                  </h3>
                  
                  <p className="font-serif italic text-base text-[#d4af37]/90">
                    Touche l’enveloppe pour la faire s’ouvrir.
                  </p>

                  <button
                    type="button"
                    onClick={handleOpenEnvelope}
                    className="mt-4 inline-flex items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#881337]/15 px-5 py-2 text-sm text-[#fdfaf6] font-semibold transition hover:bg-[#881337]/25 cursor-pointer"
                  >
                    Ouvrir l'enveloppe
                  </button>
                </div>

                {/* Parchment preview peeking from envelope */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[90%] h-24 bg-[#fdfaf6]/10 rounded-t-lg border-t border-[#d4af37]/20 z-0 pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* PHASE 2: Open Parchment Letter sliding up & expanding into center */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="parchment"
                initial={{ y: 120, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full bg-[#fdfaf6]/95 text-[#1a0505] p-8 sm:p-14 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.9)] border-2 border-[#d4af37]/70 text-left min-h-[440px] flex flex-col justify-between relative overflow-visible"
              >
                {/* Progressive Floral SVG Borders on 4 Corners */}
                <ProgressiveFloralCorner position="top-left" progress={typingProgress} />
                <ProgressiveFloralCorner position="top-right" progress={typingProgress} />
                <ProgressiveFloralCorner position="bottom-left" progress={typingProgress} />
                <ProgressiveFloralCorner position="bottom-right" progress={typingProgress} />

                {/* Letter Header */}
                <div>
                  <div className="flex items-center justify-between border-b border-[#d4af37]/40 pb-4 mb-6">
                    <div className="flex items-center gap-2 text-[#881337]">
                      <Sparkles className="w-4 h-4 text-[#d4af37]" />
                      <span className="font-serif text-xs font-bold uppercase tracking-widest">
                        Lettre d'amour
                      </span>
                    </div>

                    {isTyping && (
                      <button
                        onClick={handleSkipTyping}
                        className="px-3 py-1 rounded-full bg-[#881337]/10 text-[#881337] text-xs font-serif font-semibold hover:bg-[#881337]/20 transition-colors cursor-pointer"
                      >
                        Afficher tout
                      </button>
                    )}
                  </div>

                  {/* Typewriter Body Content */}
                  <div
                    className="font-serif-body text-stone-900 text-lg sm:text-2xl leading-relaxed italic whitespace-pre-wrap min-h-[200px] py-2 relative z-20 cursor-pointer"
                    onClick={() => {
                      if (isTyping) {
                        handleSkipTyping();
                      }
                    }}
                    aria-label="Lettre animée"
                  >
                    <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-[#881337] first-letter:mr-1">
                      {typedText}
                    </p>
                    {isTyping && (
                      <span className="inline-block w-2 h-6 bg-[#881337] ml-1 animate-pulse" />
                    )}
                  </div>

                  {!isTyping && typedText.length === fullLetter.length && (
                    <button
                      type="button"
                      onClick={() => onNextStage()}
                      className="mt-6 inline-flex items-center justify-center rounded-full bg-[#881337] px-6 py-3 text-sm font-semibold text-white shadow-soft-button transition hover:bg-[#9f1239]"
                    >
                      Continuer vers la suite
                    </button>
                  )}
                </div>

                {/* Letter Footer Signature */}
                <div className="pt-4 border-t border-[#d4af37]/30 flex items-center justify-end relative z-20">
                  <div className="font-serif text-lg font-bold italic text-[#881337]">
                    ~ {config.senderName}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
};

