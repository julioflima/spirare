"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

interface QueueSpeechOptions {
  replace?: boolean;
}

interface SpeechControls {
  speak: (text: string, options?: QueueSpeechOptions) => Promise<void>;
  speakSequence: (texts: string[], options?: QueueSpeechOptions) => Promise<void>;
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
  const sequenceRef = useRef<Promise<void>>(Promise.resolve());
  const cancelTokenRef = useRef(0);
  const rejectPlaybackRef = useRef<((reason: Error) => void) | null>(null);

  const cleanupAudio = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = "";
      audioElementRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    cancelTokenRef.current += 1;
    if (rejectPlaybackRef.current) {
      rejectPlaybackRef.current(new Error("Playback interrompido."));
      rejectPlaybackRef.current = null;
    }
    cleanupAudio();
    setIsGenerating(false);
  }, [cleanupAudio]);

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

  const playText = useCallback(
    async (rawText: string, token: number) => {
      const normalized = rawText.trim();
      if (!normalized) {
        return;
      }

      setIsGenerating(true);
      setError(null);

      let audio: HTMLAudioElement | null = null;
      try {
        const audioBuffer = await fetchSpeech(normalized);
        if (cancelTokenRef.current !== token) {
          setIsGenerating(false);
          return;
        }

        const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;

        audio = new Audio(url);
        audioElementRef.current = audio;
        audio.volume = 1;

        await new Promise<void>((resolve, reject) => {
          const handleEnded = () => {
            audio?.removeEventListener("ended", handleEnded);
            audio?.removeEventListener("error", handleError);
            rejectPlaybackRef.current = null;
            cleanupAudio();
            resolve();
          };

          const handleError = () => {
            audio?.removeEventListener("ended", handleEnded);
            audio?.removeEventListener("error", handleError);
            rejectPlaybackRef.current = null;
            const playbackError = new Error("Erro ao reproduzir áudio da meditação.");
            cleanupAudio();
            reject(playbackError);
          };

          rejectPlaybackRef.current = (reason) => {
            audio?.removeEventListener("ended", handleEnded);
            audio?.removeEventListener("error", handleError);
            cleanupAudio();
            reject(reason);
          };

          audio?.addEventListener("ended", handleEnded);
          audio?.addEventListener("error", handleError);

          audio
            ?.play()
            .then(() => {
              setIsGenerating(false);
            })
            .catch((playbackStartError) => {
              audio?.removeEventListener("ended", handleEnded);
              audio?.removeEventListener("error", handleError);
              rejectPlaybackRef.current = null;
              cleanupAudio();
              const normalizedError =
                playbackStartError instanceof Error
                  ? playbackStartError
                  : new Error("Não foi possível iniciar o áudio.");
              setError(normalizedError);
              reject(normalizedError);
            });
        });
      } catch (playError) {
        if (cancelTokenRef.current === token) {
          setError(playError instanceof Error ? playError : new Error("Erro desconhecido ao gerar áudio."));
        }
        setIsGenerating(false);
        throw playError;
      }
    },
    [cleanupAudio, fetchSpeech]
  );

  const queueSpeechInternal = useCallback(
    (input: string | string[], options: QueueSpeechOptions = {}) => {
      const normalizedArray = (Array.isArray(input) ? input : [input])
        .map((value) => value.trim())
        .filter((value) => value.length > 0);

      if (!normalizedArray.length) {
        return Promise.resolve();
      }

      const { replace = false } = options;

      const enqueue = async () => {
        if (replace) {
          stop();
        }

        const executionToken = cancelTokenRef.current;

        for (const textItem of normalizedArray) {
          if (cancelTokenRef.current !== executionToken) {
            break;
          }

          try {
            await playText(textItem, executionToken);
          } catch (playError) {
            if (playError instanceof Error && playError.message === "Playback interrompido.") {
              break;
            }
            if (cancelTokenRef.current === executionToken) {
              setError(playError instanceof Error ? playError : new Error("Erro desconhecido ao gerar áudio."));
            }
            break;
          }
        }
      };

      sequenceRef.current = sequenceRef.current.then(enqueue, enqueue);
      return sequenceRef.current;
    },
    [playText, stop]
  );

  const pause = useCallback(() => {
    audioElementRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    audioElementRef.current?.play().catch(() => undefined);
  }, []);

  return {
    speak: (text, options) => queueSpeechInternal(text, { replace: options?.replace ?? true }),
    speakSequence: (texts, options) => queueSpeechInternal(texts, options),
    stop,
    pause,
    resume,
    isGenerating,
    error,
  };
}
