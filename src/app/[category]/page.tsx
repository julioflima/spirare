'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMeditationSessionQuery } from '@/providers';

const STAGE_LABELS: Record<string, { label: string; description: string }> = {
    opening: { label: 'Abertura', description: 'Preparação inicial para a meditação' },
    concentration: { label: 'Concentração', description: 'Foco e estabilização mental' },
    exploration: { label: 'Exploração', description: 'Aprofundamento da prática' },
    awakening: { label: 'Despertar', description: 'Finalização e integração' },
};

export default function CategoryPage() {
    const params = useParams();
    const category = params.category as string;
    const { data: session, isLoading, error } = useMeditationSessionQuery(category);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-emerald-800/70">Carregando sessão...</p>
                </div>
            </div>
        );
    }

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
        <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <Link
                    href="/"
                    className="inline-flex items-center text-emerald-700/80 hover:text-emerald-900 mb-8 transition-colors cursor-pointer"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Voltar
                </Link>

                {/* Theme header */}
                <div className="bg-white/25 backdrop-blur-2xl rounded-3xl shadow-lg p-8 mb-8 border border-white/35">
                    <h1 className="text-4xl font-bold text-emerald-900 mb-4">{session.title}</h1>
                    {session.description && (
                        <p className="text-lg text-emerald-800/80 leading-relaxed">{session.description}</p>
                    )}
                </div>

                {/* Stages grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-emerald-900 mb-6">Escolha uma Etapa</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {session.stages.map((stageData) => {
                            const stageInfo = STAGE_LABELS[stageData.stage] || { 
                                label: stageData.stage, 
                                description: '' 
                            };
                            return (
                                <Link
                                    key={stageData.stage}
                                    href={`/${category}/${stageData.stage}`}
                                    className="group block p-6 bg-white/25 backdrop-blur-2xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/35 cursor-pointer"
                                >
                                    <h3 className="text-xl font-semibold text-emerald-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                        {stageInfo.label}
                                    </h3>
                                    <p className="text-emerald-700/70 text-sm mb-4">{stageInfo.description}</p>
                                    <div className="flex items-center text-emerald-600 font-medium text-sm">
                                        <span>Continuar</span>
                                        <svg
                                            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* JSON Debug View */}
                <details className="bg-white/25 backdrop-blur-2xl rounded-2xl shadow-lg border border-white/35 overflow-hidden">
                    <summary className="p-6 text-emerald-900 font-semibold text-lg cursor-pointer hover:bg-white/10 transition-colors">
                        Ver Dados da Sessão (Debug)
                    </summary>
                    <div className="p-6 pt-0 max-h-96 overflow-auto">
                        <pre className="text-xs text-emerald-800 font-mono bg-emerald-50/50 p-4 rounded-lg overflow-x-auto">
                            {JSON.stringify(session, null, 2)}
                        </pre>
                    </div>
                </details>
            </div>
        </div>
    );
}
