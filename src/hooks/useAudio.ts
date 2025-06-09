import { useState, useRef, useEffect, useCallback } from "react";
import {
  Track,
  PlayerState,
  PlayerControls,
  VisualizerData,
  UseAudioReturn,
  RepeatMode,
} from "../types";

export const useAudio = (): UseAudioReturn => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isShuffled: false,
    repeatMode: "off",
    queue: [],
    history: [],
  });

  const [visualizerData, setVisualizerData] = useState<VisualizerData>({
    frequencyData: [],
  });

  // Inicializar contexto de audio para visualizador
  const initializeAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );

      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      analyserRef.current.fftSize = 256;
    } catch (error) {
      console.warn("Audio context initialization failed:", error);
    }
  }, []);

  // Actualizar datos del visualizador
  const updateVisualizerData = useCallback(() => {
    if (!analyserRef.current) return;

    const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
    const timeData = new Uint8Array(analyserRef.current.frequencyBinCount);

    analyserRef.current.getByteFrequencyData(frequencyData);
    analyserRef.current.getByteTimeDomainData(timeData);

    // Calcular métricas adicionales
    const frequencyArray = Array.from(frequencyData);
    const volume =
      frequencyArray.reduce((sum, value) => sum + value, 0) /
      frequencyArray.length;
    const peak = Math.max(...frequencyArray);
    const rms = Math.sqrt(
      frequencyArray.reduce((sum, value) => sum + value * value, 0) /
        frequencyArray.length
    );

    setVisualizerData((prev) => ({
      ...prev,
      frequencyData: Array.from(frequencyData),
      timeData: Array.from(timeData),
      volume: volume / 255,
      peak: peak / 255,
      rms: rms / 255,
    }));
  }, []);

  // Función para cargar un track
  const loadTrack = useCallback((track: Track) => {
    if (!audioRef.current) return;

    setPlayerState((prev) => ({
      ...prev,
      currentTrack: track,
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      isPaused: false,
      isLoading: true,
    }));

    audioRef.current.src = track.audioUrl;
    audioRef.current.load();
  }, []);

  // Controles del reproductor
  const play = useCallback(async () => {
    if (!audioRef.current || !playerState.currentTrack) return;

    try {
      initializeAudioContext();
      await audioRef.current.play();
      setPlayerState((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error playing audio:", error);
      setPlayerState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [playerState.currentTrack, initializeAudioContext]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setPlayerState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: true,
    }));
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = time;
    setPlayerState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    setPlayerState((prev) => ({
      ...prev,
      volume: clampedVolume,
      isMuted: clampedVolume === 0,
    }));
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    setPlayerState((prev) => {
      const newMuted = !prev.isMuted;
      audioRef.current!.volume = newMuted ? 0 : prev.volume;
      return { ...prev, isMuted: newMuted };
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isShuffled: !prev.isShuffled }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlayerState((prev) => {
      const modes: RepeatMode[] = ["off", "one", "all"];
      const currentIndex = modes.indexOf(prev.repeatMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      return { ...prev, repeatMode: modes[nextIndex] };
    });
  }, []);

  const next = useCallback(() => {
    setPlayerState((prev) => {
      if (prev.queue.length === 0) return prev;

      const currentIndex = prev.queue.findIndex(
        (track) => track.id === prev.currentTrack?.id
      );
      let nextIndex = currentIndex + 1;

      if (prev.isShuffled) {
        nextIndex = Math.floor(Math.random() * prev.queue.length);
      } else if (nextIndex >= prev.queue.length) {
        nextIndex = prev.repeatMode === "all" ? 0 : currentIndex;
      }

      const nextTrack = prev.queue[nextIndex];
      if (nextTrack && nextTrack.id !== prev.currentTrack?.id) {
        loadTrack(nextTrack);
        return {
          ...prev,
          currentTrack: nextTrack,
          history: prev.currentTrack
            ? [...prev.history, prev.currentTrack]
            : prev.history,
        };
      }

      return prev;
    });
  }, [loadTrack]);

  const previous = useCallback(() => {
    setPlayerState((prev) => {
      if (prev.currentTime > 3 && audioRef.current) {
        // Si estamos a más de 3 segundos, reiniciar la canción actual
        audioRef.current.currentTime = 0;
        return { ...prev, currentTime: 0 };
      }

      if (prev.history.length === 0) return prev;

      const previousTrack = prev.history[prev.history.length - 1];
      const newHistory = prev.history.slice(0, -1);

      loadTrack(previousTrack);
      return {
        ...prev,
        currentTrack: previousTrack,
        history: newHistory,
      };
    });
  }, [loadTrack]);

  const addToQueue = useCallback((track: Track) => {
    setPlayerState((prev) => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setPlayerState((prev) => ({
      ...prev,
      queue: prev.queue.filter((track) => track.id !== trackId),
    }));
  }, []);

  const controls: PlayerControls = {
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    removeFromQueue,
  };

  // Event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setPlayerState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
        isPaused: audio.paused && !prev.isLoading,
      }));
    };

    const handleDurationChange = () => {
      setPlayerState((prev) => ({ ...prev, duration: audio.duration || 0 }));
    };

    const handleEnded = () => {
      setPlayerState((prev) => {
        if (prev.repeatMode === "one") {
          audio.currentTime = 0;
          audio.play();
          return prev;
        } else {
          next();
          return { ...prev, isPlaying: false, isPaused: true };
        }
      });
    };

    const handleCanPlayThrough = () => {
      setPlayerState((prev) => ({
        ...prev,
        duration: audio.duration || 0,
        isLoading: false,
      }));
    };

    const handleLoadStart = () => {
      setPlayerState((prev) => ({ ...prev, isLoading: true }));
    };

    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setPlayerState((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: true,
        isLoading: false,
      }));
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("error", handleError);
    };
  }, [next]);

  // Actualizar visualizador cuando esté reproduciendo
  useEffect(() => {
    let animationFrame: number;

    if (playerState.isPlaying && analyserRef.current) {
      const animate = () => {
        updateVisualizerData();
        animationFrame = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [playerState.isPlaying, updateVisualizerData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    audioRef: audioRef as React.RefObject<HTMLAudioElement>,
    playerState,
    controls,
    visualizerData,
  };
};
