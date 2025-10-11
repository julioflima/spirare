'use client';

import { FC } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BreathVisualizer } from './BreathVisualizer';
import { MetronomeSlider } from './MetronomeSlider';

interface TimerPanelProps {
    isFinalStage: boolean;
    timeRemaining: number;
    progressPercent: number;
    beatActive: boolean;
    metronomePeriodMs: number;
    ledActive: boolean;
    onMetronomePeriodChange: (value: number) => void;
    metronomeMin: number;
    metronomeMax: number;
    isSessionActive: boolean;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const TimerPanel: FC<TimerPanelProps> = ({
    isFinalStage,
    timeRemaining,
    progressPercent,
    beatActive,
    metronomePeriodMs,
    onMetronomePeriodChange,
    metronomeMin,
    metronomeMax,
    isSessionActive,
    ledActive,
}) => {
    return (
        <section className="relative mb-8 grid gap-8 rounded-[32px] border border-white/30 bg-white/25 p-8 shadow-[0_30px_70px_-45px_rgba(132,204,22,0.45)] backdrop-blur-2xl lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="flex flex-col items-center justify-center gap-6">
                {!isFinalStage ? (
                    <div className="flex flex-col items-center gap-6">
                        <div className="h-32 w-32">
                            <CircularProgressbar
                                value={progressPercent}
                                text={`${Math.round(progressPercent)}%`}
                                strokeWidth={8}
                                styles={buildStyles({
                                    textSize: '16px',
                                    pathColor: progressPercent < 50 ? '#34d399' : progressPercent < 80 ? '#fbbf24' : '#f59e0b',
                                    textColor: '#065f46',
                                    trailColor: 'rgba(255,255,255,0.4)',
                                    pathTransitionDuration: 0.4,
                                })}
                            />
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-mono font-semibold text-emerald-900">{formatTime(timeRemaining)}</p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.38em] text-emerald-800/70">Tempo da etapa</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <p className="text-sm uppercase tracking-[0.4em] text-emerald-700/70">Respire</p>
                        <p className="text-2xl font-semibold text-emerald-500">Metrônomo Ativo</p>
                        <p className="max-w-xs text-sm text-emerald-700/80">
                            Mantenha a atenção no espaço entre as batidas e permita que o corpo siga o ritmo.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-6">
                <BreathVisualizer isActive={isSessionActive} />
                <div className="flex flex-col items-center justify-center gap-6">
                    <MetronomeSlider
                        periodMs={metronomePeriodMs}
                        min={metronomeMin}
                        max={metronomeMax}
                        onChange={onMetronomePeriodChange}
                        beatActive={beatActive}
                    />
                </div>
            </div>
        </section>
    );
};
