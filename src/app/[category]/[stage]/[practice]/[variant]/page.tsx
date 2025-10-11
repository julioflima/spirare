'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useThemesQuery } from '@/providers';

interface VariantData {
    text: string;
    order: number;
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

export default function VariantPage() {
    const params = useParams();
    const category = params.category as string;
    const stage = params.stage as string;
    const practice = params.practice as string;
    const variantIndex = parseInt(params.variant as string);

    // Use React Query provider
    const { data: themes, isLoading: loading } = useThemesQuery();

    // Compute variant data from themes
    const { variant, totalVariants, themeTitle } = useMemo(() => {
        if (!themes) return { variant: null, totalVariants: 0, themeTitle: '' };

        const theme = themes.find((t: any) => t.category === category);
        if (!theme) return { variant: null, totalVariants: 0, themeTitle: '' };

        const practiceData = theme.meditations?.[stage]?.[practice];
        if (!practiceData || !Array.isArray(practiceData)) {
            return { variant: null, totalVariants: 0, themeTitle: theme.title };
        }

        return {
            variant: practiceData[variantIndex] || null,
            totalVariants: practiceData.length,
            themeTitle: theme.title,
        };
    }, [themes, category, stage, practice, variantIndex]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-emerald-800/70">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!variant) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-emerald-900 mb-4">Variante não encontrada</h1>
                    <Link
                        href={`/${category}/${stage}/${practice}`}
                        className="text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                    >
                        Voltar para a lista de variantes
                    </Link>
                </div>
            </div>
        );
    }

    const practiceLabel = PRACTICE_LABELS[stage]?.[practice] || practice.replace(/_/g, ' ');
    const hasPrevious = variantIndex > 0;
    const hasNext = variantIndex < totalVariants - 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] p-8">
            <div className="max-w-3xl mx-auto">
                {/* Back button */}
                <Link
                    href={`/${category}/${stage}/${practice}`}
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
                    Voltar para {practiceLabel}
                </Link>

                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-emerald-700/70">
                    <span>{themeTitle}</span>
                    <span className="mx-2">›</span>
                    <span>{STAGE_LABELS[stage]}</span>
                    <span className="mx-2">›</span>
                    <span>{practiceLabel}</span>
                    <span className="mx-2">›</span>
                    <span className="text-emerald-900 font-medium">Variante {variantIndex + 1}</span>
                </div>

                {/* Variant content */}
                <div className="bg-white/25 backdrop-blur-2xl rounded-3xl shadow-lg p-12 mb-8 border border-white/35">
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-2xl">
                            {variantIndex + 1}
                        </div>
                    </div>

                    <p className="text-xl leading-relaxed text-gray-800 text-center">
                        {variant.text}
                    </p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                    {hasPrevious ? (
                        <Link
                            href={`/${category}/${stage}/${practice}/${variantIndex - 1}`}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 text-gray-700 hover:text-indigo-600"
                        >
                            <svg
                                className="w-5 h-5"
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
                            <span>Anterior</span>
                        </Link>
                    ) : (
                        <div className="flex-1"></div>
                    )}

                    <div className="text-sm text-gray-600 font-medium">
                        {variantIndex + 1} de {totalVariants}
                    </div>

                    {hasNext ? (
                        <Link
                            href={`/${category}/${stage}/${practice}/${variantIndex + 1}`}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <span>Próxima</span>
                            <svg
                                className="w-5 h-5"
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
                        </Link>
                    ) : (
                        <div className="flex-1"></div>
                    )}
                </div>

                {/* Practice complete message */}
                {!hasNext && (
                    <div className="mt-8 text-center p-6 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-green-800 mb-4">
                            ✨ Você completou todas as variantes desta prática!
                        </p>
                        <Link
                            href={`/${category}/${stage}`}
                            className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Explorar outras práticas
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
