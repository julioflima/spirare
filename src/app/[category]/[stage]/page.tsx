'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useThemesQuery } from '@/providers';

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

    // Use React Query provider
    const { data: themes, isLoading: loading } = useThemesQuery();

    // Compute practices from themes
    const { practices, themeTitle } = useMemo(() => {
        if (!themes) return { practices: [], themeTitle: '' };

        const theme = themes.find((t: any) => t.category === category);
        if (!theme) return { practices: [], themeTitle: '' };

        const stageData = theme.meditations?.[stage];
        if (!stageData) return { practices: [], themeTitle: theme.title };

        const practicesList: Practice[] = Object.entries(stageData)
            .map(([key, items]: [string, any]) => ({
                key,
                label: PRACTICE_LABELS[stage]?.[key] || key.replace(/_/g, ' '),
                itemsCount: Array.isArray(items) ? items.length : 0,
            }))
            .filter((p) => p.itemsCount > 0); // Only show practices with content

        return { practices: practicesList, themeTitle: theme.title };
    }, [themes, category, stage]);

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

    if (practices.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-emerald-800/70">Nenhuma prática encontrada para esta etapa</p>
                </div>
            </div>
        );
    }

    const stageLabel = STAGE_LABELS[stage] || stage;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] p-8">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <Link
                        href={`/${category}`}
                        className="text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                        ← Voltar para {themeTitle}
                    </Link>
                </div>

                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-emerald-900 mb-2">{stageLabel}</h1>
                    <p className="text-emerald-700/70">Selecione uma prática para continuar</p>
                </div>

                {/* Practices Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {practices.map((practice) => (
                        <Link
                            key={practice.key}
                            href={`/${category}/${stage}/${practice.key}`}
                            className="group block p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-emerald-200/50 hover:bg-white/60 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg"
                        >
                            <h3 className="text-xl font-semibold text-emerald-900 mb-2 group-hover:text-emerald-700 transition-colors">
                                {practice.label}
                            </h3>
                            <p className="text-sm text-emerald-700/60">
                                {practice.itemsCount} {practice.itemsCount === 1 ? 'variação' : 'variações'}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
