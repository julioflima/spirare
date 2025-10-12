'use client';

import { FC } from 'react';
import { ChevronsRight } from 'lucide-react';

import { Controls } from './Controls';
import { StepContent } from './StepContent';
import { Loading } from '../Loading';

export interface MeditationEntrySummary {
    order: number;
    path: string;
    stage: string;
    practice: string;
    text: string;
}

interface MeditationGeneratorProps {
    isPaused: boolean;
    isFinalStage: boolean;
    isSpeechLoading: boolean;
    currentText: string;
    onTogglePause: () => void;
    onSkip: () => void;
    onFinish: () => void;
    onRestart: () => void;
    entries: MeditationEntrySummary[];
    currentPath: string;
}

export const MeditationGenerator: FC<MeditationGeneratorProps> = ({
    isPaused,
    isFinalStage,
    isSpeechLoading,
    currentText,
    onTogglePause,
    onSkip,
    onFinish,
    onRestart,
    entries,
    currentPath,
}) => {
    return (
        <div className="space-y-8">
            {isSpeechLoading && <Loading>Preparando instruções de áudio</Loading>}

            {!isFinalStage && (
                <div className="space-y-4">
                    <StepContent text={currentText} isFinalStage={false} />
                </div>
            )}

            <div className="flex justify-center md:justify-start">
                <Controls
                    isFinalStage={isFinalStage}
                    isPaused={isPaused}
                    onTogglePause={onTogglePause}
                    onFinish={onFinish}
                    onRestart={onRestart}
                />
            </div>

            {!isFinalStage && (
                <button
                    type="button"
                    onClick={onSkip}
                    className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/35 px-5 py-4 text-sm font-semibold text-emerald-900 shadow-[0_18px_45px_-28px_rgba(132,204,22,0.55)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.025]"
                >
                    Avançar Etapa
                    <ChevronsRight size={18} />
                </button>
            )}

            <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.42em] text-emerald-800/70">Roteiro da Sessão</h2>
                <div className="max-h-72 overflow-auto rounded-[24px] border border-white/30 bg-white/25 p-4 shadow-[0_22px_50px_-36px_rgba(132,204,22,0.48)] backdrop-blur-2xl">
                    <ul className="space-y-2 text-left">
                        {entries.map((entry) => {
                            const isActive = entry.path === currentPath;
                            return (
                                <li
                                    key={entry.path}
                                    className={`rounded-[18px] border px-4 py-3 text-sm transition-colors ${isActive
                                        ? 'border-emerald-400/70 bg-emerald-50/80 text-emerald-900 shadow-[0_18px_45px_-32px_rgba(16,185,129,0.58)]'
                                        : 'border-white/35 bg-white/30 text-emerald-800/80'
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700/70">
                                            {entry.stage} · {entry.practice}
                                        </span>
                                        <span className="text-[10px] font-mono text-emerald-700/60">{entry.order + 1}</span>
                                    </div>
                                    <p className="mt-2 text-sm leading-relaxed text-emerald-900/85">{entry.text}</p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>
        </div>
    );
};
