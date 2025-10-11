'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defaultMeditation, STEP_DURATION_SECONDS, SUBSTEPS_PER_STEP } from '@/constants/meditation';
import { Controls } from './Controls';
import { SessionHeader } from './SessionHeader';
import { StartOverlay } from './StartOverlay';
import { StepContent } from './StepContent';
import { TimerPanel } from './TimerPanel';
import { useMetronome, MAX_METRONOME_PERIOD_MS, MIN_METRONOME_PERIOD_MS } from './hooks/useMetronome';
import { useSpeech } from './hooks/useSpeech';
import { useStageMusic } from './hooks/useStageMusic';
import { ChevronsRight, Music } from 'lucide-react';

export const MeditationGenerator = () => {
    const [hasStarted, setHasStarted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [currentSubStep, setCurrentSubStep] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(STEP_DURATION_SECONDS);
    const [totalStepTime, setTotalStepTime] = useState(STEP_DURATION_SECONDS);
    const [isPaused, setIsPaused] = useState(false);
    const [isFinalStage, setIsFinalStage] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const {
        speakSequence,
        pause: pauseSpeech,
        resume: resumeSpeech,
        stop: stopSpeech,
        isGenerating: isAudioLoading,
    } = useSpeech();
    const {
        periodMs: metronomePeriod,
        setPeriodMs: setMetronomePeriod,
        isPlaying: isMetronomePlaying,
        start: startMetronome,
        stop: stopMetronome,
        beatActive,
    } = useMetronome(1080);
    const { playTrack: playStageTrack, stopTrack, pauseTrack, resumeTrack } = useStageMusic();

    const totalSteps = defaultMeditation.etapas.length;
    const totalMoments = totalSteps * SUBSTEPS_PER_STEP;
    const flatIndex = currentStep * SUBSTEPS_PER_STEP + currentSubStep + 1;
    const stepNames = useMemo(() => defaultMeditation.etapas.map((etapa) => etapa.nome), []);

    const currentStage = defaultMeditation.etapas[currentStep];

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const queueNarration = useCallback(
        (stepIndex: number, subStepIndex: number, isStageStart: boolean) => {
            const etapa = defaultMeditation.etapas[stepIndex];
            if (!etapa) {
                return;
            }

            const messages: string[] = [];
            if (isStageStart && etapa.introducao) {
                messages.push(etapa.introducao);
            }

            const subStepText = etapa.subetapas[subStepIndex];
            if (subStepText) {
                messages.push(subStepText);
            }

            if (!messages.length) {
                return;
            }

            void speakSequence(messages, { replace: !isStageStart });
        },
        [speakSequence]
    );

    const goToSubStep = useCallback(
        (stepIndex: number, subStepIndex: number, isStageStart: boolean) => {
            setCurrentStep(stepIndex);
            setCurrentSubStep(subStepIndex);
            setTimeRemaining(STEP_DURATION_SECONDS);
            setTotalStepTime(STEP_DURATION_SECONDS);

            const etapa = defaultMeditation.etapas[stepIndex];
            if (isStageStart) {
                void playStageTrack(etapa?.trilha ?? null);
            }

            queueNarration(stepIndex, subStepIndex, isStageStart);
        },
        [playStageTrack, queueNarration]
    );

    const enterFinalStage = useCallback(() => {
        clearTimer();
        setIsFinalStage(true);
        setIsPaused(true);
        setTimeRemaining(0);
        setTotalStepTime(0);
        void speakSequence([defaultMeditation.congratulacaoFinal], { replace: false });
        startMetronome();
    }, [clearTimer, speakSequence, startMetronome]);

    const advanceSubStep = useCallback((): boolean => {
        const isLastSubStep = currentSubStep >= SUBSTEPS_PER_STEP - 1;
        const isLastStep = currentStep >= defaultMeditation.etapas.length - 1;
        const stageData = defaultMeditation.etapas[currentStep];

        if (!isLastSubStep) {
            goToSubStep(currentStep, currentSubStep + 1, false);
            return false;
        }

        if (stageData?.encerramento) {
            void speakSequence([stageData.encerramento], { replace: false });
        }

        if (!isLastStep) {
            goToSubStep(currentStep + 1, 0, true);
            return false;
        }

        void stopTrack(stageData?.trilha.fadeOutMs);
        enterFinalStage();
        return true;
    }, [currentStep, currentSubStep, enterFinalStage, goToSubStep, speakSequence, stopTrack]);

    const startTimer = useCallback(() => {
        clearTimer();

        timerRef.current = setInterval(() => {
            setTimeRemaining((previous) => {
                if (previous <= 1) {
                    const reachedEnd = advanceSubStep();
                    return reachedEnd ? 0 : STEP_DURATION_SECONDS;
                }
                return previous - 1;
            });
        }, 1000);
    }, [advanceSubStep, clearTimer]);

    const resetSessionState = useCallback(() => {
        clearTimer();
        stopMetronome();
        stopSpeech();
        void stopTrack();
        setHasStarted(false);
        setIsFinalStage(false);
        setIsPaused(false);
        setCurrentStep(0);
        setCurrentSubStep(0);
        setTimeRemaining(STEP_DURATION_SECONDS);
        setTotalStepTime(STEP_DURATION_SECONDS);
    }, [clearTimer, stopMetronome, stopSpeech, stopTrack]);

    const handleStart = useCallback(() => {
        resetSessionState();
        setHasStarted(true);
        setIsPaused(false);
        setIsFinalStage(false);
        goToSubStep(0, 0, true);
        startMetronome();
        startTimer();
    }, [goToSubStep, resetSessionState, startMetronome, startTimer]);

    const handleTogglePlay = useCallback(() => {
        if (isFinalStage) return;

        if (isPaused) {
            setIsPaused(false);
            resumeSpeech();
            resumeTrack();
            startMetronome();
            startTimer();
        } else {
            setIsPaused(true);
            pauseSpeech();
            pauseTrack();
            stopMetronome();
            clearTimer();
        }
    }, [clearTimer, isFinalStage, isPaused, pauseSpeech, pauseTrack, resumeSpeech, resumeTrack, startMetronome, startTimer, stopMetronome]);

    const handleSkip = useCallback(() => {
        if (isFinalStage) return;
        advanceSubStep();
    }, [advanceSubStep, isFinalStage]);

    const handleFinish = useCallback(() => {
        resetSessionState();
    }, [resetSessionState]);

    const handleRestart = useCallback(() => {
        handleFinish();
        setTimeout(() => {
            handleStart();
        }, 0);
    }, [handleFinish, handleStart]);

    useEffect(() => {
        return () => {
            clearTimer();
            stopMetronome();
            stopSpeech();
            void stopTrack(0);
        };
    }, [clearTimer, stopMetronome, stopSpeech, stopTrack]);

    const progressPercent = totalStepTime > 0 ? ((totalStepTime - timeRemaining) / totalStepTime) * 100 : 0;

    const currentTitle = useMemo(() => {
        if (isFinalStage) {
            return 'Sessão de Relaxamento';
        }
        return defaultMeditation.etapas[currentStep]?.nome ?? defaultMeditation.etapas[0]?.nome;
    }, [currentStep, isFinalStage]);

    const currentText = useMemo(() => {
        if (isFinalStage) {
            return '';
        }
        return defaultMeditation.etapas[currentStep]?.subetapas[currentSubStep] ?? '';
    }, [currentStep, currentSubStep, isFinalStage]);

    if (!hasStarted) {
        return <StartOverlay onStart={handleStart} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6]">
            <div className="container mx-auto px-6 py-12">
                <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[36px] border border-white/30 bg-white/18 p-10 shadow-[0_45px_95px_-55px_rgba(132,204,22,0.45)] backdrop-blur-2xl">
                    <span className="pointer-events-none absolute -top-24 -left-16 h-44 w-44 rounded-full bg-gradient-to-br from-emerald-200/38 via-lime-200/36 to-amber-200/32 blur-3xl" aria-hidden="true" />
                    <span className="pointer-events-none absolute -bottom-28 -right-12 h-56 w-56 rounded-full bg-gradient-to-br from-white/40 via-emerald-100/35 to-amber-100/30 blur-3xl" aria-hidden="true" />

                    {isAudioLoading && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur-xl">
                            <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-300/80 border-t-transparent" aria-hidden="true" />
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-800/80">
                                Preparando instruções de áudio
                            </p>
                        </div>
                    )}

                    <SessionHeader
                        title={currentTitle}
                        currentStepIndex={currentStep}
                        currentSubStepIndex={currentSubStep}
                        totalSubSteps={SUBSTEPS_PER_STEP}
                        isFinalStage={isFinalStage}
                        steps={stepNames}
                    />

                    <TimerPanel
                        isFinalStage={isFinalStage}
                        timeRemaining={timeRemaining}
                        progressPercent={progressPercent}
                        beatActive={beatActive}
                        metronomePeriodMs={metronomePeriod}
                        onMetronomePeriodChange={setMetronomePeriod}
                        metronomeMin={MIN_METRONOME_PERIOD_MS}
                        metronomeMax={MAX_METRONOME_PERIOD_MS}
                        isSessionActive={!isPaused || isFinalStage}
                        ledActive={isMetronomePlaying && beatActive}
                    />

                    {!isFinalStage && currentText && (
                        <div className="mt-6 space-y-4">
                            <StepContent text={currentText} isFinalStage={false} />
                            {currentStage?.trilha && (
                                <div className="flex items-center gap-2 rounded-[20px] border border-white/35 bg-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-800/70 shadow-[0_18px_45px_-34px_rgba(132,204,22,0.5)] backdrop-blur-xl">
                                    <Music size={14} className="text-emerald-500" />
                                    <span>
                                        {currentStage.trilha.title} · {currentStage.trilha.artist}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-8 flex flex-col items-center gap-6 md:flex-row md:justify-between">
                        <Controls
                            isFinalStage={isFinalStage}
                            isPaused={isPaused}
                            onTogglePlay={handleTogglePlay}
                            onFinish={handleFinish}
                            onRestart={handleRestart}
                        />

                        {!isFinalStage && (
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/35 px-4 py-4 text-sm font-semibold text-emerald-900 shadow-[0_18px_45px_-28px_rgba(132,204,22,0.55)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.025]"
                            >
                                Avançar Etapa
                                <ChevronsRight size={18} />
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
