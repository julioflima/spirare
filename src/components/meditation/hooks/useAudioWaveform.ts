"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface UseAudioWaveformOptions {
  isActive: boolean;
  bars?: number;
  smoothing?: number;
}

export function useAudioWaveform({
  isActive,
  bars = 24,
  smoothing = 0.6,
}: UseAudioWaveformOptions) {
  const [levels, setLevels] = useState<number[]>(() => new Array(bars).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const rafRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (
      !isActive ||
      typeof window === "undefined" ||
      !navigator?.mediaDevices?.getUserMedia
    ) {
      setLevels(new Array(bars).fill(0));
      return;
    }

    let cancelled = false;

    const setup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const context = new AudioContext();
        const analyser = context.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = smoothing;

        const source = context.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(
          bufferLength
        ) as Uint8Array<ArrayBuffer>;

        audioContextRef.current = context;
        analyserRef.current = analyser;
        mediaStreamRef.current = stream;
        sourceRef.current = source;
        dataArrayRef.current = dataArray;

        const sample = () => {
          if (!analyserRef.current || !dataArrayRef.current) {
            return;
          }

          analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

          const sliceSize = Math.max(
            1,
            Math.floor(dataArrayRef.current.length / bars)
          );

          const amplitudes: number[] = [];
          for (let barIndex = 0; barIndex < bars; barIndex += 1) {
            let sum = 0;
            for (let i = 0; i < sliceSize; i += 1) {
              const dataIndex = barIndex * sliceSize + i;
              if (dataIndex >= dataArrayRef.current.length) {
                break;
              }
              const value = dataArrayRef.current[dataIndex] ?? 128;
              sum += Math.abs(value - 128);
            }
            const average = sum / sliceSize;
            amplitudes.push(average / 128);
          }

          setLevels((previous) =>
            previous.map((value, index) => {
              const next = amplitudes[index] ?? 0;
              return value * 0.35 + next * 0.65;
            })
          );

          rafRef.current = requestAnimationFrame(sample);
        };

        sample();
      } catch (error) {
        console.error(
          "Não foi possível acessar o microfone para o gráfico de respiração.",
          error
        );
        setLevels(new Array(bars).fill(0));
      }
    };

    void setup();

    return () => {
      cancelled = true;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => undefined);
        audioContextRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      dataArrayRef.current = null;
    };
  }, [bars, isActive, smoothing]);

  return useMemo(() => levels, [levels]);
}
