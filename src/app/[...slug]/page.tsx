'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, Music } from 'lucide-react';
import { MAX_METRONOME_PERIOD_MS, MIN_METRONOME_PERIOD_MS, useMetronome } from '@/components/meditation/hooks/useMetronome';
import { useStageMusic } from '@/components/meditation/hooks/useStageMusic';
import { Loading } from '@/components/Loading';
import { MeditationGenerator, type MeditationEntrySummary } from '@/components/meditation';
import { SessionHeader } from '@/components/meditation/SessionHeader';
import { TimerPanel } from '@/components/meditation/TimerPanel';
import type { GetMeditationSessionResponse, MeditationSession } from '@/types/api';
import type { Song } from '@/types';

type SessionCache = {
    session: MeditationSession;
    startedAt: number;
};

type SessionEntry = MeditationEntrySummary & {
    stageIndex: number;
    practiceIndex: number;
    stagePracticesCount: number;
};

const PRACTICE_DURATION = 10;

async function fetchMeditationSession(category: string): Promise<MeditationSession> {
    const response = await fetch(`/api/meditation/${category}`, {
        method: 'GET',
        cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error('Não foi possível carregar a sessão.');
    }

    const payload = (await response.json()) as GetMeditationSessionResponse;
    return payload.session;
}

const formatLabel = (value: string) =>
    value
        .split(/[-_]/)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');

const formatElapsed = (milliseconds: number) => {
    if (!milliseconds || milliseconds <= 0) return 'Sessão ainda não iniciada';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} desde o início`;
};

const extractPracticeText = (value: unknown): string => {
    if (typeof value === 'string') {
        return value;
    }

    if (value && typeof value === 'object' && 'text' in value) {
        const raw = (value as { text?: unknown }).text;
        if (typeof raw === 'string') {
            return raw;
        }
    }

    return '';
};

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const rawSlug = params?.slug;
    const slug = useMemo(() => {
        if (!rawSlug) return [] as string[];
        return Array.isArray(rawSlug) ? rawSlug : [rawSlug];
    }, [rawSlug]);

    const category = slug[0];

    const queryKey = useMemo(() => ['meditation-session', category ?? ''] as const, [category]);

    const cachedSession = queryClient.getQueryData<SessionCache>(queryKey);

    const { data: sessionCache, isLoading: isSessionLoading, isError, error, refetch, isFetching } = useQuery<SessionCache>(
        {
            queryKey,
            enabled: Boolean(category),
            initialData: category && cachedSession?.session?.category === category ? cachedSession : undefined,
            staleTime: Infinity,
            queryFn: async () => {
                if (!category) {
                    throw new Error('Categoria inválida.');
                }

                const session = await fetchMeditationSession(category);
                const existing = queryClient.getQueryData<SessionCache>(queryKey);
                const payload: SessionCache = {
                    session,
                    startedAt: existing?.startedAt ?? 0
                };
                queryClient.setQueryData(queryKey, payload);
                return payload;
            }
        }
    );

    const session = sessionCache?.session;

    const speechCacheRef = useRef<Map<string, ArrayBuffer>>(new Map());
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioUrlRef = useRef<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null);
    const startedAtRef = useRef(sessionCache?.startedAt ?? 0);
    const currentIndexRef = useRef(0);
    const timerCallbackRef = useRef<() => void>(() => undefined);
    const goToIndexRef = useRef<(index: number) => void>(() => undefined);
    const autoStartTriggeredRef = useRef(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isFinalStage, setIsFinalStage] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(PRACTICE_DURATION);
    const [totalStepTime, setTotalStepTime] = useState(PRACTICE_DURATION);
    const [elapsedSinceStartMs, setElapsedSinceStartMs] = useState(0);
    const [speechRequestsInFlight, setSpeechRequestsInFlight] = useState(0);

    const { periodMs: metronomePeriodMs, setPeriodMs: setMetronomePeriod, isPlaying: isMetronomePlaying, start: startMetronome, stop: stopMetronome, beatActive } = useMetronome(1080);
    const { playTrack, stopTrack, pauseTrack, resumeTrack } = useStageMusic();

    const isSpeechLoading = speechRequestsInFlight > 0;
    const entries: SessionEntry[] = useMemo(() => {
        if (!session || !category) {
            return [];
        }

        const list: SessionEntry[] = [];
        session.stages.forEach((stage, stageIndex) => {
            stage.practices.forEach((practice, practiceIndex) => {
                const order = list.length;
                const practiceText = extractPracticeText(practice.text);
                list.push({
                    order,
                    path: `/${category}/${stage.stage}/${practice.practice}/${order}`,
                    stage: stage.stage,
                    practice: practice.practice,
                    text: practiceText,
                    stageIndex,
                    practiceIndex,
                    stagePracticesCount: stage.practices.length
                });
            });
        });
        return list;
    }, [session, category]);

    const sessionSignature = useMemo(() => {
        if (!session) return '';
        return JSON.stringify({
            category: session.category,
            stages: session.stages.map((stage) => ({
                stage: stage.stage,
                practices: stage.practices.map((practice) => extractPracticeText(practice.text))
            }))
        });
    }, [session]);

    useEffect(() => {
        speechCacheRef.current.clear();
    }, [sessionSignature]);

    const beginElapsedTracking = useCallback((timestamp: number) => {
        startedAtRef.current = timestamp;
        setElapsedSinceStartMs(Math.max(0, Date.now() - timestamp));

        if (elapsedTimerRef.current) {
            clearInterval(elapsedTimerRef.current);
        }

        elapsedTimerRef.current = setInterval(() => {
            setElapsedSinceStartMs(Math.max(0, Date.now() - startedAtRef.current));
        }, 1000);
    }, []);

    const stopElapsedTracking = useCallback(() => {
        if (elapsedTimerRef.current) {
            clearInterval(elapsedTimerRef.current);
            elapsedTimerRef.current = null;
        }
        startedAtRef.current = 0;
        setElapsedSinceStartMs(0);
    }, []);

    useEffect(() => {
        const persistedTimestamp = sessionCache?.startedAt ?? 0;
        if (persistedTimestamp > 0) {
            beginElapsedTracking(persistedTimestamp);
        } else {
            stopElapsedTracking();
        }
    }, [beginElapsedTracking, sessionCache?.startedAt, stopElapsedTracking]);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    const initialIndex = useMemo(() => {
        if (!entries.length) return 0;
        if (slug.length >= 4) {
            const routePath = `/${slug.join('/')}`;
            const matchIndex = entries.findIndex((entry) => entry.path === routePath);
            if (matchIndex >= 0) {
                return matchIndex;
            }

            const numericOrder = Number(slug[3]);
            if (!Number.isNaN(numericOrder) && numericOrder >= 0 && numericOrder < entries.length) {
                return numericOrder;
            }
        }
        return 0;
    }, [entries, slug]);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    const currentEntry = entries[currentIndex] ?? null;
    const steps = useMemo(() => session?.stages.map((stage) => formatLabel(stage.stage)) ?? [], [session?.stages]);

    const persistSessionTimestamp = useCallback(
        (timestamp: number) => {
            queryClient.setQueryData<SessionCache>(queryKey, (previous) => {
                if (!previous) return previous;
                return {
                    ...previous,
                    startedAt: timestamp
                };
            });
        },
        [queryClient, queryKey]
    );

    const clearSessionTimestamp = useCallback(() => {
        queryClient.setQueryData<SessionCache>(queryKey, (previous) => {
            if (!previous) return previous;
            return {
                ...previous,
                startedAt: 0
            };
        });
        stopElapsedTracking();
    }, [queryClient, queryKey, stopElapsedTracking]);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const stopSpeech = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.onended = null;
            audioRef.current.onerror = null;
            audioRef.current.src = '';
            audioRef.current = null;
        }
        if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioUrlRef.current = null;
        }
    }, []);

    const startTimer = useCallback(
        (onComplete: () => void) => {
            timerCallbackRef.current = onComplete;
            stopTimer();
            timerRef.current = setInterval(() => {
                setTimeRemaining((previous) => {
                    if (previous <= 1) {
                        timerCallbackRef.current();
                        return PRACTICE_DURATION;
                    }
                    return previous - 1;
                });
            }, 1000);
        },
        [stopTimer]
    );

    const backgroundSong: Song | null = useMemo(() => {
        if (!session?.song) return null;
        return {
            _id: session.song._id,
            title: session.song.title,
            artist: session.song.artist,
            src: session.song.src,
            fadeInMs: session.song.fadeInMs,
            fadeOutMs: session.song.fadeOutMs,
            volume: session.song.volume
        } as Song;
    }, [session?.song]);

    const playSpeechBuffer = useCallback(
        (buffer: ArrayBuffer, onEnded: () => void) => {
            stopSpeech();

            const blob = new Blob([buffer], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            audioUrlRef.current = url;

            const audio = new Audio(url);
            audio.volume = 1;
            audioRef.current = audio;

            audio.onended = () => {
                onEnded();
            };

            audio.onerror = () => {
                console.error('Erro ao reproduzir o áudio da sessão.');
            };

            audio
                .play()
                .catch((playError) => {
                    console.error('Não foi possível iniciar a reprodução da fala.', playError);
                });
        },
        [stopSpeech]
    );

    const fetchSpeech = useCallback(
        async (entry: SessionEntry) => {
            const cached = speechCacheRef.current.get(entry.path);
            if (cached) {
                return cached;
            }

            setSpeechRequestsInFlight((count) => count + 1);

            try {
                const response = await fetch('/api/speech', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: entry.text })
                });

                if (!response.ok) {
                    throw new Error('Falha ao gerar áudio da prática.');
                }

                const buffer = await response.arrayBuffer();
                speechCacheRef.current.set(entry.path, buffer);
                return buffer;
            } finally {
                setSpeechRequestsInFlight((count) => Math.max(0, count - 1));
            }
        },
        []
    );

    const prefetchNeighbors = useCallback(
        (index: number) => {
            const neighborIndexes = [index - 1, index + 1].filter(
                (value) => value >= 0 && value < entries.length
            );

            neighborIndexes.forEach((neighbor) => {
                const neighborEntry = entries[neighbor];
                if (neighborEntry) {
                    void fetchSpeech(neighborEntry).catch((prefetchError) => {
                        console.error('Falha ao pré-carregar áudio da sessão.', prefetchError);
                    });
                }
            });
        },
        [entries, fetchSpeech]
    );

    const goToIndex = useCallback(
        async (targetIndex: number) => {
            if (!entries.length) return;

            if (targetIndex >= entries.length) {
                stopTimer();
                stopMetronome();
                stopSpeech();
                void stopTrack();
                setIsFinalStage(true);
                setIsPaused(true);
                return;
            }

            const entry = entries[targetIndex];
            if (!entry) return;

            setIsFinalStage(false);
            setIsPaused(false);
            setCurrentIndex(targetIndex);
            setTotalStepTime(PRACTICE_DURATION);
            setTimeRemaining(PRACTICE_DURATION);

            if (entry.path !== `/${slug.join('/')}`) {
                router.replace(entry.path, { scroll: false });
            }

            try {
                const buffer = await fetchSpeech(entry);
                playSpeechBuffer(buffer, () => {
                    goToIndexRef.current?.(targetIndex + 1);
                });
            } catch (playbackError) {
                console.error('Erro ao preparar áudio da prática.', playbackError);
            }

            startTimer(() => {
                goToIndexRef.current?.(targetIndex + 1);
            });

            if (!isMetronomePlaying) {
                startMetronome();
            }

            prefetchNeighbors(targetIndex);
        },
        [entries, fetchSpeech, playSpeechBuffer, prefetchNeighbors, router, slug, startMetronome, startTimer, stopMetronome, stopSpeech, stopTimer, stopTrack, isMetronomePlaying]
    );

    useEffect(() => {
        goToIndexRef.current = (index: number) => {
            void goToIndex(index);
        };
    }, [goToIndex]);

    const handleStart = useCallback(() => {
        if (!entries.length) return;

        const timestamp = startedAtRef.current || Date.now();
        persistSessionTimestamp(timestamp);
        beginElapsedTracking(timestamp);

        setHasStarted(true);
        setIsPaused(false);
        setIsFinalStage(false);

        if (backgroundSong) {
            void playTrack(backgroundSong);
        }

        void goToIndex(initialIndex);
    }, [backgroundSong, beginElapsedTracking, entries, goToIndex, initialIndex, persistSessionTimestamp, playTrack]);

    const handleTogglePause = useCallback(() => {
        if (isFinalStage) return;

        if (isPaused) {
            setIsPaused(false);
            startTimer(() => {
                void goToIndex(currentIndexRef.current + 1);
            });
            startMetronome();
            resumeTrack();
            audioRef.current?.play().catch(() => undefined);
        } else {
            setIsPaused(true);
            stopTimer();
            stopMetronome();
            pauseTrack();
            audioRef.current?.pause();
        }
    }, [goToIndex, isFinalStage, isPaused, pauseTrack, resumeTrack, startMetronome, startTimer, stopMetronome, stopTimer]);

    const handleSkip = useCallback(() => {
        void goToIndex(currentIndexRef.current + 1);
    }, [goToIndex]);

    const handleFinish = useCallback(() => {
        stopTimer();
        stopMetronome();
        stopSpeech();
        void stopTrack();
        clearSessionTimestamp();
        speechCacheRef.current.clear();
        setHasStarted(false);
        setIsFinalStage(false);
        setIsPaused(false);
        router.push('/');
    }, [clearSessionTimestamp, router, stopMetronome, stopSpeech, stopTimer, stopTrack]);

    const handleRestart = useCallback(() => {
        const timestamp = Date.now();
        persistSessionTimestamp(timestamp);
        beginElapsedTracking(timestamp);

        speechCacheRef.current.clear();
        setHasStarted(true);
        setIsPaused(false);
        setIsFinalStage(false);

        stopTimer();
        stopMetronome();
        stopSpeech();
        void stopTrack();

        if (backgroundSong) {
            void playTrack(backgroundSong);
        }

        void goToIndex(0);
    }, [backgroundSong, beginElapsedTracking, goToIndex, persistSessionTimestamp, playTrack, stopMetronome, stopSpeech, stopTimer, stopTrack]);

    useEffect(() => {
        return () => {
            stopTimer();
            stopMetronome();
            stopSpeech();
            void stopTrack();
            stopElapsedTracking();
        };
    }, [stopElapsedTracking, stopMetronome, stopSpeech, stopTimer, stopTrack]);

    const generatorEntries = useMemo<MeditationEntrySummary[]>(
        () =>
            entries.map((entry) => ({
                order: entry.order,
                path: entry.path,
                stage: formatLabel(entry.stage),
                practice: formatLabel(entry.practice),
                text: entry.text
            })),
        [entries]
    );

    const currentStageTitle = isFinalStage
        ? 'Sessão concluída'
        : currentEntry
            ? `${formatLabel(currentEntry.stage)} · ${formatLabel(currentEntry.practice)}`
            : session?.title ?? 'Sessão de meditação';

    const currentText = currentEntry?.text ?? '';
    const progressPercent = totalStepTime > 0 ? ((totalStepTime - timeRemaining) / totalStepTime) * 100 : 0;
    const isPracticing = slug.length >= 4;
    const songInfo = session?.song ? { title: session.song.title, artist: session.song.artist } : null;

    const shouldAutoStart =
        Boolean(category) &&
        slug.length === 1 &&
        Boolean(session) &&
        entries.length > 0 &&
        !isSessionLoading &&
        !isFetching &&
        !hasStarted;

    useEffect(() => {
        if (!shouldAutoStart || autoStartTriggeredRef.current) {
            return;
        }

        autoStartTriggeredRef.current = true;
        handleStart();
    }, [handleStart, shouldAutoStart]);

    if (isSessionLoading || isFetching) {
        return <Loading>Carregando sessão de meditação...</Loading>;
    }

    if (isError || !session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center">
                <div className="text-center space-y-5">
                    <h1 className="text-2xl font-semibold text-emerald-900">Não encontramos essa categoria</h1>
                    <p className="text-sm text-emerald-800/80">{error instanceof Error ? error.message : 'Tente novamente em instantes.'}</p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="rounded-full border border-white/60 bg-white/35 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-[0_18px_45px_-32px_rgba(132,204,22,0.4)] backdrop-blur-xl hover:scale-[1.03] transition"
                    >
                        Tentar novamente
                    </button>
                    <div>
                        <Link href="/" className="text-emerald-600 underline-offset-4 hover:underline">
                            Voltar para o início
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center">
                <Link
                    href="/"
                    className="rounded-full border border-white/60 bg-white/35 px-6 py-3 text-sm font-semibold text-emerald-800 shadow-[0_18px_45px_-32px_rgba(132,204,22,0.4)] backdrop-blur-xl hover:scale-[1.03] transition"
                >
                    Escolher uma categoria
                </Link>
            </div>
        );
    }

    if (isPracticing) {
        const elapsedLabel = formatElapsed(elapsedSinceStartMs);
        const sessionActive = !isPaused || isFinalStage;
        const currentStepIndex = currentEntry?.stageIndex ?? 0;
        const currentSubStepIndex = currentEntry?.practiceIndex ?? 0;
        const totalSubSteps = currentEntry?.stagePracticesCount ?? 0;

        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6]">
                <div className="container mx-auto px-6 py-12">
                    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-white/30 bg-white/18 p-10 shadow-[0_45px_95px_-55px_rgba(132,204,22,0.45)] backdrop-blur-2xl">
                        <span className="pointer-events-none absolute -top-24 -left-16 h-44 w-44 rounded-full bg-gradient-to-br from-emerald-200/38 via-lime-200/36 to-amber-200/32 blur-3xl" aria-hidden="true" />
                        <span className="pointer-events-none absolute -bottom-28 -right-12 h-56 w-56 rounded-full bg-gradient-to-br from-white/40 via-emerald-100/35 to-amber-100/30 blur-3xl" aria-hidden="true" />

                        <div className="mb-6 flex flex-col items-center justify-between gap-4 text-center sm:flex-row">
                            <div className="flex items-center gap-3 rounded-full border border-white/45 bg-white/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-800/80 backdrop-blur-xl">
                                <Clock size={16} />
                                <span>{elapsedLabel}</span>
                            </div>
                            {songInfo && (
                                <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-800/75 shadow-[0_18px_45px_-34px_rgba(132,204,22,0.48)] backdrop-blur-xl">
                                    <Music size={14} className="text-emerald-500" />
                                    <span>{songInfo.title}</span>
                                    <span className="text-emerald-700/70">·</span>
                                    <span>{songInfo.artist}</span>
                                </div>
                            )}
                        </div>

                        <SessionHeader
                            title={currentStageTitle}
                            currentStepIndex={currentStepIndex}
                            currentSubStepIndex={currentSubStepIndex}
                            totalSubSteps={totalSubSteps}
                            isFinalStage={isFinalStage}
                            steps={steps}
                        />

                        <TimerPanel
                            isFinalStage={isFinalStage}
                            timeRemaining={timeRemaining}
                            progressPercent={progressPercent}
                            beatActive={beatActive}
                            metronomePeriodMs={metronomePeriodMs}
                            onMetronomePeriodChange={setMetronomePeriod}
                            metronomeMin={MIN_METRONOME_PERIOD_MS}
                            metronomeMax={MAX_METRONOME_PERIOD_MS}
                            isSessionActive={sessionActive}
                        />

                        <div className="mt-8">
                            <MeditationGenerator
                                isPaused={isPaused}
                                isFinalStage={isFinalStage}
                                isSpeechLoading={isSpeechLoading}
                                currentText={currentText}
                                onTogglePause={handleTogglePause}
                                onSkip={handleSkip}
                                onFinish={handleFinish}
                                onRestart={handleRestart}
                                entries={generatorEntries}
                                currentPath={currentEntry?.path ?? ''}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const firstStage = session.stages[0];
    const firstPractice = firstStage?.practices[0];
    const startPath = firstStage && firstPractice ? `/${category}/${firstStage.stage}/${firstPractice.practice}/0` : '/';

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] px-6 py-10">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="space-y-2 text-center">
                    <p className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/35 px-4 py-1 text-xs font-semibold uppercase tracking-[0.38em] text-emerald-800/80 backdrop-blur-xl">
                        {session.category}
                    </p>
                    <h1 className="text-3xl font-semibold text-emerald-900">{session.title}</h1>
                    <p className="text-emerald-800/75 max-w-2xl mx-auto">{session.description}</p>
                </div>

                <div className="flex justify-center">
                    <Link
                        href={startPath}
                        className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-gradient-to-br from-white/50 via-emerald-100/40 to-emerald-100/35 px-8 py-4 text-base font-semibold text-emerald-900 shadow-[0_20px_50px_-20px_rgba(16,185,129,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_25px_60px_-25px_rgba(16,185,129,0.5)]"
                    >
                        Iniciar Meditação
                    </Link>
                </div>

                <details className="group relative overflow-hidden rounded-2xl backdrop-blur-3xl backdrop-saturate-150 border border-white/40 shadow-[0_8px_24px_-8px_rgba(16,185,129,0.15)]">
                    <summary className="p-6 text-emerald-900 font-medium text-base cursor-pointer hover:bg-white/20 transition-all duration-300 list-none flex items-center justify-between">
                        <span>Ver Dados da Sessão (Debug)</span>
                        <svg className="w-5 h-5 text-emerald-700 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <div className="px-6 pb-6">
                        <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 max-h-96 overflow-auto border border-white/30">
                            <pre className="text-xs text-emerald-800 font-mono leading-relaxed overflow-x-auto">
                                {JSON.stringify(session, null, 2)}
                            </pre>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    );
}
