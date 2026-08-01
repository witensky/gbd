import React, { useEffect, useRef } from 'react';

interface BackgroundParticlesProps {
  intensity?: 'low' | 'medium' | 'high';
}

export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ intensity = 'medium' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle count based on intensity
    const count = intensity === 'low' ? 35 : intensity === 'high' ? 90 : 60;
    
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      color: string;
      isHeart: boolean;
      rot: number;
      rotSpeed: number;
    }

    const colors = [
      'rgba(244, 114, 182, ', // Rose pink
      'rgba(251, 191, 36, ',  // Gold
      'rgba(225, 29, 72, ',   // Deep red
      'rgba(252, 248, 248, '  // Off white
    ];

    const particles: Particle[] = Array.from({ length: count }, () => {
      const isHeart = Math.random() < 0.35;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: isHeart ? Math.random() * 8 + 6 : Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.7 + 0.2,
        fadeSpeed: (Math.random() - 0.5) * 0.005,
        color: colors[Math.floor(Math.random() * colors.length)],
        isHeart,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02
      };
    });

    // Mouse interactive trail
    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const drawHeart = (x: number, y: number, size: number, color: string, opacity: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.fillStyle = color + opacity + ')';
      ctx.shadowBlur = 10;
      ctx.shadowColor = color + '0.8)';
      const d = size;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
      ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial ambient backdrop
      const grad = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        10,
        width / 2,
        height * 0.4,
        Math.max(width, height)
      );
      grad.addColorStop(0, 'rgba(59, 10, 26, 0.45)');
      grad.addColorStop(0.5, 'rgba(20, 10, 20, 0.75)');
      grad.addColorStop(1, 'rgba(10, 8, 13, 0.98)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render & update particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fadeSpeed;
        p.rot += p.rotSpeed;

        if (p.opacity <= 0.1 || p.opacity >= 0.9) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Slight magnetic drift away or towards cursor
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 0.4;
          p.y -= (dy / dist) * 0.4;
        }

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        if (p.isHeart) {
          drawHeart(p.x, p.y, p.size, p.color, p.opacity, p.rot);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color + p.opacity + ')';
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color + '0.9)';
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
};
