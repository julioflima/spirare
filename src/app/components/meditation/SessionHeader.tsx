'use client';

import { ChevronsRight } from 'lucide-react';
import { FC } from 'react';
import { StepContent } from './StepContent';

interface SessionHeaderProps {
    title: string;
    currentStepIndex: number;
    text: string;
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
    text,
    isFinalStage,
    steps,
}) => {
    return (
        <header className="relative text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-emerald-900 md:text-3xl mb-4">
                {title}
            </h1>
            <StepContent text={text} isFinalStage={isFinalStage} />
        </header>
    );
};
