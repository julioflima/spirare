"use client";

import type { Song } from "@/types";
import { useCallback, useEffect, useRef } from "react";

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

const DEFAULT_FADE_IN = 1500;
const DEFAULT_FADE_OUT = 1500;
const DEFAULT_VOLUME = 0.5;

export function useStageMusic() {
  const songRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);

  const cancelFade = useCallback(() => {
    if (fadeFrameRef.current) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, []);

  const fadeTo = useCallback(
    (targetVolume: number, duration: number) => {
      const song = songRef.current;
      if (!song) {
        return Promise.resolve();
      }

      cancelFade();

      if (duration <= 0) {
        song.volume = clampVolume(targetVolume);
        return Promise.resolve();
      }

      const startVolume = song.volume;
      const volumeDelta = clampVolume(targetVolume) - startVolume;
      if (Math.abs(volumeDelta) < 0.001) {
        song.volume = clampVolume(targetVolume);
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        const startTime = performance.now();

        const step = (now: number) => {
          if (!songRef.current) {
            resolve();
            return;
          }

          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          songRef.current.volume = clampVolume(
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

      if (!songRef.current) {
        return;
      }

      try {
        await fadeTo(0, fadeOutMs ?? DEFAULT_FADE_OUT);
      } finally {
        songRef.current.pause();
        songRef.current.src = "";
        songRef.current = null;
      }
    },
    [cancelFade, fadeTo]
  );

  const transitionToTrack = useCallback(
    async (track: Song | null) => {
      if (!track) {
        await stopCurrentTrack();
        return;
      }

      const { src, fadeInMs, fadeOutMs, volume } = track;

      if (songRef.current && songRef.current.src === src) {
        return;
      }

      await stopCurrentTrack(fadeOutMs);

      const song = new Audio(src);
      song.crossOrigin = "anonymous";
      song.loop = true;
      song.volume = 0;

      songRef.current = song;

      try {
        await song.play();
      } catch (error) {
        console.error("Não foi possível reproduzir a trilha da etapa.", error);
        songRef.current = null;
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
      songRef.current?.pause();
    },
    resumeTrack: () => {
      songRef.current?.play().catch(() => undefined);
    },
  };
}
