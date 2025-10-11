'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Practice {
    key: string;
    label: string;
    itemsCount: number;
}

const STAGE_LABELS: Record<string, string> = {
    opening: 'Abertura',
    concentration: 'Concentração',
    exploration: 'Exploração',
    awakening: 'Despertar',
};

const PRACTICE_LABELS: Record<string, Record<string, string>> = {
    opening: {
        psychoeducation: 'Psicoeducação',
        intention: 'Intenção',
        posture_and_environment: 'Postura e Ambiente',
        initial_breathing: 'Respiração Inicial',
        attention_orientation: 'Orientação da Atenção',
    },
    concentration: {
        guided_breathing_rhythm: 'Ritmo de Respiração Guiada',
        progressive_body_relaxation: 'Relaxamento Corporal Progressivo',
        non_judgmental_observation: 'Observação Sem Julgamento',
        functional_silence: 'Silêncio Funcional',
    },
    exploration: {
        main_focus: 'Foco Principal',
        narrative_guidance_or_visualization: 'Orientação Narrativa ou Visualização',
        subtle_reflection_or_insight: 'Reflexão Sutil ou Insight',
        emotional_integration: 'Integração Emocional',
    },
    awakening: {
        body_reorientation: 'Reorientação Corporal',
        final_breathing: 'Respiração Final',
        intention_for_the_rest_of_the_day: 'Intenção para o Resto do Dia',
        closing: 'Encerramento',
    },
};

export default function StagePage() {
    const params = useParams();
    const category = params.category as string;
    const stage = params.stage as string;
    const [practices, setPractices] = useState<Practice[]>([]);
    const [loading, setLoading] = useState(true);
    const [themeTitle, setThemeTitle] = useState('');

    useEffect(() => {
        async function fetchPractices() {
            try {
                // Fetch theme to get available practices
                const response = await fetch(`/api/database/themes`);
                const data = await response.json();

                if (data.success && data.themes) {
                    const theme = data.themes.find((t: any) => t.category === category);
                    if (theme) {
                        setThemeTitle(theme.title);
                        const stageData = theme.meditations[stage];

                        if (stageData) {
                            const practicesList: Practice[] = Object.entries(stageData)
                                .map(([key, items]: [string, any]) => ({
                                    key,
                                    label: PRACTICE_LABELS[stage]?.[key] || key.replace(/_/g, ' '),
                                    itemsCount: Array.isArray(items) ? items.length : 0,
                                }))
                                .filter((p) => p.itemsCount > 0); // Only show practices with content

                            setPractices(practicesList);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching practices:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPractices();
    }, [category, stage]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <Link
                    href={`/${category}`}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
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
                    Voltar para {themeTitle}
                </Link>

                {/* Stage header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
                            {themeTitle}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">
                        {STAGE_LABELS[stage] || stage}
                    </h1>
                </div>

                {/* Practices grid */}
                {practices.length === 0 ? (
                    <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                        <p className="text-gray-600 mb-4">
                            Nenhuma prática disponível para esta etapa.
                        </p>
                        <Link
                            href={`/${category}`}
                            className="text-indigo-600 hover:text-indigo-700 underline"
                        >
                            Voltar para escolher outra etapa
                        </Link>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            Escolha uma Prática
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {practices.map((practice) => (
                                <Link
                                    key={practice.key}
                                    href={`/${category}/${stage}/${practice.key}`}
                                    className="group block p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200"
                                >
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {practice.label}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {practice.itemsCount} {practice.itemsCount === 1 ? 'variante' : 'variantes'} disponíveis
                                    </p>
                                    <div className="flex items-center text-indigo-600 font-medium text-sm">
                                        <span>Explorar</span>
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
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
