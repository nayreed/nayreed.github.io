import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Pause, Play, Volume2, VolumeX } from 'lucide-react';

type FullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};

type FullscreenVideoElement = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '0:00';
  }

  const rounded = Math.floor(seconds);
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface EisimDemoPlayerProps {
  src: string;
}

const EisimDemoPlayer = ({ src }: EisimDemoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [prefersNativeControls, setPrefersNativeControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px), (pointer: coarse) and (max-width: 900px)');
    const syncNativeControls = () => setPrefersNativeControls(mediaQuery.matches);

    syncNativeControls();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', syncNativeControls);
      return () => mediaQuery.removeEventListener('change', syncNativeControls);
    }

    mediaQuery.addListener(syncNativeControls);
    return () => mediaQuery.removeListener(syncNativeControls);
  }, []);

  useEffect(() => {
    const video = videoRef.current as FullscreenVideoElement | null;
    const syncFullscreen = () => {
      const fullscreenDocument = document as FullscreenDocument;
      setIsFullscreen(
        Boolean(
          document.fullscreenElement ||
            fullscreenDocument.webkitFullscreenElement ||
            video?.webkitDisplayingFullscreen
        )
      );
    };

    syncFullscreen();
    document.addEventListener('fullscreenchange', syncFullscreen);
    document.addEventListener('webkitfullscreenchange', syncFullscreen);
    video?.addEventListener('webkitbeginfullscreen', syncFullscreen);
    video?.addEventListener('webkitendfullscreen', syncFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreen);
      document.removeEventListener('webkitfullscreenchange', syncFullscreen);
      video?.removeEventListener('webkitbeginfullscreen', syncFullscreen);
      video?.removeEventListener('webkitendfullscreen', syncFullscreen);
    };
  }, []);

  const syncDuration = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
  };

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const nextTime = Number(event.target.value);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const toggleFullscreen = async () => {
    const frame = frameRef.current;
    const video = videoRef.current as FullscreenVideoElement | null;
    const fullscreenDocument = document as FullscreenDocument;
    const activeFullscreenElement =
      document.fullscreenElement || fullscreenDocument.webkitFullscreenElement;

    try {
      if (activeFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          return;
        }

        await fullscreenDocument.webkitExitFullscreen?.();
        return;
      }

      if (!prefersNativeControls && frame?.requestFullscreen) {
        await frame.requestFullscreen();
        return;
      }

      video?.webkitEnterFullscreen?.();
    } catch {
      // Fullscreen can be denied by the browser if the request loses user activation.
    }
  };

  return (
    <div className="mt-6 -mx-2 overflow-hidden rounded-xl border border-hairline-strong bg-soft sm:mx-0">
      <div ref={frameRef} className="eisim-demo-frame group relative aspect-video overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          preload="metadata"
          playsInline
          controls={prefersNativeControls}
          onClick={prefersNativeControls ? undefined : togglePlayback}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onLoadedMetadata={syncDuration}
          onDurationChange={syncDuration}
          onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
          aria-label="EISim demo video"
        >
          <source src={src} type="video/mp4" />
        </video>

        {!prefersNativeControls ? (
          <>
            <button
              type="button"
              className={`absolute inset-0 grid place-items-center bg-black/5 text-white transition-opacity duration-200 ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              }`}
              onClick={togglePlayback}
              aria-label={isPlaying ? 'Pause EISim demo' : 'Play EISim demo'}
            >
              <span className="grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-black/35 shadow-xl backdrop-blur-xl transition-transform hover:scale-105">
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </span>
            </button>

            <div className="absolute inset-x-2 bottom-2 sm:inset-x-4 sm:bottom-4">
              <div className="mx-auto flex min-h-12 max-w-[36rem] items-center gap-2 rounded-full border border-white/15 bg-black/45 px-2.5 py-2 text-white shadow-2xl backdrop-blur-2xl sm:gap-3 sm:px-3">
                <button
                  type="button"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  onClick={togglePlayback}
                  aria-label={isPlaying ? 'Pause EISim demo' : 'Play EISim demo'}
                >
                  {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                </button>

                <span className="hidden min-w-[2.3rem] text-right font-mono text-[11px] tabular-nums text-white/75 sm:inline">
                  {formatTime(currentTime)}
                </span>

                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={seek}
                  className="apple-video-range min-w-0 flex-1"
                  style={{ '--progress': `${progress}%` } as React.CSSProperties}
                  aria-label="EISim demo playback position"
                />

                <span className="hidden min-w-[2.3rem] font-mono text-[11px] tabular-nums text-white/75 sm:inline">
                  {formatTime(duration)}
                </span>

                <button
                  type="button"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute EISim demo' : 'Mute EISim demo'}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                <button
                  type="button"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? 'Exit EISim demo fullscreen' : 'Open EISim demo fullscreen'}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default EisimDemoPlayer;
