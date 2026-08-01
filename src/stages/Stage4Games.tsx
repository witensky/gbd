import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  Heart,
  Lightbulb,
  Medal,
  Shuffle,
  Sparkles,
  Trophy
} from 'lucide-react';
import { motion } from 'motion/react';
import React, { useCallback, useEffect, useState } from 'react';
import { LoveStoryConfig } from '../types';

interface Stage4GamesProps {
  config: LoveStoryConfig;
  onNextStage: () => void;
}

// ---------- Helpers ----------

const formatTime = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const shuffleArray = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

interface HeartSpot {
  id: number;
  top: number;
  left: number;
  size: number;
}

const generateHeartSpots = (count: number): HeartSpot[] => {
  const spots: HeartSpot[] = [];
  let attempts = 0;
  while (spots.length < count && attempts < 300) {
    attempts++;
    const candidate = { top: 14 + Math.random() * 68, left: 8 + Math.random() * 84 };
    const tooClose = spots.some((s) => Math.hypot(s.top - candidate.top, s.left - candidate.left) < 20);
    if (!tooClose) {
      spots.push({ id: spots.length + 1, ...candidate, size: 22 + Math.random() * 14 });
    }
  }
  // Fallback in the rare case the loop couldn't place all of them
  while (spots.length < count) {
    const i = spots.length;
    spots.push({ id: i + 1, top: 20 + i * 15, left: 20 + ((i * 27) % 60), size: 26 });
  }
  return spots;
};

const SYMBOL_POOL = ['❤️', '🌹', '✨', '💍', '🕊️', '💫', '🌙', '⭐'];

interface MemoryCard {
  uid: string;
  pairKey: string;
  symbol: string;
  photoUrl?: string;
}

const buildMemoryDeck = (config: LoveStoryConfig): MemoryCard[] => {
  const pairCount = 4;
  const availablePhotos = config.photos || [];
  const pairs: MemoryCard[] = Array.from({ length: pairCount }).map((_, i) => ({
    uid: '',
    pairKey: `pair-${i}`,
    symbol: SYMBOL_POOL[i % SYMBOL_POOL.length],
    photoUrl: availablePhotos.length > 0 ? availablePhotos[i % availablePhotos.length]?.url : undefined
  }));

  const deck = [...pairs, ...pairs].map((card, idx) => ({ ...card, uid: `${card.pairKey}-${idx}` }));
  return shuffleArray(deck);
};

