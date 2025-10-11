'use client';

import { Pause, Play, RefreshCcw } from 'lucide-react';
import { FC } from 'react';

interface ControlsProps {
    isFinalStage: boolean;
    isPaused: boolean;
    onTogglePlay: () => void;
    onFinish: () => void;
    onRestart: () => void;
}

export const Controls: FC<ControlsProps> = ({ isFinalStage, isPaused, onTogglePlay, onFinish, onRestart }) => {
    if (isFinalStage) {
        return (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                    type="button"
                    onClick={onFinish}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/55 bg-gradient-to-r from-emerald-300/75 via-lime-300/65 to-amber-300/65 px-6 py-3 text-sm font-semibold text-emerald-900 shadow-[0_22px_48px_-24px_rgba(132,204,22,0.55)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.03]"
                >
                    Encerrar Sessão
                </button>
                <button
                    type="button"
                    onClick={onRestart}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/45 bg-white/35 px-5 py-3 text-sm font-semibold text-emerald-900 shadow-[0_18px_45px_-30px_rgba(132,204,22,0.5)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.03]"
                >
                    <RefreshCcw size={16} />
                    Recomeçar
                </button>
            </div>
        );
    }

    return (
        <div className="mt-6 flex justify-center">
            <button
                type="button"
                onClick={onTogglePlay}
                className="inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/55 bg-white/30 text-emerald-900 shadow-[0_20px_40px_-20px_rgba(34,197,94,0.45)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.05] hover:bg-white/45"
                aria-label={isPaused ? 'Retomar meditação' : 'Pausar meditação'}
            >
                {isPaused ? <Play size={22} /> : <Pause size={22} />}
            </button>
        </div>
    );
};
