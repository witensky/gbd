import confetti from 'canvas-confetti';
import { CheckCircle2, Heart, Lock, Send } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoveStoryConfig } from '../types';

interface Stage7FinalQuestionProps {
  config: LoveStoryConfig;
}

const submitNetlifyWish = async (answer: {
  answerText: string;
  recipientName: string;
  senderName: string;
  submittedAt: string;
}) => {
  const body = new URLSearchParams({
    'form-name': 'birthday-wishes',
    ...answer
  });

  await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });
};

export const Stage7FinalQuestion: React.FC<Stage7FinalQuestionProps> = ({
  config
}) => {
  const navigate = useNavigate();
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const finalQuestionText = config.finalQuestion ||
    "En ce jour spécial, dis-moi une chose que tu désires et moi je l'exauce ✨";

  const redirectToBirthday = () => {
    navigate('/birthday', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) {
      setErrorMsg("Écris ton désir ici...");
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    const newAnswerObj = {
      id: "ans-" + Date.now(),
      answerText: answerText.trim(),
      recipientName: config.recipientName,
      senderName: config.senderName,
      submittedAt: new Date().toISOString()
    };

    // 1. Local Storage persistence
    try {
      const existing = localStorage.getItem('romantic_final_answers');
      let list = existing ? JSON.parse(existing) : [];
      list.unshift(newAnswerObj);
      localStorage.setItem('romantic_final_answers', JSON.stringify(list));
    } catch (err) {
      console.error("Local storage error:", err);
    }

    // 2. Netlify Forms persistence for production deploys
    try {
      await submitNetlifyWish({
        answerText: newAnswerObj.answerText,
        recipientName: newAnswerObj.recipientName,
        senderName: newAnswerObj.senderName,
        submittedAt: newAnswerObj.submittedAt
      });
    } catch (err) {
      console.error("Netlify form post error:", err);
    }

    // 3. Local server API persistence for npm run dev
    try {
      await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answerText: answerText.trim(),
          recipientName: config.recipientName,
          senderName: config.senderName
        })
      });
    } catch (err) {
      console.error("API post error:", err);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Fire fireworks celebration
    try {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#f472b6', '#fbbf24', '#e11d48', '#ffffff']
      });
    } catch {}

    // Redirect immediately after the message is sent
    redirectToBirthday();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-20 z-10 text-center">
      
      {/* Soft Ambient Light Rays */}
      <div className="absolute w-[550px] h-[550px] bg-gradient-to-tr from-rose-900/30 via-amber-600/20 to-rose-950/30 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-xl w-full soft-card border border-amber-400/40 p-8 sm:p-12 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative overflow-hidden text-center"
      >
        
        {/* Heart Icon */}
        <div className="w-14 h-14 rounded-full bg-[#881337] border border-[#d4af37]/60 mx-auto mb-6 flex items-center justify-center shadow-lg">
          <Heart className="w-7 h-7 text-[#d4af37] fill-[#d4af37]/30" />
        </div>

        {/* The Emotional Final Prompt */}
        <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#fdfaf6] leading-relaxed mb-8">
          "{finalQuestionText}"
        </h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <textarea
                rows={4}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Exprime ton souhait le plus cher..."
                className="w-full bg-[#0a080d]/90 border border-[#d4af37]/40 rounded-2xl p-5 text-[#fdfaf6] font-serif-body text-lg placeholder:text-stone-500 focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all leading-relaxed"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-amber-300 font-medium">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-9 py-3.5 rounded-full bg-gradient-to-r from-[#881337] via-[#9f1239] to-[#d4af37] hover:scale-105 active:scale-95 text-white font-serif text-base font-semibold soft-button border border-[#d4af37]/50 transition-all cursor-pointer inline-flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              <span>Envoyer mon souhait ✨</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="font-serif-title text-xl font-bold text-emerald-200">
              Ton souhait a été scellé et enregistré avec amour ✨
            </h3>

            <p className="font-serif-body text-rose-100 text-lg italic leading-relaxed">
              "{answerText}"
            </p>

            <div className="pt-4 text-xs text-stone-400 flex items-center justify-center gap-1.5 font-serif">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Transmis avec soin pour {config.senderName}</span>
            </div>

            <button
              type="button"
              onClick={redirectToBirthday}
              className="mt-5 rounded-full bg-[#9f1239] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d4af37]"
            >
              Voir la surprise maintenant
            </button>
          </motion.div>
        )}

      </motion.div>

    </div>
  );
};
