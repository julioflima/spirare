'use client';

import { FC } from 'react';

interface SessionHeaderProps {
    title: string;
    currentStepIndex: number;
    currentSubStepIndex: number;
    totalSubSteps: number;
    isFinalStage: boolean;
    steps: string[];
}

export const SessionHeader: FC<SessionHeaderProps> = ({
    title,
    currentStepIndex,
    currentSubStepIndex,
    totalSubSteps,
    isFinalStage,
    steps,
}) => {
    return (
        <header className="relative text-center mb-4">
            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-emerald-900 md:text-3xl">
                {title}
            </h1>
            {!isFinalStage && (
                <p className="text-xs font-semibold uppercase tracking-[0.38em] text-emerald-800/70">
                    Etapa {currentStepIndex + 1} de {steps.length} • Momento {currentSubStepIndex + 1} de {totalSubSteps}
                </p>
            )}
        </header>
    );
};
