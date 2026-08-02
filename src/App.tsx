import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Birthday from './birthday/Birthday';
import { getLoveStoryConfig } from './data/loveStory';
import { LoveStoryConfig, StageId, StageInfo } from './types';

import { AudioPlayer } from './components/AudioPlayer';
import { BackgroundParticles } from './components/BackgroundParticles';
import { CustomCursor } from './components/CustomCursor';
import { SurpriseHearts } from './components/SurpriseHearts';

import { Stage1Intro } from './stages/Stage1Intro';
import { Stage2Declarations } from './stages/Stage2Declarations';
import { Stage3Photos } from './stages/Stage3Photos';
import { Stage4Games } from './stages/Stage4Games';
import { Stage5Letter } from './stages/Stage5Letter';
import { Stage6FakeEnding } from './stages/Stage6FakeEnding';
import { Stage7FinalQuestion } from './stages/Stage7FinalQuestion';

function LoveStoryApp() {
  const [config] = useState<LoveStoryConfig>(getLoveStoryConfig());
  const [currentStageId, setCurrentStageId] = useState<StageId>('intro');
  const [unlockedStageIds, setUnlockedStageIds] = useState<StageId[]>(['intro']);

  const STAGES: StageInfo[] = [
    { id: 'intro', number: 1, title: 'Introduction', icon: '❤️', description: 'Une surprise vous attend...' },
    { id: 'declarations', number: 2, title: 'Déclarations', icon: '🌹', description: 'Les mots de mon cœur' },
    { id: 'photos', number: 3, title: 'Nos Photos', icon: '📸', description: 'Nos plus beaux souvenirs' },
    { id: 'games', number: 4, title: 'Mini-Jeux', icon: '🎮', description: 'Défis romantiques' },
    { id: 'letter', number: 5, title: 'Lettre d\'Amour', icon: '💌', description: 'Message manuscrit' },
    { id: 'fake_ending', number: 6, title: 'Émotion', icon: '🥹', description: 'Voilà...' },
    { id: 'final_question', number: 7, title: 'Question Finale', icon: '💖', description: 'Le moment ultime' },
  ];

  // Save stage unlocks in local storage
  useEffect(() => {
    try {
      const savedUnlocked = localStorage.getItem('love_story_unlocked_stages');
      if (savedUnlocked) {
        const parsed: StageId[] = JSON.parse(savedUnlocked);
        if (Array.isArray(parsed) && parsed.includes('intro')) {
          setUnlockedStageIds(parsed);
        }
      }
    } catch {}
  }, []);

  const unlockNextStage = (nextId: StageId) => {
    if (!unlockedStageIds.includes(nextId)) {
      const nextUnlocked = [...unlockedStageIds, nextId];
      setUnlockedStageIds(nextUnlocked);
      try {
        localStorage.setItem('love_story_unlocked_stages', JSON.stringify(nextUnlocked));
      } catch {}
    }
    setCurrentStageId(nextId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="app-shell relative min-h-screen bg-[#0a080d] text-[#fcf8f8] font-sans-body overflow-x-hidden selection:bg-rose-500/30 selection:text-rose-200">
      
      {/* Background Glowing Ambient Canvas */}
      <BackgroundParticles intensity="medium" />

      {/* Custom Romantic Sparkle Cursor */}
      <CustomCursor />

      {/* Easter Egg Clickable Surprises */}
      <SurpriseHearts />

      {/* Main Stage View Render — no header, no settings, fully immersive */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentStageId === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
            >
              <Stage1Intro
                config={config}
                onNextStage={() => unlockNextStage('declarations')}
              />
            </motion.div>
          )}

          {currentStageId === 'declarations' && (
            <motion.div
              key="declarations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <Stage2Declarations
                config={config}
                onNextStage={() => unlockNextStage('photos')}
              />
            </motion.div>
          )}

          {currentStageId === 'photos' && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <Stage3Photos
                config={config}
                onNextStage={() => unlockNextStage('games')}
              />
            </motion.div>
          )}

          {currentStageId === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <Stage4Games
                config={config}
                onNextStage={() => unlockNextStage('letter')}
              />
            </motion.div>
          )}

          {currentStageId === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <Stage5Letter
                config={config}
                onNextStage={() => unlockNextStage('fake_ending')}
              />
            </motion.div>
          )}

          {currentStageId === 'fake_ending' && (
            <motion.div
              key="fake_ending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.6 }}
            >
              <Stage6FakeEnding
                onNextStage={() => unlockNextStage('final_question')}
              />
            </motion.div>
          )}

          {currentStageId === 'final_question' && (
            <motion.div
              key="final_question"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Stage7FinalQuestion config={config} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}

export default function App() {
  return (
    <>
      <AudioPlayer />
      <Routes>
        <Route path="/birthday" element={<Birthday />} />
        <Route path="/birthday/index.html" element={<Birthday />} />
        <Route path="*" element={<LoveStoryApp />} />
      </Routes>
    </>
  );
}
