'use client';

import { FC, useMemo } from 'react';
import { useAudioWaveform } from './hooks/useAudioWaveform';

interface BreathVisualizerProps {
  isActive: boolean;
}

export const BreathVisualizer: FC<BreathVisualizerProps> = ({ isActive }) => {
  const samples = useAudioWaveform({ isActive, bars: 24 });

  const bars = useMemo(() => {
    return samples.map((sample) => {
      const level = Number.isFinite(sample) ? Math.min(Math.max(sample, 0), 1) : 0;
      return 12 + level * 104;
    });
  }, [samples]);

  return (
    <div className="relative h-40 w-full overflow-hidden rounded-[26px] border border-white/35 bg-gradient-to-br from-emerald-50/65 via-white/55 to-amber-50/60 px-6 py-7 text-emerald-900 shadow-[0_28px_60px_-38px_rgba(52,211,153,0.48)] backdrop-blur-2xl">
      <span className="pointer-events-none absolute -right-16 -top-20 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-200/40 via-lime-200/35 to-amber-200/35 blur-3xl" aria-hidden="true" />
      <div className="relative flex h-full items-center justify-between gap-1">
        {bars.map((height, index) => (
          <span
            key={`breath-bar-${index}`}
            className="flex-1 rounded-full bg-gradient-to-tr from-emerald-300/80 via-lime-200/85 to-amber-200/75 shadow-[0_8px_18px_-12px_rgba(56,189,248,0.35)] transition-[height] duration-150 ease-out"
            style={{ height }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center gap-6 text-[10px] font-semibold uppercase tracking-[0.42em] text-emerald-800/60">
        <span>Respire</span>
        <span>Observe</span>
        <span>Integre</span>
      </div>
    </div>
  );
};
