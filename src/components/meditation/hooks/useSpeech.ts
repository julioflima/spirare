"use client";

import { useCallback, useRef, useState } from "react";

interface QueueSpeechOptions {
  replace?: boolean;
}

interface SpeechControls {
  speak: (text: string, options?: QueueSpeechOptions) => Promise<void>;
  speakSequence: (
    texts: string[],
    options?: QueueSpeechOptions
  ) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isGenerating: boolean;
  error: Error | null;
}

interface IUseSpeech {
  songBuffer: ArrayBuffer;
}

export function useSpeech({ songBuffer }: IUseSpeech): SpeechControls {
  const songElementRef = useRef<HTMLAudioElement | null>(null);
  const songUrlRef = useRef<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const sequenceRef = useRef<Promise<void>>(Promise.resolve());
  const cancelTokenRef = useRef(0);
  const rejectPlaybackRef = useRef<((reason: Error) => void) | null>(null);

  const cleanupSong = useCallback(() => {
    if (songElementRef.current) {
      songElementRef.current.pause();
      songElementRef.current.src = "";
      songElementRef.current = null;
    }
    if (songUrlRef.current) {
      URL.revokeObjectURL(songUrlRef.current);
      songUrlRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    cancelTokenRef.current += 1;
    if (rejectPlaybackRef.current) {
      rejectPlaybackRef.current(new Error("Playback interrompido."));
      rejectPlaybackRef.current = null;
    }
    cleanupSong();
    setIsGenerating(false);
  }, [cleanupSong]);

  const playText = useCallback(
    async (rawText: string, token: number) => {
      const normalized = rawText.trim();
      if (!normalized) {
        return;
      }

      setIsGenerating(true);
      setError(null);

      let song: HTMLAudioElement | null = null;
      try {
        if (cancelTokenRef.current !== token) {
          setIsGenerating(false);
          return;
        }

        const blob = new Blob([songBuffer], { type: "song/mpeg" });
        const url = URL.createObjectURL(blob);
        songUrlRef.current = url;

        song = new Audio(url);
        songElementRef.current = song;
        song.volume = 1;

        await new Promise<void>((resolve, reject) => {
          const handleEnded = () => {
            song?.removeEventListener("ended", handleEnded);
            song?.removeEventListener("error", handleError);
            rejectPlaybackRef.current = null;
            cleanupSong();
            resolve();
          };

          const handleError = () => {
            song?.removeEventListener("ended", handleEnded);
            song?.removeEventListener("error", handleError);
            rejectPlaybackRef.current = null;
            const playbackError = new Error(
              "Erro ao reproduzir áudio da meditação."
            );
            cleanupSong();
            reject(playbackError);
          };

          rejectPlaybackRef.current = (reason) => {
            song?.removeEventListener("ended", handleEnded);
            song?.removeEventListener("error", handleError);
            cleanupSong();
            reject(reason);
          };

          song?.addEventListener("ended", handleEnded);
          song?.addEventListener("error", handleError);

          song
            ?.play()
            .then(() => {
              setIsGenerating(false);
            })
            .catch((playbackStartError) => {
              song?.removeEventListener("ended", handleEnded);
              song?.removeEventListener("error", handleError);
              rejectPlaybackRef.current = null;
              cleanupSong();
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
          setError(
            playError instanceof Error
              ? playError
              : new Error("Erro desconhecido ao gerar áudio.")
          );
        }
        setIsGenerating(false);
        throw playError;
      }
    },
    [songBuffer, cleanupSong]
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
            if (
              playError instanceof Error &&
              playError.message === "Playback interrompido."
            ) {
              break;
            }
            if (cancelTokenRef.current === executionToken) {
              setError(
                playError instanceof Error
                  ? playError
                  : new Error("Erro desconhecido ao gerar áudio.")
              );
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
    songElementRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    songElementRef.current?.play().catch(() => undefined);
  }, []);

  return {
    speak: (text, options) =>
      queueSpeechInternal(text, { replace: options?.replace ?? true }),
    speakSequence: (texts, options) => queueSpeechInternal(texts, options),
    stop,
    pause,
    resume,
    isGenerating,
    error,
  };
}