export const Stage4Games: React.FC<Stage4GamesProps> = ({ config, onNextStage }) => {
  const [activeTab, setActiveTab] = useState<'hearts' | 'memory'>('hearts');
  const [completedGames, setCompletedGames] = useState<string[]>([]);

  const allGamesComplete = completedGames.length >= 2;

  const markGameComplete = useCallback(
    (gameId: string) => {
      setCompletedGames((prev) => {
        if (prev.includes(gameId)) return prev;
        const updated = [...prev, gameId];
        try {
          confetti({
            particleCount: 90,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#f472b6', '#fbbf24', '#e11d48']
          });
        } catch {}

        if (updated.length >= 2) {
          setTimeout(() => onNextStage(), 2200);
        } else {
          const remaining = (['hearts', 'memory'] as const).find((g) => !updated.includes(g));
          if (remaining) setTimeout(() => setActiveTab(remaining), 1700);
        }
        return updated;
      });
    },
    [onNextStage]
  );

  // ================= GAME 1: CONSTELLATION OF HEARTS =================
  interface ConstellationNode {
    id: number;
    top: number;
    left: number;
    size: number;
    isHeart: boolean;
  }

  const generateConstellationNodes = (targetCount: number): ConstellationNode[] => {
    const totalSlots = 12;
    const targetPositions = new Set<number>();

    while (targetPositions.size < targetCount) {
      targetPositions.add(Math.floor(Math.random() * totalSlots));
    }

    return Array.from({ length: totalSlots }, (_, index) => ({
      id: index + 1,
      top: 10 + (index % 4) * 20 + (index % 2 === 0 ? 4 : 0),
      left: 10 + Math.floor(index / 4) * 24 + (index % 2 === 0 ? 4 : 0),
      size: 18 + (index % 3) * 4,
      isHeart: targetPositions.has(index)
    }));
  };

  const totalHeartsCount = 6;
  const [constellationNodes, setConstellationNodes] = useState<ConstellationNode[]>(() => generateConstellationNodes(totalHeartsCount));
  const [foundHeartIds, setFoundHeartIds] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [heartsElapsed, setHeartsElapsed] = useState(0);
  const [heartsStarted, setHeartsStarted] = useState(false);
  const [heartsFinishedTime, setHeartsFinishedTime] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const heartsDone = foundHeartIds.length === totalHeartsCount;

  useEffect(() => {
    if (!heartsStarted || heartsDone) return;
    const interval = setInterval(() => setHeartsElapsed((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [heartsStarted, heartsDone]);

  const handleConstellationClick = (id: number) => {
    if (foundHeartIds.includes(id)) return;
    if (!heartsStarted) setHeartsStarted(true);

    const node = constellationNodes.find((spot) => spot.id === id);
    if (!node) return;

    if (node.isHeart) {
      const updated = [...foundHeartIds, id];
      setFoundHeartIds(updated);

      try {
        confetti({ particleCount: 24, spread: 45, origin: { y: 0.6 }, colors: ['#fbbf24', '#f472b6', '#fda4af'] });
      } catch {}

      if (updated.length === totalHeartsCount) {
        setHeartsFinishedTime(heartsElapsed);
        markGameComplete('hearts');
      }
    } else {
      setMistakes((prev) => prev + 1);
    }
  };

  const handleHeartsReplay = () => {
    setConstellationNodes(generateConstellationNodes(totalHeartsCount));
    setFoundHeartIds([]);
    setMistakes(0);
    setHeartsElapsed(0);
    setHeartsStarted(false);
    setHeartsFinishedTime(null);
  };

  const handleHint = () => {
    if (showHint) return;
    setShowHint(true);
    setTimeout(() => setShowHint(false), 1400);
  };

  // ================= GAME 2: MEMORY CARDS =================
  const [cards, setCards] = useState<MemoryCard[]>(() => buildMemoryDeck(config));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestMoves, setBestMoves] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('love_story_memory_best_moves');
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });
  const memoryDone = matchedIndices.length === cards.length && cards.length > 0;

  const handleMemoryCardClick = (index: number) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedIndices.includes(index)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      setMoves((m) => m + 1);

      if (cards[firstIdx].pairKey === cards[secondIdx].pairKey) {
        const newMatched = [...matchedIndices, firstIdx, secondIdx];
        setMatchedIndices(newMatched);
        setFlippedIndices([]);

        if (newMatched.length === cards.length) {
          const finalMoves = moves + 1;
          if (bestMoves === null || finalMoves < bestMoves) {
            setBestMoves(finalMoves);
            try {
              localStorage.setItem('love_story_memory_best_moves', String(finalMoves));
            } catch {}
          }
          markGameComplete('memory');
        }
      } else {
        setTimeout(() => setFlippedIndices([]), 900);
      }
    }
  };

  const handleMemoryReplay = () => {
    setCards(buildMemoryDeck(config));
    setFlippedIndices([]);
    setMatchedIndices([]);
    setMoves(0);
  };

  // ================= GAME 3: STAR MIRROR =================

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-24 z-10">

      {/* Background radial highlight */}
      <div className="absolute w-[500px] h-[500px] bg-rose-900/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl w-full">

        {/* Stage Header */}
        <div className="text-center mb-8">
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-rose-100 mb-2">
            Trois passages silencieux
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('hearts')}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'hearts'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-900/50 scale-105'
                : 'bg-rose-950/40 text-rose-300 border border-rose-900/40 hover:bg-rose-900/40'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Cœur</span>
            {completedGames.includes('hearts') && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'memory'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-900/50 scale-105'
                : 'bg-rose-950/40 text-rose-300 border border-rose-900/40 hover:bg-rose-900/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mémoire</span>
            {completedGames.includes('memory') && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

        </div>

        {/* GAME CONTENT CONTAINER */}
        <div className="bg-[linear-gradient(135deg,rgba(20,11,23,0.97),rgba(31,12,29,0.9))] border border-white/10 p-6 sm:p-10 rounded-[2rem] shadow-[0_25px_80px_rgba(0,0,0,0.35)] min-h-[440px] relative backdrop-blur-xl">

          {/* GAME 1: CONSTELLATION OF HEARTS */}
          {activeTab === 'hearts' && (
            <div className="relative min-h-[360px] rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%),linear-gradient(135deg,#1b0d1f,#0b0710)] p-6 overflow-hidden text-center flex flex-col justify-between">

              <div>
                <h3 className="font-serif-title text-xl font-bold text-rose-100 mb-1">
                  Constellation secrète
                </h3>
                <p className="text-xs text-rose-300/70 font-sans-body">
                  Repère les vrais éclats.
                </p>

                <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-amber-300/80 font-sans-body">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-white/5 px-2.5 py-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(heartsDone && heartsFinishedTime !== null ? heartsFinishedTime : heartsElapsed)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-white/5 px-2.5 py-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {mistakes} faux
                  </span>
                  {!heartsDone && (
                    <button
                      onClick={handleHint}
                      disabled={showHint}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      Indice
                    </button>
                  )}
                  {heartsDone && (
                    <button
                      onClick={handleHeartsReplay}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      Rejouer
                    </button>
                  )}
                </div>
              </div>

              <div className="relative flex-1 min-h-[220px] mt-4">
                {constellationNodes.map((spot) => {
                  const isFound = foundHeartIds.includes(spot.id);
                  const reveal = isFound || showHint;

                  return (
                    <motion.button
                      key={spot.id}
                      onClick={() => handleConstellationClick(spot.id)}
                      animate={{ scale: isFound ? 1.3 : [1, 1.06, 1] }}
                      transition={{ repeat: isFound ? 0 : Infinity, duration: 2.4 }}
                      style={{ top: `${spot.top}%`, left: `${spot.left}%` }}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                        isFound
                          ? 'bg-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.8)] opacity-100'
                          : reveal
                            ? spot.isHeart
                              ? 'bg-rose-500/10 opacity-80 hover:opacity-100'
                              : 'bg-amber-500/10 opacity-70'
                            : 'bg-rose-500/5 opacity-[0.08] hover:opacity-90'
                      }`}
                    >
                      {spot.isHeart ? (
                        <Heart
                          style={{ width: spot.size, height: spot.size }}
                          className={isFound ? 'text-amber-300 fill-amber-400' : 'text-rose-400 fill-rose-500'}
                        />
                      ) : (
                        <Sparkles
                          style={{ width: spot.size, height: spot.size }}
                          className="text-amber-300/70"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {heartsDone && (
                <div className="mt-6 bg-emerald-950/70 border border-emerald-500/30 p-4 rounded-2xl text-emerald-200 animate-fade-in">
                  <div className="font-serif-title text-lg font-bold flex items-center justify-center gap-2 mb-1">
                    <Trophy className="w-5 h-5 text-amber-300" />
                    <span>Constellation révélée</span>
                  </div>
                  <p className="text-xs text-emerald-300/80">
                    {formatTime(heartsFinishedTime ?? heartsElapsed)} pour la lire jusqu’au bout.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* GAME 2: MEMORY CARDS */}
          {activeTab === 'memory' && (
            <div>
              <div className="text-center mb-6">
                <h3 className="font-serif-title text-xl font-bold text-rose-100 mb-1">
                  Souvenirs en miroir
                </h3>
                <p className="text-xs text-rose-300/70">
                  Retourne les cartes jusqu’à ce qu’elles se reconnaissent.
                </p>
                <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-amber-300/80 font-sans-body">
                  <span className="rounded-full border border-rose-500/20 bg-white/5 px-2.5 py-1">Coups : <strong className="text-rose-100">{moves}</strong></span>
                  {bestMoves !== null && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-white/5 px-2.5 py-1">
                      <Medal className="w-3.5 h-3.5 text-amber-300" />
                      {bestMoves}
                    </span>
                  )}
                  <button
                    onClick={handleMemoryReplay}
                    className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-white/5 px-2.5 py-1 text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    Rejouer
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto" style={{ perspective: 1000 }}>
                {cards.map((card, idx) => {
                  const isFlipped = flippedIndices.includes(idx) || matchedIndices.includes(idx);
                  const isMatched = matchedIndices.includes(idx);

                  return (
                    <button
                      key={card.uid}
                      onClick={() => handleMemoryCardClick(idx)}
                      className="aspect-square cursor-pointer"
                      style={{ perspective: 1000 }}
                    >
                      <motion.div
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.45, ease: 'easeInOut' }}
                        className="relative w-full h-full"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Card back (hidden face) */}
                        <div
                          className="absolute inset-0 rounded-xl border border-rose-900/50 bg-[#140b17] hover:border-rose-500/50 flex items-center justify-center shadow-lg transition-colors"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <Heart className="w-5 h-5 text-rose-700/60" />
                        </div>

                        {/* Card front (revealed face) */}
                        <div
                          className={`absolute inset-0 rounded-xl border flex items-center justify-center text-2xl shadow-lg overflow-hidden ${
                            isMatched ? 'border-emerald-400/60 shadow-emerald-900/30' : 'border-amber-400/60 shadow-amber-900/30'
                          } bg-[#25102a]`}
                          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                          {card.photoUrl ? (
                            <img
                              src={card.photoUrl}
                              alt="Souvenir"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span>{card.symbol}</span>
                          )}
                        </div>
                      </motion.div>
                    </button>
                  );
                })}
              </div>

              {memoryDone && (
                <div className="mt-6 text-center bg-amber-950/60 border border-amber-500/40 p-4 rounded-2xl text-amber-200 animate-fade-in">
                  <Trophy className="w-6 h-6 text-amber-300 mx-auto mb-1" />
                  <div className="font-serif-title text-lg font-bold">Mémoire parfaite</div>
                  <p className="text-xs text-amber-300/80">
                    Terminé en {moves} coup{moves > 1 ? 's' : ''}
                    {bestMoves === moves ? ' — record battu.' : ''}
                  </p>
                </div>
              )}
            </div>
          )}


        </div>

        <div className="mt-6 text-center">
          {allGamesComplete ? (
            <p className="text-[11px] uppercase tracking-[0.3em] text-rose-300/50">
              La suite s’ouvre d’elle-même
            </p>
          ) : (
            <p className="text-xs text-rose-300/50 font-sans-body italic">
              Chaque défi ouvre un peu plus la suite.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
