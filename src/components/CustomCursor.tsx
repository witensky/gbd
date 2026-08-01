import React, { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const CustomCursor: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if device is touch primary
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    let count = 0;
    const colors = ['#f472b6', '#fbbf24', '#fbcfe8', '#e11d48'];

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const clickable = target?.closest('button, a, input, textarea, [role="button"], .interactive-card');
      setIsHovered(!!clickable);

      count++;
      if (count % 3 === 0) {
        const newSparkle: Sparkle = {
          id: Date.now() + Math.random(),
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)]
        };

        setSparkles((prev) => [...prev.slice(-15), newSparkle]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (sparkles.length === 0) return;
    const timer = setTimeout(() => {
      setSparkles((prev) => prev.slice(1));
    }, 400);
    return () => clearTimeout(timer);
  }, [sparkles]);

  if (isTouch) return null;

  return (
    <>
      {/* Main glowing cursor dot */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-75 ease-out rounded-full mix-blend-screen ${
          isHovered
            ? 'w-8 h-8 -mt-4 -ml-4 bg-rose-500/40 border border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.8)] scale-125'
            : 'w-4 h-4 -mt-2 -ml-2 bg-gradient-to-tr from-rose-400 to-amber-300 shadow-[0_0_12px_rgba(244,114,182,0.8)]'
        }`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`
        }}
      />

      {/* Sparkles trail */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="fixed pointer-events-none z-[9998] rounded-full animate-ping"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: sparkle.color,
            boxShadow: `0 0 10px ${sparkle.color}`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.7
          }}
        />
      ))}
    </>
  );
};
