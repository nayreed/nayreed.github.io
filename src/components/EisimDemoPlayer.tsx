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

type ControlContrast = 'dark' | 'mixed' | 'bright';

type FullscreenVideoElement = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
  requestPictureInPicture?: () => Promise<PictureInPictureWindow>;
  disablePictureInPicture?: boolean;
};

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

const formatRate = (rate: number) => `${Number.isInteger(rate) ? rate.toFixed(0) : rate.toFixed(2).replace(/0$/, '')}x`;

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
  launchRequested?: boolean;
}

const EisimDemoPlayer = ({ src, launchRequested = false }: EisimDemoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const launchButtonRef = useRef<HTMLButtonElement>(null);
  const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [prefersNativeControls, setPrefersNativeControls] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [controlsHovered, setControlsHovered] = useState(false);
  const [controlsActivity, setControlsActivity] = useState(0);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [launchPromptVisible, setLaunchPromptVisible] = useState(launchRequested);
  const [controlContrast, setControlContrast] = useState<ControlContrast>('dark');
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
    if (prefersNativeControls || !isPlaying || controlsHovered) {
      setControlsVisible(true);
      return;
    }

    if (!controlsVisible) return;

    const timeoutId = window.setTimeout(() => setControlsVisible(false), 1200);
    return () => window.clearTimeout(timeoutId);
  }, [controlsActivity, controlsHovered, controlsVisible, isPlaying, prefersNativeControls]);

  useEffect(() => {
    if (!controlsVisible) {
      setSpeedMenuOpen(false);
    }
  }, [controlsVisible]);

  useEffect(() => {
    if (prefersNativeControls) return;

    const video = videoRef.current;
    if (!video) return;

    let timeoutId: number | undefined;
    let cancelled = false;

    const sampleFrame = () => {
      if (cancelled) return;

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth > 0) {
        const canvas = sampleCanvasRef.current ?? document.createElement('canvas');
        sampleCanvasRef.current = canvas;
        canvas.width = 24;
        canvas.height = 15;
        const context = canvas.getContext('2d', { willReadFrequently: true });

        try {
          context?.drawImage(video, 0, 0, canvas.width, canvas.height);
          const pixels = context?.getImageData(0, 0, canvas.width, canvas.height).data;

          if (pixels) {
            let luminanceTotal = 0;
            let brightPixels = 0;
            let darkPixels = 0;
            const pixelCount = pixels.length / 4;

            for (let index = 0; index < pixels.length; index += 4) {
              const luminance = pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722;
              luminanceTotal += luminance;
              if (luminance > 180) brightPixels += 1;
              if (luminance < 70) darkPixels += 1;
            }

            const averageLuminance = luminanceTotal / pixelCount;
            const brightRatio = brightPixels / pixelCount;
            const darkRatio = darkPixels / pixelCount;

            if (averageLuminance > 148 || brightRatio > 0.46) {
              setControlContrast('bright');
            } else if (averageLuminance < 78 || darkRatio > 0.5) {
              setControlContrast('dark');
            } else {
              setControlContrast('mixed');
            }
          }
        } catch {
          setControlContrast('dark');
        }
      }

      timeoutId = window.setTimeout(sampleFrame, isPlaying ? 900 : 1600);
    };

    sampleFrame();

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isPlaying, prefersNativeControls]);

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
    if (!launchRequested) return;

    setLaunchPromptVisible(true);
    setControlsVisible(true);
    window.setTimeout(() => launchButtonRef.current?.focus(), 450);
  }, [launchRequested]);

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

  const keepControlsOpen = () => {
    setControlsHovered(true);
    revealControls();
  };

  const releaseControls = () => {
    setControlsHovered(false);
    revealControls();
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

  const changePlaybackRate = (rate: number) => {
    revealControls();
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
    setSpeedMenuOpen(false);
  };

  const toggleSpeedMenu = () => {
    revealControls();
    setSpeedMenuOpen((open) => !open);
  };

  const launchFullscreenDemo = async () => {
    revealControls();
    const frame = frameRef.current;
    const video = videoRef.current as FullscreenVideoElement | null;
    if (!video) return;

    setLaunchPromptVisible(false);
    video.defaultMuted = false;
    video.muted = false;
    video.volume = 1;
    setIsMuted(false);

    try {
      const fullscreenPromise =
        !prefersNativeControls && frame?.requestFullscreen && !document.fullscreenElement
          ? frame.requestFullscreen()
          : Promise.resolve(video.webkitEnterFullscreen?.());
      const playPromise = video.play();

      await fullscreenPromise;
      await playPromise;
    } catch {
      setLaunchPromptVisible(true);
    }
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

      video.disablePictureInPicture = false;
      await video.requestPictureInPicture?.();
    } catch {
      video.disablePictureInPicture = true;
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
        className={`eisim-demo-frame group relative overflow-hidden bg-black eisim-demo-frame--${controlContrast}`}
        onPointerMove={revealControls}
        onPointerDown={revealControls}
        onPointerLeave={() => {
          if (isPlaying) {
            setControlsVisible(false);
            setSpeedMenuOpen(false);
            setControlsHovered(false);
          }
        }}
        onFocusCapture={revealControls}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          crossOrigin="anonymous"
          preload="metadata"
          playsInline
          autoPlay={prefersNativeControls}
          defaultMuted={prefersNativeControls}
          controls={prefersNativeControls}
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture={!prefersNativeControls && !isPictureInPicture}
          disableRemotePlayback
          onClick={prefersNativeControls ? undefined : togglePlayback}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onLoadedMetadata={syncDuration}
          onDurationChange={syncDuration}
          onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
          onRateChange={(event) => setPlaybackRate(event.currentTarget.playbackRate)}
          aria-label="EISim demo video"
        >
          <source src={src} type="video/mp4" />
        </video>

        {launchPromptVisible ? (
          <div className="absolute inset-0 z-10 grid place-items-center bg-black/35 px-6 text-white backdrop-blur-sm">
            <button
              ref={launchButtonRef}
              type="button"
              className="eisim-demo-launch"
              onClick={launchFullscreenDemo}
            >
              <Play size={24} fill="currentColor" />
              <span>Play EISim demo</span>
            </button>
          </div>
        ) : null}

        {!prefersNativeControls ? (
          <div
            className={`pointer-events-none absolute inset-0 text-white transition-opacity duration-300 ${
              controlsVisible ? 'opacity-100' : 'eisim-controls-hidden opacity-0'
            }`}
          >
            <div className="eisim-video-scrim eisim-video-scrim--top" />
            <div className="eisim-video-scrim eisim-video-scrim--bottom" />

            <div
              className="absolute left-3 top-3 flex items-center gap-2 sm:left-4 sm:top-4"
              onPointerEnter={keepControlsOpen}
              onPointerLeave={releaseControls}
            >
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

            <div
              className="absolute right-3 top-3 sm:right-4 sm:top-4"
              onPointerEnter={keepControlsOpen}
              onPointerLeave={releaseControls}
            >
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
                onPointerEnter={keepControlsOpen}
                onPointerLeave={releaseControls}
                aria-label="Rewind EISim demo 10 seconds"
              >
                <RotateCcw size={22} />
                <span className="absolute mt-0.5 text-[10px] font-bold leading-none">10</span>
              </button>

              <button
                type="button"
                className="eisim-video-button eisim-video-button--primary h-16 w-16 sm:h-20 sm:w-20"
                onClick={togglePlayback}
                onPointerEnter={keepControlsOpen}
                onPointerLeave={releaseControls}
                aria-label={isPlaying ? 'Pause EISim demo' : 'Play EISim demo'}
              >
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={34} fill="currentColor" />}
              </button>

              <button
                type="button"
                className="eisim-video-button h-12 w-12 sm:h-14 sm:w-14"
                onClick={() => skipBy(10)}
                onPointerEnter={keepControlsOpen}
                onPointerLeave={releaseControls}
                aria-label="Forward EISim demo 10 seconds"
              >
                <RotateCw size={22} />
                <span className="absolute mt-0.5 text-[10px] font-bold leading-none">10</span>
              </button>
            </div>

            <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
              <div
                className="eisim-video-control-dock flex min-h-12 items-center gap-3 rounded-full px-3 py-2 sm:gap-4 sm:px-4"
                onPointerEnter={keepControlsOpen}
                onPointerLeave={releaseControls}
              >
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

                <div className="relative shrink-0">
                  <button
                    type="button"
                    className={`eisim-video-button h-8 w-8 shrink-0 ${speedMenuOpen ? 'is-active' : ''}`}
                    onClick={toggleSpeedMenu}
                    aria-label="Playback speed options"
                    aria-expanded={speedMenuOpen}
                    aria-haspopup="menu"
                  >
                    <Ellipsis size={18} />
                  </button>

                  {speedMenuOpen ? (
                    <div className="eisim-playback-menu" role="menu" aria-label="Playback speed" onPointerEnter={keepControlsOpen} onPointerLeave={releaseControls}>
                      {PLAYBACK_RATES.map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          className={`eisim-playback-menu__item ${playbackRate === rate ? 'is-active' : ''}`}
                          onClick={() => changePlaybackRate(rate)}
                          role="menuitemradio"
                          aria-checked={playbackRate === rate}
                        >
                          {formatRate(rate)}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EisimDemoPlayer;
