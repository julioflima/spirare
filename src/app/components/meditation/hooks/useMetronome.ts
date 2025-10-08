'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const MIN_METRONOME_PERIOD_MS = 600;
export const MAX_METRONOME_PERIOD_MS = 1800;

interface MetronomeControls {
  periodMs: number;
  setPeriodMs: (value: number) => void;
  isPlaying: boolean;
  toggle: () => void;
  start: () => void;
  stop: () => void;
  beatActive: boolean;
}

const MIN_BEEP_FREQUENCY = 520;
const MAX_BEEP_FREQUENCY = 880;

export function useMetronome(initialPeriod: number = 1000): MetronomeControls {
  const [periodMs, internalSetPeriod] = useState(initialPeriod);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatActive, setBeatActive] = useState(false);

  const contextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const periodRef = useRef(initialPeriod);

  const ensureAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!contextRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      contextRef.current = new AudioContextClass();
    }

    if (contextRef.current.state === 'suspended') {
      void contextRef.current.resume();
    }
  }, []);

  const computeFrequency = useCallback((period: number) => {
    const normalized = (period - MIN_METRONOME_PERIOD_MS) / (MAX_METRONOME_PERIOD_MS - MIN_METRONOME_PERIOD_MS);
    const inverted = 1 - Math.min(Math.max(normalized, 0), 1);
    return MIN_BEEP_FREQUENCY + inverted * (MAX_BEEP_FREQUENCY - MIN_BEEP_FREQUENCY);
  }, []);

  const tick = useCallback(() => {
    setBeatActive((previous) => !previous);

    const ctx = contextRef.current;
    if (!ctx) {
      return;
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'triangle';
    const frequency = computeFrequency(periodRef.current);
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.015, now + 0.16);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.18);
  }, [computeFrequency]);

  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    ensureAudioContext();
    clearCurrentInterval();
    setIsPlaying(true);
    periodRef.current = periodMs;
    tick();
    intervalRef.current = setInterval(tick, periodRef.current);
  }, [clearCurrentInterval, ensureAudioContext, periodMs, tick]);

  const stop = useCallback(() => {
    clearCurrentInterval();
    setIsPlaying(false);
  }, [clearCurrentInterval]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  useEffect(() => {
    periodRef.current = periodMs;
    if (isPlaying) {
      ensureAudioContext();
      clearCurrentInterval();
      intervalRef.current = setInterval(tick, periodMs);
    }
    return stop;
  }, [clearCurrentInterval, ensureAudioContext, isPlaying, periodMs, stop, tick]);

  useEffect(() => {
    return () => {
      clearCurrentInterval();
      contextRef.current?.close().catch(() => undefined);
    };
  }, [clearCurrentInterval]);

  const setPeriodMs = useCallback((value: number) => {
    const clamped = Math.min(MAX_METRONOME_PERIOD_MS, Math.max(MIN_METRONOME_PERIOD_MS, value));
    internalSetPeriod(clamped);
  }, []);

  return { periodMs, setPeriodMs, isPlaying, toggle, start, stop, beatActive };
}
