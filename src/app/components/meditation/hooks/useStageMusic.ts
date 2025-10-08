"use client";

import { useCallback, useEffect, useRef } from "react";
import type { MeditationStageTrack } from "@/types/meditation";

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

const DEFAULT_FADE_IN = 1500;
const DEFAULT_FADE_OUT = 1500;
const DEFAULT_VOLUME = 0.5;

export function useStageMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);

  const cancelFade = useCallback(() => {
    if (fadeFrameRef.current) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (targetVolume: number, duration: number) => {
      const audio = audioRef.current;
      if (!audio) {
        return Promise.resolve();
      }

      cancelFade();

      if (duration <= 0) {
        audio.volume = clampVolume(targetVolume);
        return Promise.resolve();
      }

      const startVolume = audio.volume;
      const volumeDelta = clampVolume(targetVolume) - startVolume;
      if (Math.abs(volumeDelta) < 0.001) {
        audio.volume = clampVolume(targetVolume);
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const startTime = performance.now();

        const step = (now: number) => {
          if (!audioRef.current) {
            resolve();
            return;
          }

          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          audioRef.current.volume = clampVolume(
            startVolume + volumeDelta * progress
          );

          if (progress < 1) {
            fadeFrameRef.current = requestAnimationFrame(step);
          } else {
            fadeFrameRef.current = null;
            resolve();
          }
        };

        fadeFrameRef.current = requestAnimationFrame(step);
      });
    },
    [cancelFade]
  );

  const stopCurrentTrack = useCallback(
    async (fadeOutMs?: number) => {
      cancelFade();

      if (!audioRef.current) {
        return;
      }

      try {
        await fadeTo(0, fadeOutMs ?? DEFAULT_FADE_OUT);
      } finally {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    },
    [cancelFade, fadeTo]
  );

  const transitionToTrack = useCallback(
    async (track: MeditationStageTrack | null) => {
      if (!track) {
        await stopCurrentTrack();
        return;
      }

      const { src, fadeInMs, fadeOutMs, volume } = track;

      if (audioRef.current && audioRef.current.src === src) {
        return;
      }

      await stopCurrentTrack(fadeOutMs);

      const audio = new Audio(src);
      audio.crossOrigin = "anonymous";
      audio.loop = true;
      audio.volume = 0;

      audioRef.current = audio;

      try {
        await audio.play();
      } catch (error) {
        console.error("Não foi possível reproduzir a trilha da etapa.", error);
        audioRef.current = null;
        return;
      }

      await fadeTo(volume ?? DEFAULT_VOLUME, fadeInMs ?? DEFAULT_FADE_IN);
    },
    [fadeTo, stopCurrentTrack]
  );

  useEffect(() => {
    return () => {
      void stopCurrentTrack(0);
    };
  }, [stopCurrentTrack]);

  return {
    playTrack: transitionToTrack,
    stopTrack: stopCurrentTrack,
    pauseTrack: () => {
      audioRef.current?.pause();
    },
    resumeTrack: () => {
      audioRef.current?.play().catch(() => undefined);
    },
  };
}
