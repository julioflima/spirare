'use client';

import { KnobHeadless } from 'react-knob-headless';
import { useCallback, useMemo, type CSSProperties, type FC } from 'react';

interface MetronomeKnobProps {
    periodMs: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    beatActive: boolean;
}

export const MetronomeKnob: FC<MetronomeKnobProps> = ({ periodMs, min, max, onChange, beatActive }) => {
    const clamp = useCallback(
        (value: number) => {
            return Math.min(Math.max(value, min), max);
        },
        [min, max],
    );

    const bpm = useMemo(() => Math.round(60000 / Math.max(periodMs, 1)), [periodMs]);

    const normalized = useMemo(() => {
        if (max === min) return 0.5;
        return (clamp(periodMs) - min) / (max - min);
    }, [clamp, max, min, periodMs]);

    const pointerAngle = useMemo(() => {
        const minAngle = -120;
        const maxAngle = 120;
        return minAngle + normalized * (maxAngle - minAngle);
    }, [normalized]);

    const pointerStyle = useMemo(
        () => ({
            transform: `translate(-50%, -100%) rotate(${pointerAngle}deg)`,
        }) satisfies CSSProperties,
        [pointerAngle],
    );

    const haloClasses = beatActive ? 'scale-105 opacity-100' : 'scale-100 opacity-70';

    const ticks = useMemo(() => {
        const divisions = 8;
        return Array.from({ length: divisions }, (_, index) => index / (divisions - 1));
    }, []);

    const handleValueRawChange = useCallback(
        (valueRaw: number) => {
            const next = Math.round(clamp(valueRaw));
            onChange(next);
        },
        [clamp, onChange],
    );

    return (
        <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative flex h-44 w-44 items-center justify-center">
                <div
                    className={`pointer-events-none absolute h-36 w-36 rounded-full bg-gradient-to-br from-emerald-200/40 via-lime-200/28 to-amber-200/20 blur-xl transition-all duration-300 ${haloClasses}`}
                    aria-hidden="true"
                />

                <KnobHeadless
                    aria-label="Ajustar ritmo do metrônomo"
                    valueRaw={periodMs}
                    valueMin={min}
                    valueMax={max}
                    dragSensitivity={0.006}
                    orientation="horizontal"
                    axis="x"
                    includeIntoTabOrder
                    valueRawRoundFn={(valueRaw) => Math.round(clamp(valueRaw))}
                    valueRawDisplayFn={(valueRaw) => `${Math.round(60000 / Math.max(valueRaw, 1))} BPM`}
                    onValueRawChange={handleValueRawChange}
                    className="relative flex h-40 w-40 select-none items-center justify-center rounded-full border border-white/45 bg-gradient-to-br from-white/75 via-emerald-100/30 to-amber-100/25 shadow-[0_30px_70px_-45px_rgba(132,204,22,0.5)] backdrop-blur-xl"
                />

                {ticks.map((value) => {
                    const angle = -120 + value * 240;
                    return (
                        <span
                            key={value}
                            className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-[2px] -translate-x-1/2 -translate-y-full rounded-full bg-white/45"
                            style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
                            aria-hidden="true"
                        />
                    );
                })}

                <div
                    className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-[6px] -translate-x-1/2 -translate-y-full rounded-full bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 shadow-[0_12px_24px_-16px_rgba(16,185,129,0.75)]"
                    style={pointerStyle}
                    aria-hidden="true"
                />

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_0_14px_rgba(132,204,22,0.65)]" aria-hidden="true" />
            </div>
            <div className="rounded-full border border-white/45 bg-white/35 px-5 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-800/75">
                Ritmo
            </div>
            <div className="flex items-baseline gap-1 text-emerald-900">
                <span className="text-3xl font-semibold">{bpm}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-800/70">BPM</span>
            </div>
        </div>
    );
};
