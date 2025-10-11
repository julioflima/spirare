'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMeditationSessionQuery } from '@/providers';
import { Play } from 'lucide-react';
import 'react-circular-progressbar/dist/styles.css';
import { MeditationGenerator } from '@/components/meditation';
import { Loading } from '@/components/Loading';

const PRACTICE_DURATION = 10; // 10 seconds per practice

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const slug = (params.slug as string[]) || [];

    const [category, stage, practice, order] = slug;

    const { data: session, isLoading, error } = useMeditationSessionQuery(category, {
        enabled: !(category && stage && practice && order)
    });

    // Loading state
    if (isLoading) return <Loading>Carregando...</Loading>

    // Error state
    if (error || !session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-emerald-900 mb-4">Categoria não encontrada</h1>
                    <Link
                        href="/"
                        className="text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                    >
                        Voltar para o início
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* {category && stage && practice && order && <MeditationGenerator />} */}

            <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] px-6 py-10">
                <div className="max-w-4xl mx-auto">

                    {/* Start button */}
                    <Link
                        href={`/${category}/${session.stages[0].stage}/${session.stages[0].practices[0].practice}/0`}
                        className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-gradient-to-br from-white/50 via-emerald-100/40 to-emerald-100/35 px-8 py-4 text-base font-semibold text-emerald-900 shadow-[0_20px_50px_-20px_rgba(16,185,129,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_25px_60px_-25px_rgba(16,185,129,0.5)]"
                    >
                        <Play size={20} className="fill-emerald-700" />
                        Iniciar Meditação
                    </Link>

                    {/* JSON Debug View */}
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
        </>
    );
}
