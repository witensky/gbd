import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Star, Gift, Moon } from 'lucide-react';

interface SurpriseNotice {
  id: string;
  message: string;
  subtext: string;
}

export const SurpriseHearts: React.FC = () => {
  const [activeSurprise, setActiveSurprise] = useState<SurpriseNotice | null>(null);

  const secrets: SurpriseNotice[] = [
    {
      id: "sec-1",
      message: "Tu as trouvé le premier secret caché ! ✨",
      subtext: "Savais-tu que mon cœur bat un peu plus vite à chaque fois que je reçois un message de toi ?"
    },
    {
      id: "sec-2",
      message: "Étoile de la nuit 🌟",
      subtext: "Si les étoiles tombaient à chaque fois que je pense à toi, le ciel serait totalement vide."
    },
    {
      id: "sec-3",
      message: "Secret de tendresse ❤️",
      subtext: "Ton rire est littéralement mon son préféré sur Terre."
    },
    {
      id: "sec-4",
      message: "Pensée douce 🕊️",
      subtext: "Merci d'exister et de faire de ce monde un endroit merveilleux."
    }
  ];

  const triggerSurprise = (index: number) => {
    const s = secrets[index % secrets.length];
    setActiveSurprise(s);

    // Heart explosion confetti effect
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fbbf24', '#e11d48', '#ffffff']
      });
    } catch {
      // Confetti fallback
    }
  };

  return (
    <>
      {/* Secret Floating Trigger Nodes in corner areas */}
      <div className="fixed top-24 left-6 z-30 pointer-events-auto">
        <button
          onClick={() => triggerSurprise(0)}
          className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:text-amber-300 hover:bg-rose-500/30 hover:scale-125 transition-all flex items-center justify-center shadow-lg group cursor-pointer animate-pulse-slow"
          title="Un petit secret caché..."
        >
          <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
        </button>
      </div>

      <div className="fixed top-1/3 right-6 z-30 pointer-events-auto hidden sm:block">
        <button
          onClick={() => triggerSurprise(1)}
          className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/30 hover:scale-125 transition-all flex items-center justify-center shadow-lg group cursor-pointer animate-float"
          title="Cliquez pour attraper cette étoile !"
        >
          <Star className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110" />
        </button>
      </div>

      <div className="fixed bottom-24 left-6 z-30 pointer-events-auto">
        <button
          onClick={() => triggerSurprise(2)}
          className="w-7 h-7 rounded-full bg-rose-900/30 border border-rose-400/30 text-rose-400 hover:bg-rose-600 hover:text-white hover:scale-125 transition-all flex items-center justify-center shadow-lg cursor-pointer"
          title="Un battement de cœur secret..."
        >
          <Heart className="w-3.5 h-3.5 fill-rose-400" />
        </button>
      </div>

      <div className="fixed bottom-1/3 right-8 z-30 pointer-events-auto hidden sm:block">
        <button
          onClick={() => triggerSurprise(3)}
          className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-300/20 text-indigo-200 hover:bg-indigo-400/30 hover:scale-125 transition-all flex items-center justify-center shadow-lg cursor-pointer animate-float"
          title="Une lueur discrète dans la nuit..."
        >
          <Moon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Modal Popup for Secret Message */}
      {activeSurprise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1a0c1f] border-2 border-amber-400/60 p-6 rounded-2xl max-w-md w-full text-center shadow-2xl box-glow-gold relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 mx-auto mb-3 animate-bounce">
              <Gift className="w-6 h-6" />
            </div>

            <h3 className="font-serif-title text-xl font-bold text-amber-300 mb-2">
              {activeSurprise.message}
            </h3>

            <p className="font-serif-body text-rose-100 text-base italic leading-relaxed mb-6 bg-rose-950/40 p-4 rounded-xl border border-rose-900/40">
              "{activeSurprise.subtext}"
            </p>

            <button
              onClick={() => setActiveSurprise(null)}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-medium text-xs shadow-lg shadow-rose-900/50 transition-all cursor-pointer"
            >
              Garder précieusement ce secret ❤️
            </button>
          </div>
        </div>
      )}
    </>
  );
};
