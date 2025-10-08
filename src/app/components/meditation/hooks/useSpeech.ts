"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

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
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

  const fetchSpeech = useCallback(
    async (rawText: string) => {
      const normalizedText = rawText.trim();
      if (!normalizedText) {
        throw new Error("Texto vazio para síntese de voz.");
      }

      return queryClient.ensureQueryData({
        queryKey: ["speech", normalizedText],
        queryFn: async () => {
          const response = await fetch("/api/speech", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: normalizedText }),
          });

          if (!response.ok) {
            throw new Error("Falha ao gerar áudio da meditação.");
          }

          return response.arrayBuffer();
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        retryDelay: (attempt) => Math.min(1500 * (attempt + 1), 4000),
      });
    },
    [queryClient]
  );

  const speak = useCallback(
    async (text: string) => {
      const sanitizedText = text.trim();
      if (!sanitizedText) return;

      stop();
      setIsGenerating(true);
      setError(null);

      try {
        const audioBuffer = await fetchSpeech(sanitizedText);
        const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;

        const audio = new Audio(url);
        audioElementRef.current = audio;
        await audio.play();
      } catch (error) {
        const nextError =
          error instanceof Error
            ? error
            : new Error("Erro desconhecido ao gerar áudio.");
        console.error("Erro ao reproduzir áudio da meditação:", nextError);
        setError(nextError);
      } finally {
        setIsGenerating(false);
      }
    },
    [fetchSpeech, stop]
  );

  const pause = useCallback(() => {
    audioElementRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    audioElementRef.current?.play().catch(() => undefined);
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isGenerating,
    error,
  };
}
