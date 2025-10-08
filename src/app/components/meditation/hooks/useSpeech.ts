'use client';

import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useRef } from 'react';

interface SpeechControls {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isGenerating: boolean;
  error: Error | null;
}

export function useSpeech(): SpeechControls {
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  const fetchSpeech = useMutation({
    mutationFn: async (text: string) => {
      if (!text) {
        throw new Error('Texto vazio para síntese de voz.');
      }

      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar áudio da meditação.');
      }

      return response.arrayBuffer();
    },
    retry: 2,
    retryDelay: (attempt) => Math.min(1500 * (attempt + 1), 4000),
  });

  const speak = useCallback(
    async (text: string) => {
      if (!text) return;

      stop();

      try {
        const audioBuffer = await fetchSpeech.mutateAsync(text);
        const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;

        const audio = new Audio(url);
        audioElementRef.current = audio;
        await audio.play();
      } catch (error) {
        console.error('Erro ao reproduzir áudio da meditação:', error);
      }
    },
    [fetchSpeech, stop],
  );

  const pause = useCallback(() => {
    audioElementRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    audioElementRef.current?.play().catch(() => undefined);
  }, []);

  const error = useMemo(() => {
    if (!fetchSpeech.error) return null;
    return fetchSpeech.error instanceof Error
      ? fetchSpeech.error
      : new Error('Erro desconhecido ao gerar áudio.');
  }, [fetchSpeech.error]);

  return {
    speak,
    stop,
    pause,
    resume,
    isGenerating: fetchSpeech.isPending,
    error,
  };
}
