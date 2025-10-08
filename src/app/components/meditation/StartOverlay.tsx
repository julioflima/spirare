'use client';

import { Play, Sparkles, Wind } from 'lucide-react';
import { FC } from 'react';

interface StartOverlayProps {
    onStart: () => void;
}

export const StartOverlay: FC<StartOverlayProps> = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center px-6 py-10">
            <div className="max-w-md mx-auto text-center">
                <div className="relative overflow-hidden rounded-[32px] border border-white/35 bg-white/25 p-10 shadow-[0_35px_80px_-40px_rgba(132,204,22,0.35)] backdrop-blur-2xl">
                    <span className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-200/40 via-lime-200/35 to-amber-200/35 blur-3xl" aria-hidden="true" />
                    <span className="pointer-events-none absolute -bottom-32 -left-24 h-60 w-60 rounded-full bg-gradient-to-br from-white/45 via-emerald-100/35 to-amber-100/35 blur-3xl" aria-hidden="true" />

                    <div className="mb-10 space-y-3">
                        <p className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/35 px-4 py-1 text-xs font-semibold uppercase tracking-[0.38em] text-emerald-800/80">
                            <Sparkles size={14} />
                            Inicie Sua Jornada
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight text-emerald-900">Meditação Guiada Spirare</h1>
                        <p className="text-emerald-700/80">Quatro etapas, dezesseis instantes de presença iluminada para harmonizar mente, corpo e respiração.</p>
                    </div>

                    <button
                        type="button"
                        aria-label="Começar meditação"
                        onClick={onStart}
                        className="group relative mx-auto flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/55 bg-gradient-to-br from-white/55 via-emerald-100/45 to-amber-100/45 shadow-[0_30px_70px_-35px_rgba(34,197,94,0.45)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_42px_100px_-48px_rgba(132,204,22,0.58)]"
                    >
                        <span className="absolute inset-0 rounded-full bg-white/35 blur-3xl" aria-hidden="true" />
                        <span className="absolute inset-6 rounded-full border border-white/55 bg-gradient-to-br from-white/70 via-emerald-50/25 to-transparent transition-all duration-500 group-hover:shadow-[inset_12px_12px_28px_rgba(78,205,196,0.28),inset_-14px_-14px_24px_rgba(255,255,255,0.7)]" />
                        <span className="relative flex items-center justify-center text-emerald-900">
                            <span className="flex h-16 w-16 items-center justify-center rounded-full text-emerald-900">
                                <Play size={32} className="drop-shadow-[0_6px_10px_rgba(14,116,144,0.25)]" />
                            </span>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
