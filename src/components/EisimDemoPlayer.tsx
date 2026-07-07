import React, { useEffect, useRef, useState } from 'react';
import {
  Ellipsis,
  Maximize2,
  Minimize2,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from 'lucide-react';

type FullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};

type PictureInPictureDocument = Document & {
  pictureInPictureElement?: Element | null;
  exitPictureInPicture?: () => Promise<void>;
};

type FullscreenVideoElement = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
  requestPictureInPicture?: () => Promise<PictureInPictureWindow>;
  disablePictureInPicture?: boolean;
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '00:00';
  }

  const rounded = Math.floor(seconds);
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [prefersNativeControls, setPrefersNativeControls] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [controlsHaveFocus, setControlsHaveFocus] = useState(false);
  const [controlsActivity, setControlsActivity] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const remainingTime = Math.max(duration - currentTime, 0);

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
    if (prefersNativeControls || !isPlaying || controlsHaveFocus) {
      setControlsVisible(true);
      return;
    }

    if (!controlsVisible) return;

    const timeoutId = window.setTimeout(() => setControlsVisible(false), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [controlsActivity, controlsHaveFocus, controlsVisible, isPlaying, prefersNativeControls]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !prefersNativeControls) return;

    video.defaultMuted = true;
    video.muted = true;
    setIsMuted(true);

    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => setIsPlaying(false));
    }
  }, [prefersNativeControls]);

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

  useEffect(() => {
    const video = videoRef.current;
    const syncPictureInPicture = () => {
      const pipDocument = document as PictureInPictureDocument;
      setIsPictureInPicture(Boolean(pipDocument.pictureInPictureElement));
    };

    syncPictureInPicture();
    video?.addEventListener('enterpictureinpicture', syncPictureInPicture);
    video?.addEventListener('leavepictureinpicture', syncPictureInPicture);

    return () => {
      video?.removeEventListener('enterpictureinpicture', syncPictureInPicture);
      video?.removeEventListener('leavepictureinpicture', syncPictureInPicture);
    };
  }, []);

  const revealControls = () => {
    if (!prefersNativeControls) {
      setControlsVisible(true);
      setControlsActivity((activity) => activity + 1);
    }
  };

  const handleControlsBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setControlsHaveFocus(false);
    }
  };

  const syncDuration = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
  };

  const togglePlayback = async () => {
    revealControls();
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
    revealControls();
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    revealControls();
    const video = videoRef.current;
    if (!video) return;

    const nextTime = Number(event.target.value);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const skipBy = (seconds: number) => {
    revealControls();
    const video = videoRef.current;
    if (!video) return;

    const nextTime = Math.min(Math.max(video.currentTime + seconds, 0), duration || video.duration || 0);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const togglePictureInPicture = async () => {
    revealControls();
    const video = videoRef.current as FullscreenVideoElement | null;
    const pipDocument = document as PictureInPictureDocument;
    if (!video) return;

    try {
      if (pipDocument.pictureInPictureElement) {
        await pipDocument.exitPictureInPicture?.();
        return;
      }

      await video.requestPictureInPicture?.();
    } catch {
      // Picture-in-picture support and permissions vary by browser.
    }
  };

  const toggleFullscreen = async () => {
    revealControls();
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
      <div
        ref={frameRef}
        className="eisim-demo-frame group relative overflow-hidden bg-black"
        onPointerMove={revealControls}
        onPointerDown={revealControls}
        onFocusCapture={() => {
          setControlsHaveFocus(true);
          revealControls();
        }}
        onBlurCapture={handleControlsBlur}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          preload="metadata"
          playsInline
          autoPlay={prefersNativeControls}
          defaultMuted={prefersNativeControls}
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
          <div
            className={`pointer-events-none absolute inset-0 text-white transition-opacity duration-300 ${
              controlsVisible ? 'opacity-100' : 'eisim-controls-hidden opacity-0'
            }`}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent" />

            <div className="absolute left-3 top-3 flex items-center gap-2 sm:left-4 sm:top-4">
              <button
                type="button"
                className="eisim-video-button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit EISim demo fullscreen' : 'Open EISim demo fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>

              <button
                type="button"
                className={`eisim-video-button ${isPictureInPicture ? 'is-active' : ''}`}
                onClick={togglePictureInPicture}
                aria-label={isPictureInPicture ? 'Exit picture in picture' : 'Open picture in picture'}
              >
                <PictureInPicture2 size={18} />
              </button>
            </div>

            <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
              <button
                type="button"
                className="eisim-video-button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute EISim demo' : 'Mute EISim demo'}
              >
                {isMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
              </button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center gap-5 sm:gap-7">
              <button
                type="button"
                className="eisim-video-button h-12 w-12 sm:h-14 sm:w-14"
                onClick={() => skipBy(-10)}
                aria-label="Rewind EISim demo 10 seconds"
              >
                <RotateCcw size={22} />
                <span className="absolute mt-0.5 text-[10px] font-bold leading-none">10</span>
              </button>

              <button
                type="button"
                className="eisim-video-button eisim-video-button--primary h-16 w-16 sm:h-20 sm:w-20"
                onClick={togglePlayback}
                aria-label={isPlaying ? 'Pause EISim demo' : 'Play EISim demo'}
              >
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={34} fill="currentColor" />}
              </button>

              <button
                type="button"
                className="eisim-video-button h-12 w-12 sm:h-14 sm:w-14"
                onClick={() => skipBy(10)}
                aria-label="Forward EISim demo 10 seconds"
              >
                <RotateCw size={22} />
                <span className="absolute mt-0.5 text-[10px] font-bold leading-none">10</span>
              </button>
            </div>

            <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
              <div className="eisim-video-control-dock flex min-h-12 items-center gap-3 rounded-full px-3 py-2 sm:gap-4 sm:px-4">
                <span className="min-w-[2.6rem] text-right font-mono text-[11px] tabular-nums text-white/85 sm:min-w-[3rem] sm:text-xs">
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

                <span className="min-w-[2.9rem] font-mono text-[11px] tabular-nums text-white/85 sm:min-w-[3.3rem] sm:text-xs">
                  -{formatTime(remainingTime)}
                </span>

                <button
                  type="button"
                  className="eisim-video-button h-8 w-8 shrink-0"
                  aria-label="Additional playback options"
                >
                  <Ellipsis size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EisimDemoPlayer;
