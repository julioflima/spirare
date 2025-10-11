'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Variant {
  text: string;
  order: number;
  index: number;
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

export default function PracticePage() {
  const params = useParams();
  const category = params.category as string;
  const stage = params.stage as string;
  const practice = params.practice as string;
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [themeTitle, setThemeTitle] = useState('');

  useEffect(() => {
    async function fetchVariants() {
      try {
        const response = await fetch(`/api/database/themes`);
        const data = await response.json();
        
        if (data.success && data.themes) {
          const theme = data.themes.find((t: any) => t.category === category);
          if (theme) {
            setThemeTitle(theme.title);
            const practiceData = theme.meditations[stage]?.[practice];
            
            if (practiceData && Array.isArray(practiceData)) {
              const variantsList = practiceData.map((item: any, index: number) => ({
                text: item.text,
                order: item.order,
                index,
              }));
              setVariants(variantsList);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching variants:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVariants();
  }, [category, stage, practice]);

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

  const practiceLabel = PRACTICE_LABELS[stage]?.[practice] || practice.replace(/_/g, ' ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href={`/${category}/${stage}`}
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
          Voltar para {STAGE_LABELS[stage]}
        </Link>

        {/* Practice header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
              {themeTitle} · {STAGE_LABELS[stage]}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {practiceLabel}
          </h1>
          <p className="text-gray-600">
            {variants.length} {variants.length === 1 ? 'variante disponível' : 'variantes disponíveis'}
          </p>
        </div>

        {/* Variants list */}
        {variants.length === 0 ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <p className="text-gray-600 mb-4">
              Nenhuma variante disponível para esta prática.
            </p>
            <Link
              href={`/${category}/${stage}`}
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              Voltar para escolher outra prática
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {variants.map((variant) => (
              <Link
                key={variant.index}
                href={`/${category}/${stage}/${practice}/${variant.index}`}
                className="group block p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {variant.index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 line-clamp-3 group-hover:text-gray-900 transition-colors">
                      {variant.text}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
