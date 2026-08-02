import { Music } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  currentStageId?: string;
}

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YOUTUBE_VIDEO_ID = 'JOmXgTDOP3k';
const YOUTUBE_IFRAME_API_SRC = 'https://www.youtube.com/iframe_api';
const FALLBACK_AUDIO_SRC = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const loadYouTubeIframeApi = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    const existingScript = document.querySelector(`script[src="${YOUTUBE_IFRAME_API_SRC}"]`);
    if (existingScript) {
      const previousCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (typeof previousCallback === 'function') previousCallback();
        resolve();
      };
      return;
    }

    const tag = document.createElement('script');
    tag.src = YOUTUBE_IFRAME_API_SRC;
    tag.async = true;
    (window as any).onYouTubeIframeAPIReady = () => {
      resolve();
    };
    document.body.appendChild(tag);
  });
};

export const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const playerRef = useRef<any>(null);
  const fallbackAudioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackActivatedRef = useRef(false);
  const isReadyRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const [, setHasInteracted] = useState(false);

  const activateFallbackAudio = (source: string) => {
    if (fallbackActivatedRef.current) return;
    fallbackActivatedRef.current = true;

    const audio = new Audio(source);
    audio.loop = true;
    audio.preload = 'auto';
    audio.muted = !hasInteractedRef.current;
    audio.volume = 0.18;

    const tryPlay = () => {
      audio.play().catch(() => {
        // Autoplay may still be blocked until user interaction.
      });
    };

    audio.addEventListener('error', () => {
      if (source === FALLBACK_AUDIO_SRC) {
        // No alternative source configured; simply log the error.
        console.warn('AudioPlayer fallback failed to load:', source);
      }
    });

    fallbackAudioRef.current = audio;
    tryPlay();
  };

  const activateAudioFallbackIfNeeded = (reason: string) => {
    if (fallbackActivatedRef.current) return;
    activateFallbackAudio(FALLBACK_AUDIO_SRC);
    console.warn('AudioPlayer fallback activated:', reason);
  };

  useEffect(() => {
    let mounted = true;
    let intervalId: number | undefined;
    let fallbackTimeoutId: number | undefined;

    const ensurePlaying = () => {
      const player = playerRef.current;
      if (!player || !window.YT || !player.getPlayerState) return;
      const state = player.getPlayerState();
      if (state !== window.YT.PlayerState.PLAYING) {
        player.playVideo();
      }
    };

    const initializePlayer = async () => {
      await loadYouTubeIframeApi();
      if (!mounted || !window.YT || !window.YT.Player) {
        activateAudioFallbackIfNeeded('youtube-api-unavailable');
        return;
      }

      playerRef.current = new window.YT.Player('youtube-background-player', {
        height: '1',
        width: '1',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          mute: 1,
          playsinline: 1,
          origin: window.location.origin,
          enablejsapi: 1
        },
        events: {
          onReady: (event: any) => {
            if (!mounted) return;
            isReadyRef.current = true;
            if (hasInteractedRef.current) {
              event.target.unMute();
              event.target.setVolume(34);
            } else {
              event.target.mute();
            }
            event.target.playVideo();
            intervalId = window.setInterval(ensurePlaying, 2000);
          },
          onStateChange: (event: any) => {
            if (!mounted) return;
            if (
              event.data === window.YT.PlayerState.ENDED ||
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.UNSTARTED ||
              event.data === window.YT.PlayerState.CUED
            ) {
              event.target.playVideo();
            }
          },
          onError: () => {
            activateAudioFallbackIfNeeded('youtube-player-error');
          }
        }
      });
    };

    initializePlayer();

    fallbackTimeoutId = window.setTimeout(() => {
      if (!isReadyRef.current) {
        activateAudioFallbackIfNeeded('youtube-init-timeout');
      }
    }, 5000);

    return () => {
      mounted = false;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      if (fallbackTimeoutId) {
        window.clearTimeout(fallbackTimeoutId);
      }
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      if (fallbackAudioRef.current) {
        fallbackAudioRef.current.pause();
        fallbackAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const onFirstInteraction = () => {
      if (hasInteractedRef.current) return;
      hasInteractedRef.current = true;
      setHasInteracted(true);

      const player = playerRef.current;
      if (player && player.unMute) {
        player.unMute();
        if (player.setVolume) player.setVolume(34);
      }

      const audio = fallbackAudioRef.current;
      if (audio) {
        audio.muted = false;
        audio.volume = 0.22;
        audio.play().catch(() => {});
      }
    };

    window.addEventListener('pointerdown', onFirstInteraction, { once: true, capture: true });
    window.addEventListener('touchstart', onFirstInteraction, { once: true, capture: true });

    return () => {
      window.removeEventListener('pointerdown', onFirstInteraction, true);
      window.removeEventListener('touchstart', onFirstInteraction, true);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      <div className="glass-card bg-[#140b16]/80 backdrop-blur-md border border-rose-500/20 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 transition-all hover:border-rose-400/40 hover:shadow-rose-900/30">
        <div className="flex items-center gap-2 text-left text-xs">
          <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
            <Music className="w-3.5 h-3.5" />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-rose-100 font-medium text-[11px]">Mélodie Amoureuse</div>
            <div className="text-[10px] text-rose-300/60">Douceur & Tendresse</div>
          </div>
        </div>
      </div>
      <div style={{ width: 1, height: 1, opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div id="youtube-background-player" />
      </div>
    </div>
  );
};
