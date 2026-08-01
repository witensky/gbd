import confetti from 'canvas-confetti';
import { Calendar, Camera, ChevronLeft, ChevronRight, Heart, MapPin, Maximize2, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import { LoveStoryConfig, PhotoItem } from '../types';

interface Stage3PhotosProps {
  config: LoveStoryConfig;
  onNextStage: () => void;
}

export const Stage3Photos: React.FC<Stage3PhotosProps> = ({ config, onNextStage }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const photos = config.photos || [];

  const handleOpenLightbox = (photo: PhotoItem, index: number) => {
    setSelectedPhoto(photo);
    setActivePhotoIndex(index);
    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#f472b6', '#fbbf24']
      });
    } catch {}
  };

  const handlePrevPhoto = () => {
    const nextIdx = (activePhotoIndex - 1 + photos.length) % photos.length;
    setActivePhotoIndex(nextIdx);
    setSelectedPhoto(photos[nextIdx]);
  };

  const handleNextPhoto = () => {
    const nextIdx = (activePhotoIndex + 1) % photos.length;
    setActivePhotoIndex(nextIdx);
    setSelectedPhoto(photos[nextIdx]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-24 z-10">
      
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] bg-rose-900/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl w-full">
        
        {/* Stage Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-chip border border-rose-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Scène 3 : Galerie des Souvenirs</span>
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-rose-100 mb-2">
            Nos plus beaux moments figés dans le temps
          </h2>
          <p className="font-serif-body text-rose-200/70 text-sm sm:text-base italic">
            Touchez une image pour l’ouvrir et la regarder plus longtemps.
          </p>
        </div>

        {/* 3D Floating Polaroid Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {photos.map((photo, index) => {
            const rot = photo.rotation || (index % 2 === 0 ? -3 : 3);

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 40, rotate: rot * 2 }}
                animate={{ opacity: 1, y: 0, rotate: rot }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onClick={() => handleOpenLightbox(photo, index)}
                className="group relative bg-[#fcf8f8]/95 p-4 rounded-xl shadow-[0_18px_55px_rgba(0,0,0,0.26)] cursor-pointer text-stone-900 transition-all border border-white/70 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(225,29,72,0.2)]"
              >
                {/* Tape accent */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-200/60 backdrop-blur-sm border border-amber-300/40 rounded-sm rotate-2 z-10" />

                {/* Photo Frame Container */}
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-lg bg-stone-900 mb-3">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Hover Overlay Icon */}
                  <div className="absolute inset-0 bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="w-6 h-6 text-amber-300 animate-pulse" />
                  </div>
                </div>

                {/* Polaroid Handwritten Caption */}
                <div className="text-center">
                  <h4 className="font-handwriting text-xl text-stone-900 font-bold leading-tight mb-1">
                    {photo.title}
                  </h4>
                  {photo.date && (
                    <div className="text-[11px] text-stone-600 font-sans-body flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3 text-rose-600" />
                      <span>{photo.date}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div
          className="text-center text-[11px] uppercase tracking-[0.3em] text-rose-300/50 cursor-pointer"
          onClick={onNextStage}
        >
          Continuez simplement en touchant ici
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <div className="relative max-w-4xl w-full bg-[#140b17] border border-rose-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row box-glow-rose">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Lightbox Image */}
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[450px]">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] w-full object-contain"
                />

                {/* Lightbox Nav Buttons */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Photo Caption Details */}
              <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-[#170c1b] border-t md:border-t-0 md:border-l border-rose-950">
                <div>
                  <div className="inline-flex items-center gap-1 text-amber-300 text-xs font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Souvenir Polaroid</span>
                  </div>

                  <h3 className="font-serif-title text-2xl font-bold text-rose-100 mb-3">
                    {selectedPhoto.title}
                  </h3>

                  <p className="font-serif-body text-rose-200/80 text-base italic leading-relaxed mb-6">
                    "{selectedPhoto.caption}"
                  </p>

                  <div className="space-y-2 text-xs text-rose-300/70 font-sans-body">
                    {selectedPhoto.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-rose-400" />
                        <span>Date : {selectedPhoto.date}</span>
                      </div>
                    )}
                    {selectedPhoto.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span>Lieu : {selectedPhoto.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-rose-950 flex items-center justify-between text-xs text-rose-400/60">
                  <span>Photo {activePhotoIndex + 1} / {photos.length}</span>
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
