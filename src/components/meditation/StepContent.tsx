'use client';

import { Volume2 } from 'lucide-react';
import { FC } from 'react';

interface StepContentProps {
    text: string;
    isFinalStage: boolean;
}

export const StepContent: FC<StepContentProps> = ({ text, isFinalStage }) => {
    if (isFinalStage) {
        return null;
    }

    return (
        <section className="rounded-[28px] border border-white/30 bg-white/22 p-8 shadow-[0_30px_70px_-50px_rgba(132,204,22,0.45)] backdrop-blur-2xl">
            <div className="flex items-start gap-5">
                <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300/80 via-lime-300/70 to-amber-200/70 text-emerald-900 shadow-inner">
                    <Volume2 size={24} />
                </div>
                <p className="text-lg leading-relaxed text-emerald-900/90">
                    {text}
                </p>
            </div>
        </section>
    );
};
