'use client';

import { useState, useEffect, useRef } from 'react';
import { Meditation } from '@/types/meditation';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Play, Pause, Volume2 } from 'lucide-react';

export default function MeditationGenerator() {
    const [currentStep, setCurrentStep] = useState(0);
    const [currentSubStep, setCurrentSubStep] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [totalStepTime, setTotalStepTime] = useState(0);
    const [isMetronome, setIsMetronome] = useState(false);
    const [metronomeInterval, setMetronomeInterval] = useState<NodeJS.Timeout | null>(null);
    const [hasStarted, setHasStarted] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Definir uma meditação fixa (você pode expandir isso depois)
    const meditation: Meditation = {
        tema: "Paz Interior",
        etapas: [
            {
                nome: "Acolhimento",
                subetapas: [
                    "Encontre um lugar confortável e silencioso para se sentar ou deitar. Permita que seu corpo se acomode naturalmente neste espaço.",
                    "Feche os olhos suavemente e traga sua atenção para este momento presente. Você criou este tempo especial para si mesmo.",
                    "Reconheça qualquer tensão ou preocupação que possa estar carregando. Não há necessidade de mudá-las agora, apenas observe com gentileza.",
                    "Respire fundo uma vez e permita que uma sensação de calma comece a se instalar em seu ser."
                ]
            },
            {
                nome: "Respiração e presença",
                subetapas: [
                    "Traga sua atenção para sua respiração natural, sem tentar mudá-la. Simplesmente observe como o ar entra e sai de seus pulmões.",
                    "A cada inspiração, imagine que está recebendo paz e clareza. A cada expiração, libere qualquer tensão desnecessária.",
                    "Se sua mente vagar, isso é completamente natural. Gentilmente, retorne sua atenção para a respiração, como um amigo carinhoso.",
                    "Permita que cada respiração o conecte mais profundamente com o momento presente e consigo mesmo."
                ]
            },
            {
                nome: "Exploração do tema",
                subetapas: [
                    "Agora, traga o tema paz interior para seu coração e mente. Permita que esta palavra ressoe suavemente dentro de você.",
                    "Reflita sobre o que paz interior significa em sua vida. Que memórias, sentimentos ou insights surgem naturalmente?",
                    "Visualize situações onde paz interior se manifesta. Como você pode cultivar mais desta qualidade em seu dia a dia?",
                    "Respire com paz interior, permitindo que esta energia se expanda por todo seu ser, criando uma sensação de plenitude e propósito."
                ]
            },
            {
                nome: "Encerramento e reflexão",
                subetapas: [
                    "Gradualmente, comece a trazer sua consciência de volta ao seu corpo e ao ambiente ao seu redor.",
                    "Carregue consigo a essência de paz interior que você cultivou durante esta prática. Esta qualidade agora faz parte de você.",
                    "Mova suavemente seus dedos das mãos e dos pés, reconectando-se com seu corpo físico de forma gentil.",
                    "Quando estiver pronto, abra os olhos lentamente e retorne ao seu dia com renovada clareza e paz interior."
                ]
            }
        ]
    };

    // Duração de cada subetapa em segundos (2 minutos por subetapa)
    const stepDuration = 120;

    const totalSteps = meditation.etapas.length * 4; // 4 subetapas por etapa
    const currentStepNumber = currentStep * 4 + currentSubStep + 1;

    // Função para criar som do metrônomo
    const playMetronomeSound = () => {
        if (!audioContextRef.current) {
            // Verificar compatibilidade do navegador
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            audioContextRef.current = new AudioContextClass();
        }

        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);

        oscillator.start(audioContextRef.current.currentTime);
        oscillator.stop(audioContextRef.current.currentTime + 0.1);
    };

    // Função para ler o texto
    const speakText = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.9;
            utterance.pitch = 0.7;
            window.speechSynthesis.speak(utterance);
        }
    };

    // Iniciar meditação
    const startMeditation = () => {
        setHasStarted(true);
        setTimeRemaining(stepDuration);
        setTotalStepTime(stepDuration);

        // Ler o primeiro texto
        const currentText = meditation.etapas[currentStep].subetapas[currentSubStep];
        speakText(currentText);

        // Iniciar timer
        startTimer();
    };

    // Pausar/Retomar
    const togglePlayPause = () => {
        if (isPaused) {
            setIsPaused(false);
            startTimer();
        } else {
            setIsPaused(true);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
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
            speakText(currentText);
        } else if (currentStep < meditation.etapas.length - 1) {
            const newStep = currentStep + 1;
            setCurrentStep(newStep);
            setCurrentSubStep(0);
            const currentText = meditation.etapas[newStep].subetapas[0];
            speakText(currentText);
        } else {
            // Meditação concluída - iniciar metrônomo
            setIsPaused(false);
            setIsMetronome(true);
            startMetronome();
            speakText("Meditação concluída. Agora relaxe com o som do metrônomo.");
        }
    };

    // Metrônomo
    const startMetronome = () => {
        const interval = setInterval(() => {
            playMetronomeSound();
        }, 1000); // 60 BPM
        setMetronomeInterval(interval);
    };

    const stopMetronome = () => {
        if (metronomeInterval) {
            clearInterval(metronomeInterval);
            setMetronomeInterval(null);
        }
        setIsMetronome(false);
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
            window.speechSynthesis.cancel();
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
            <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#fde8ff] to-[#ffe8f3] flex items-center justify-center px-6 py-10">
                <div className="max-w-md mx-auto text-center">
                    <div className="relative overflow-hidden rounded-[32px] border border-white/30 bg-white/10 p-10 shadow-[0_35px_80px_-40px_rgba(124,58,237,0.45)] backdrop-blur-2xl">
                        <span className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-gradient-to-br from-purple-400/50 via-rose-300/40 to-sky-300/40 blur-3xl" aria-hidden="true" />
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-800 mb-5">
                            Meditação Guiada
                        </h1>
                        <p className="text-slate-600 mb-10">
                            Uma jornada de paz interior em 4 etapas, com 16 momentos de reflexão
                        </p>
                        <button
                            type="button"
                            onClick={startMeditation}
                            className="relative mx-auto flex h-44 w-44 items-center justify-center overflow-hidden rounded-full border border-white/45 bg-gradient-to-br from-purple-200/40 via-amber-100/30 to-emerald-200/40 text-emerald-900 shadow-[0_30px_70px_-35px_rgba(99,102,241,0.65)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_40px_80px_-35px_rgba(124,58,237,0.55)]"
                        >
                            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-sky-100/20 to-transparent blur-3xl" aria-hidden="true" />
                            <span className="relative flex flex-col items-center gap-3 text-center">
                                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-200 via-amber-100 to-sky-200 text-emerald-800 shadow-inner">
                                    <Play size={32} />
                                </span>
                                <span className="text-lg font-semibold tracking-wide">
                                    Começar Meditação
                                </span>
                                <span className="text-xs uppercase tracking-[0.35em] text-emerald-900/70">
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
        <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#fde8ff] to-[#ffe8f3]">
            <div className="container mx-auto px-6 py-12">
                <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[36px] border border-white/25 bg-white/12 p-10 shadow-[0_45px_95px_-55px_rgba(124,58,237,0.6)] backdrop-blur-2xl">
                    <span className="pointer-events-none absolute -top-24 -left-16 h-44 w-44 rounded-full bg-gradient-to-br from-sky-300/40 via-purple-300/40 to-rose-300/40 blur-3xl" aria-hidden="true" />
                    <span className="pointer-events-none absolute -bottom-28 -right-12 h-56 w-56 rounded-full bg-gradient-to-br from-amber-200/40 via-emerald-200/35 to-purple-200/35 blur-3xl" aria-hidden="true" />

                    {/* Header com progresso */}
                    <div className="relative text-center mb-10">
                        <h1 className="text-2xl font-semibold text-slate-800 mb-2 tracking-tight">
                            {isMetronome ? "Metrônomo de Relaxamento" : meditation.etapas[currentStep].nome}
                        </h1>
                        {!isMetronome && (
                            <p className="text-slate-600">
                                Etapa {currentStep + 1} de {meditation.etapas.length} • Momento {currentSubStep + 1} de 4
                            </p>
                        )}
                    </div>

                    {/* Timer e Gráfico */}
                    <div className="mb-8 rounded-[28px] border border-white/20 bg-white/15 p-8 shadow-[0_30px_70px_-45px_rgba(96,165,250,0.65)] backdrop-blur-2xl">
                        <div className="flex flex-col items-center justify-center gap-8 md:flex-row">

                            {/* Gráfico Circular */}
                            {!isMetronome && (
                                <div className="h-32 w-32">
                                    <CircularProgressbar
                                        value={progress}
                                        text={`${Math.round(progress)}%`}
                                        styles={buildStyles({
                                            textSize: '16px',
                                            pathColor: progress < 50 ? '#a855f7' : progress < 80 ? '#ec4899' : '#38bdf8',
                                            textColor: '#1f2937',
                                            trailColor: 'rgba(255,255,255,0.35)',
                                        })}
                                    />
                                </div>
                            )}

                            {/* Timer Digital */}
                            <div className="text-center">
                                {!isMetronome ? (
                                    <>
                                        <div className="mb-2 text-4xl font-mono font-semibold text-slate-800">
                                            {formatTime(timeRemaining)}
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            Progresso geral: {currentStepNumber}/{totalSteps}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-2xl font-semibold text-emerald-500">
                                        Metrônomo Ativo
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Controles */}
                        <div className="flex justify-center mt-6">
                            {!isMetronome ? (
                                <button
                                    onClick={togglePlayPause}
                                    className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/20 text-emerald-900 shadow-[0_20px_40px_-20px_rgba(79,70,229,0.55)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/30"
                                    aria-label={isPaused ? 'Retomar meditação' : 'Pausar meditação'}
                                >
                                    {isPaused ? <Play size={22} /> : <Pause size={22} />}
                                </button>
                            ) : (
                                <button
                                    onClick={stopMetronome}
                                    className="rounded-full border border-white/40 bg-gradient-to-r from-rose-400/60 via-purple-400/60 to-sky-300/60 px-8 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-18px_rgba(236,72,153,0.55)] backdrop-blur-xl transition-all duration-300 hover:scale-105"
                                >
                                    Parar Metrônomo
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Texto atual */}
                    {!isMetronome && (
                        <div className="rounded-[28px] border border-white/20 bg-white/18 p-8 shadow-[0_30px_70px_-50px_rgba(236,72,153,0.6)] backdrop-blur-2xl">
                            <div className="flex items-start gap-5">
                                <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400/70 via-rose-300/70 to-sky-300/70 text-white shadow-inner">
                                    <Volume2 size={24} />
                                </div>
                                <p className="text-lg leading-relaxed text-slate-700 font-medium">
                                    {meditation.etapas[currentStep].subetapas[currentSubStep]}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Status do Metrônomo */}
                    {isMetronome && (
                        <div className="rounded-[28px] border border-white/25 bg-white/15 p-8 text-center shadow-[0_30px_70px_-50px_rgba(45,212,191,0.55)] backdrop-blur-2xl">
                            <h3 className="text-xl font-semibold text-slate-800 mb-4">
                                🎵 Relaxe com o Metrônomo
                            </h3>
                            <p className="text-slate-600 mb-5">
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