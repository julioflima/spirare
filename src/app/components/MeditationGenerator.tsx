'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Meditation } from '@/types/meditation';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Play, Pause, Volume2 } from 'lucide-react';

const MIN_METRONOME_FREQUENCY = 420;
const MAX_METRONOME_FREQUENCY = 880;

export default function MeditationGenerator() {
    const [currentStep, setCurrentStep] = useState(0);
    const [currentSubStep, setCurrentSubStep] = useState(0);
        const [isPaused, setIsPaused] = useState(false);
        const [timeRemaining, setTimeRemaining] = useState(0);
        const [totalStepTime, setTotalStepTime] = useState(0);
    const [isFinalStage, setIsFinalStage] = useState(false);
    const [metronomeFrequency, setMetronomeFrequency] = useState(660);
    const [metronomeInterval, setMetronomeInterval] = useState<NodeJS.Timeout | null>(null);
    const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
        const [hasStarted, setHasStarted] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const frequencyRef = useRef<number>(metronomeFrequency);
    const audioElementRef = useRef<HTMLAudioElement | null>(null);
    const audioUrlRef = useRef<string | null>(null);

        const knobAngle = useMemo(() => {
            const ratio = (metronomeFrequency - MIN_METRONOME_FREQUENCY) / (MAX_METRONOME_FREQUENCY - MIN_METRONOME_FREQUENCY);
            const clampedRatio = Math.min(1, Math.max(0, ratio));
            return clampedRatio * 240 - 120; // rotate between -120° and 120°
        }, [metronomeFrequency]);

            const handleFrequencyChange = (nextValue: number) => {
                const clamped = Math.min(MAX_METRONOME_FREQUENCY, Math.max(MIN_METRONOME_FREQUENCY, nextValue));
                frequencyRef.current = clamped;
                setMetronomeFrequency(clamped);

                if (isMetronomePlaying) {
                    ensureAudioContext();
                    triggerMetronomeTick();
                }
            };

        const stopCurrentAudio = () => {
            if (audioElementRef.current) {
                audioElementRef.current.pause();
                audioElementRef.current = null;
            }
            if (audioUrlRef.current) {
                URL.revokeObjectURL(audioUrlRef.current);
                audioUrlRef.current = null;
            }
        };

            const speakText = async (text: string) => {
            if (!text) return;

            try {
                stopCurrentAudio();

                const response = await fetch('/api/speech', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text }),
                });

                if (!response.ok) {
                    throw new Error('Falha ao gerar áudio da meditação.');
                }

                const arrayBuffer = await response.arrayBuffer();
                const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
                const url = URL.createObjectURL(blob);
                audioUrlRef.current = url;

                        const audio = new Audio(url);
                        audioElementRef.current = audio;
                        await audio.play();
                    } catch (error) {
                        console.error('Erro ao reproduzir áudio da meditação:', error);
                    }
                };

                useEffect(() => {
                    frequencyRef.current = metronomeFrequency;
                }, [metronomeFrequency]);

    // Definir uma meditação fixa (você pode expandir isso depois)
    const meditation: Meditation = {
        tema: "Paz Interior",
            // Metronome utilities
            const ensureAudioContext = () => {
                if (typeof window === 'undefined') return;

                if (!audioContextRef.current) {
                    const AudioContextClass =
                        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
                    audioContextRef.current = new AudioContextClass();
                }

                if (audioContextRef.current?.state === 'suspended') {
                    audioContextRef.current.resume().catch(() => undefined);
                }
            };

            const triggerMetronomeTick = () => {
                if (!audioContextRef.current) return;

                const ctx = audioContextRef.current;
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.frequency.setValueAtTime(frequencyRef.current, ctx.currentTime);
                oscillator.type = 'triangle';

                const now = ctx.currentTime;
                gainNode.gain.setValueAtTime(0.45, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

                oscillator.start(now);
                oscillator.stop(now + 0.16);
            };

            const startMetronomePlayback = () => {
                ensureAudioContext();
                if (metronomeInterval) return;

                setIsMetronomePlaying(true);
                triggerMetronomeTick();
                const interval = setInterval(() => {
                    ensureAudioContext();
                    triggerMetronomeTick();
                }, 1000);
                setMetronomeInterval(interval);
            };

            const stopMetronomePlayback = () => {
                if (metronomeInterval) {
                    clearInterval(metronomeInterval);
                    setMetronomeInterval(null);
                }
                setIsMetronomePlaying(false);
            };
                audioContextRef.current.resume().catch(() => undefined);
            }
        };

        const triggerMetronomeTick = () => {
            if (!audioContextRef.current) return;

            const ctx = audioContextRef.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.setValueAtTime(frequencyRef.current, ctx.currentTime);
            oscillator.type = 'triangle';

            const now = ctx.currentTime;
            gainNode.gain.setValueAtTime(0.45, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

            oscillator.start(now);
            oscillator.stop(now + 0.16);
        };

        const startMetronomePlayback = () => {
            ensureAudioContext();
            if (metronomeInterval) return;

            setIsMetronomePlaying(true);
            triggerMetronomeTick();
            const interval = setInterval(() => {
                ensureAudioContext();
                triggerMetronomeTick();
            }, 1000);
            setMetronomeInterval(interval);
        };

        const stopMetronomePlayback = () => {
            if (metronomeInterval) {
                clearInterval(metronomeInterval);
                setMetronomeInterval(null);
            }
            setIsMetronomePlaying(false);
        };

    // Função para ler o texto
    // Iniciar meditação
            const startMeditation = () => {
                stopCurrentAudio();
            setHasStarted(true);
            setIsFinalStage(false);
            setIsPaused(false);
            setCurrentStep(0);
            setCurrentSubStep(0);
            setTimeRemaining(stepDuration);
            setTotalStepTime(stepDuration);

            // Ler o primeiro texto
            const currentText = meditation.etapas[0].subetapas[0];
            void speakText(currentText);

            // Iniciar recursos
                stopMetronomePlayback();
            startMetronomePlayback();
            startTimer();
        };

    // Pausar/Retomar
    const togglePlayPause = () => {
            if (isPaused) {
                setIsPaused(false);
                startMetronomePlayback();
                audioElementRef.current?.play().catch(() => undefined);
                startTimer();
            } else {
                setIsPaused(true);
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                stopMetronomePlayback();
                audioElementRef.current?.pause();
            }
    };

    // Timer
    const startTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                        if (prev <= 1) {
                    // Avançar para próxima subetapa
                    nextSubStep();
                    return stepDuration;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Próxima subetapa
    const nextSubStep = () => {
            if (currentSubStep < 3) {
            const newSubStep = currentSubStep + 1;
            setCurrentSubStep(newSubStep);
            const currentText = meditation.etapas[currentStep].subetapas[newSubStep];
            void speakText(currentText);
        } else if (currentStep < meditation.etapas.length - 1) {
            const newStep = currentStep + 1;
            setCurrentStep(newStep);
            setCurrentSubStep(0);
            const currentText = meditation.etapas[newStep].subetapas[0];
            void speakText(currentText);
        } else {
                // Meditação concluída - etapa final
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                setIsPaused(true);
                setIsFinalStage(true);
                setTimeRemaining(0);
                void speakText("Meditação concluída. Permaneça presente enquanto o metrônomo conduz sua respiração.");
                startMetronomePlayback();
        }
    };

        const finishSession = () => {
            stopMetronomePlayback();
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
                stopCurrentAudio();

            setIsFinalStage(false);
            setHasStarted(false);
            setIsPaused(false);
            setCurrentStep(0);
            setCurrentSubStep(0);
            setTimeRemaining(0);
            setTotalStepTime(0);
        };

    // Cleanup
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (metronomeInterval) {
                clearInterval(metronomeInterval);
            }
            setIsMetronomePlaying(false);
            stopCurrentAudio();
        };
    }, [metronomeInterval]);

    // Formatação do tempo
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Cálculo do progresso
    const progress = totalStepTime > 0 ? ((totalStepTime - timeRemaining) / totalStepTime) * 100 : 0;

    if (!hasStarted) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center px-6 py-10">
                <div className="max-w-md mx-auto text-center">
                        <div className="relative overflow-hidden rounded-[32px] border border-white/35 bg-white/25 p-10 shadow-[0_35px_80px_-40px_rgba(132,204,22,0.35)] backdrop-blur-2xl">
                            <span className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-gradient-to-br from-emerald-200/50 via-lime-200/40 to-amber-200/40 blur-3xl" aria-hidden="true" />
                            <h1 className="text-3xl font-semibold tracking-tight text-emerald-900 mb-5">
                            Meditação Guiada
                        </h1>
                            <p className="text-emerald-700/80 mb-10">
                            Uma jornada de paz interior em 4 etapas, com 16 momentos de reflexão
                        </p>
                                    <button
                            type="button"
                            onClick={startMeditation}
                                        className="relative mx-auto flex h-44 w-44 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/55 bg-gradient-to-br from-white/60 via-emerald-100/45 to-amber-100/45 text-emerald-900 shadow-[0_30px_70px_-35px_rgba(34,197,94,0.45)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_40px_90px_-45px_rgba(132,204,22,0.55)]"
                        >
                                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-emerald-100/20 to-transparent blur-3xl" aria-hidden="true" />
                            <span className="relative flex flex-col items-center gap-3 text-center">
                                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-200 via-lime-200 to-amber-200 text-emerald-900 shadow-inner">
                                    <Play size={32} />
                                </span>
                                <span className="text-lg font-semibold tracking-wide">
                                    Começar Meditação
                                </span>
                                    <span className="text-xs uppercase tracking-[0.35em] text-emerald-900/60">
                                    Respire
                                </span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6]">
            <div className="container mx-auto px-6 py-12">
                    <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[36px] border border-white/30 bg-white/18 p-10 shadow-[0_45px_95px_-55px_rgba(132,204,22,0.45)] backdrop-blur-2xl">
                        <span className="pointer-events-none absolute -top-24 -left-16 h-44 w-44 rounded-full bg-gradient-to-br from-emerald-200/40 via-lime-200/40 to-amber-200/35 blur-3xl" aria-hidden="true" />
                        <span className="pointer-events-none absolute -bottom-28 -right-12 h-56 w-56 rounded-full bg-gradient-to-br from-white/40 via-emerald-100/35 to-amber-100/35 blur-3xl" aria-hidden="true" />

                    {/* Header com progresso */}
                                            <div className="relative text-center mb-10">
                                                <h1 className="text-2xl font-semibold text-emerald-900 mb-3 tracking-tight">
                                                    {isFinalStage ? "Sessão de Relaxamento" : meditation.etapas[currentStep].nome}
                                                </h1>
                                                {!isFinalStage && (
                                                    <div className="flex justify-center">
                                                        <div className="flex flex-col items-center gap-2 rounded-[24px] border border-white/40 bg-white/35 px-6 py-3 text-emerald-800/80 shadow-[0_15px_35px_-30px_rgba(132,204,22,0.55)] backdrop-blur-xl">
                                                            <span className="text-xs uppercase tracking-[0.4em] text-emerald-700/70">
                                                                Milestone
                                                            </span>
                                                            <span className="text-sm font-semibold">
                                                                Etapa {currentStep + 1} de {meditation.etapas.length} • Momento {currentSubStep + 1} de 4
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute right-0 top-1 hidden md:flex items-center gap-2">
                                                    <span
                                                        className={`h-2.5 w-2.5 rounded-full ${isMetronomePlaying ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-200'}`}
                                                        aria-hidden="true"
                                                    />
                                                    <span className="text-xs uppercase tracking-[0.3em] text-emerald-700/60">
                                                        Ritmo
                                                    </span>
                                                </div>
                    </div>

                    {/* Timer e Gráfico */}
                                <div className="mb-8 rounded-[28px] border border-white/30 bg-white/25 p-8 shadow-[0_30px_70px_-45px_rgba(132,204,22,0.45)] backdrop-blur-2xl">
                        <div className="flex flex-col items-center justify-center gap-8 md:flex-row">

                            {/* Gráfico Circular */}
                                        {!isFinalStage && (
                                <div className="h-32 w-32">
                                    <CircularProgressbar
                                        value={progress}
                                        text={`${Math.round(progress)}%`}
                                        styles={buildStyles({
                                            textSize: '16px',
                                                        pathColor: progress < 50 ? '#34d399' : progress < 80 ? '#fbbf24' : '#f59e0b',
                                                        textColor: '#0f172a',
                                                        trailColor: 'rgba(255,255,255,0.45)',
                                        })}
                                    />
                                </div>
                            )}

                            {/* Timer Digital */}
                            <div className="text-center">
                                            {!isFinalStage ? (
                                    <>
                                                    <div className="mb-2 text-4xl font-mono font-semibold text-emerald-900">
                                            {formatTime(timeRemaining)}
                                        </div>
                                                    <div className="text-sm text-emerald-700/80">
                                            Progresso geral: {currentStepNumber}/{totalSteps}
                                        </div>
                                    </>
                                ) : (
                                                <div className="space-y-2">
                                                    <p className="text-sm uppercase tracking-[0.35em] text-emerald-700/70">Respire</p>
                                                    <div className="text-2xl font-semibold text-emerald-500">
                                                        Metrônomo Ativo
                                                    </div>
                                                </div>
                                )}
                            </div>

                                            {/* Metronome Knob */}
                                            <div className="flex flex-col items-center gap-3 text-center">
                                                <div className="relative h-28 w-28">
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/70 via-emerald-100/55 to-amber-100/55 shadow-[inset_6px_6px_18px_rgba(209,213,219,0.45),inset_-6px_-6px_18px_rgba(255,255,255,0.6)]" />
                                                    <div className="absolute inset-3 rounded-full bg-gradient-to-br from-emerald-200/90 via-emerald-100/70 to-lime-100/60 shadow-[inset_4px_4px_12px_rgba(74,222,128,0.25),inset_-4px_-4px_12px_rgba(253,230,138,0.45)]" />
                                                                        <div
                                                                            className="absolute left-1/2 top-1/2 h-12 w-1.5 rounded-full bg-gradient-to-b from-emerald-500 via-emerald-400 to-amber-300 shadow-[0_6px_10px_rgba(16,185,129,0.35)] origin-bottom"
                                                                            style={{ transform: `translate(-50%, -85%) rotate(${knobAngle}deg)` }}
                                                                        />
                                                    <div className="absolute inset-[22%] rounded-full bg-white/40" />
                                                    <input
                                                        type="range"
                                                        min={MIN_METRONOME_FREQUENCY}
                                                        max={MAX_METRONOME_FREQUENCY}
                                                        value={metronomeFrequency}
                                                        onChange={(event) => handleFrequencyChange(Number(event.target.value))}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        aria-label="Ajustar frequência do metrônomo"
                                                    />
                                                </div>
                                                <div className="rounded-full border border-white/45 bg-white/35 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800/80">
                                                    Frequência
                                                </div>
                                                <div className="text-sm font-semibold text-emerald-900">
                                                    {Math.round(metronomeFrequency)} Hz
                                                </div>
                                            </div>
                        </div>

                        {/* Controles */}
                        <div className="flex justify-center mt-6">
                                                        {!isFinalStage ? (
                                <button
                                    onClick={togglePlayPause}
                                                                className="inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/55 bg-white/30 text-emerald-900 shadow-[0_20px_40px_-20px_rgba(34,197,94,0.45)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/40"
                                    aria-label={isPaused ? 'Retomar meditação' : 'Pausar meditação'}
                                >
                                    {isPaused ? <Play size={22} /> : <Pause size={22} />}
                                </button>
                            ) : (
                                <button
                                                onClick={finishSession}
                                                                className="rounded-full border border-white/55 bg-gradient-to-r from-emerald-300/70 via-lime-300/65 to-amber-300/65 px-8 py-3 text-sm font-semibold text-emerald-900 shadow-[0_20px_45px_-18px_rgba(132,204,22,0.45)] backdrop-blur-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                                >
                                                Encerrar Sessão
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Texto atual */}
                                {!isFinalStage && (
                                    <div className="rounded-[28px] border border-white/30 bg-white/22 p-8 shadow-[0_30px_70px_-50px_rgba(132,204,22,0.45)] backdrop-blur-2xl">
                            <div className="flex items-start gap-5">
                                            <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300/80 via-lime-300/70 to-amber-200/70 text-emerald-900 shadow-inner">
                                    <Volume2 size={24} />
                                </div>
                                            <p className="text-lg leading-relaxed text-emerald-900/90 font-medium">
                                    {meditation.etapas[currentStep].subetapas[currentSubStep]}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Status do Metrônomo */}
                                {isFinalStage && (
                                    <div className="rounded-[28px] border border-white/35 bg-white/22 p-8 text-center shadow-[0_30px_70px_-50px_rgba(34,197,94,0.45)] backdrop-blur-2xl">
                                        <h3 className="text-xl font-semibold text-emerald-900 mb-4">
                                🎵 Relaxe com o Metrônomo
                            </h3>
                                        <p className="text-emerald-700/80 mb-5">
                                Respire no ritmo do som e permita que sua mente se acalme completamente.
                            </p>
                                        <div className="text-2xl text-emerald-500">♪ ♫ ♪ ♫</div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}