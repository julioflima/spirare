'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import { useMemo, type FC } from 'react';

interface MetronomeSliderProps {
    periodMs: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    beatActive: boolean;
}

const clamp = (value: number, lower: number, upper: number) => Math.min(upper, Math.max(lower, value));

export const MetronomeSlider: FC<MetronomeSliderProps> = ({ periodMs, min, max, onChange, beatActive }) => {
    const bpmRange = useMemo(() => {
        const maxBpm = Math.round(60000 / Math.max(min, 1));
        const minBpm = Math.round(60000 / Math.max(max, 1));
        return {
            minBpm,
            maxBpm,
        };
    }, [min, max]);

    const bpmValue = useMemo(() => {
        const derived = Math.round(60000 / Math.max(periodMs, 1));
        return clamp(derived, bpmRange.minBpm, bpmRange.maxBpm);
    }, [periodMs, bpmRange.minBpm, bpmRange.maxBpm]);

    const handleValueChange = (values: number[]) => {
        const bpm = clamp(Math.round(values[0] ?? bpmValue), bpmRange.minBpm, bpmRange.maxBpm);
        const nextPeriod = clamp(Math.round(60000 / bpm), min, max);
        onChange(nextPeriod);
    };

    const haloClasses = beatActive ? 'opacity-90 scale-105' : 'opacity-70 scale-100';

    return (
        <div className="w-full max-w-sm space-y-4">
            <div className="relative h-24 rounded-3xl border border-white/45 bg-white/40 px-6 py-5 shadow-[0_24px_65px_-42px_rgba(34,197,94,0.55)] backdrop-blur-xl">
                <div
                    className={`pointer-events-none absolute left-1/2 top-4 h-20 w-20 -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-200/40 via-lime-200/30 to-amber-200/25 blur-xl transition-all duration-300 ${haloClasses}`}
                    aria-hidden="true"
                />
                <div className="flex items-baseline justify-between text-emerald-900">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700/75">Ritmo</p>
                        <p className="mt-1 text-3xl font-semibold leading-none">{bpmValue}</p>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-700/60">BPM</p>
                    </div>
                    <div className="text-right text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-700/60">
                        <p>{bpmRange.minBpm} bpm</p>
                        <p className="mt-1">{bpmRange.maxBpm} bpm</p>
                    </div>
                </div>
                <SliderPrimitive.Root
                    className="relative mt-6 flex h-5 w-full touch-none select-none items-center"
                    orientation="horizontal"
                    value={[bpmValue]}
                    min={bpmRange.minBpm}
                    max={bpmRange.maxBpm}
                    step={1}
                    onValueChange={handleValueChange}
                    aria-label="Ajustar ritmo do metrônomo"
                >
                    <SliderPrimitive.Track className="relative h-1.5 w-full overflow-hidden rounded-full bg-emerald-100/60">
                        <SliderPrimitive.Range className="absolute h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600" />
                    </SliderPrimitive.Track>
                    <SliderPrimitive.Thumb className="relative flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-[0_8px_18px_-8px_rgba(16,185,129,0.55)] outline-none transition-transform duration-150 hover:scale-105 focus-visible:ring-2 focus-visible:ring-emerald-400/80">
                        <span className="absolute h-8 w-[2px] rounded-full bg-emerald-500" aria-hidden="true" />
                    </SliderPrimitive.Thumb>
                </SliderPrimitive.Root>
            </div>
        </div>
    );
};
