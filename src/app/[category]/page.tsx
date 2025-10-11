'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Theme {
  category: string;
  title: string;
  description: string;
}

const STAGES = [
  { key: 'opening', label: 'Abertura', description: 'Preparação inicial para a meditação' },
  { key: 'concentration', label: 'Concentração', description: 'Foco e estabilização mental' },
  { key: 'exploration', label: 'Exploração', description: 'Aprofundamento da prática' },
  { key: 'awakening', label: 'Despertar', description: 'Finalização e integração' },
];

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTheme() {
      try {
        const response = await fetch(`/api/categories`);
        const data = await response.json();
        
        if (data.success && data.categories) {
          const foundTheme = data.categories.find(
            (t: Theme) => t.category === category
          );
          setTheme(foundTheme || null);
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTheme();
  }, [category]);

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

  if (!theme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Categoria não encontrada</h1>
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-700 underline"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
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
          Voltar
        </Link>

        {/* Theme header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{theme.title}</h1>
          {theme.description && (
            <p className="text-lg text-gray-700">{theme.description}</p>
          )}
        </div>

        {/* Stages grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Escolha uma Etapa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STAGES.map((stage) => (
              <Link
                key={stage.key}
                href={`/${category}/${stage.key}`}
                className="group block p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {stage.label}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{stage.description}</p>
                <div className="flex items-center text-indigo-600 font-medium text-sm">
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
            ))}
          </div>
        </div>

        {/* Practice link */}
        <div className="text-center">
          <Link
            href={`/${category}/practice`}
            className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Iniciar Prática Completa
          </Link>
        </div>
      </div>
    </div>
  );
}
