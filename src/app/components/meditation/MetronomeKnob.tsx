'use client';

import { type FC } from 'react';

interface MetronomeKnobProps {
    periodMs: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    beatActive: boolean;
}

/**
 * Legacy wrapper retained for compatibility with older imports. The new metronome
 * UI is handled by `MetronomeSlider`. This stub simply invokes the change handler
 * with a clamped value and renders nothing.
 */
export const MetronomeKnob: FC<MetronomeKnobProps> = ({ periodMs, min, max, onChange }) => {
    const clamped = Math.min(Math.max(periodMs, min), max);
    if (clamped !== periodMs) {
        onChange(clamped);
    }

    return null;
};
