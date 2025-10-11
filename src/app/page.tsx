'use client';

import { useCategoriesQuery } from '@/providers';
import { Lock, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useCategoriesQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center">
        <Link
          href="/admin"
          className="fixed top-6 right-6 z-50 opacity-30 hover:opacity-100 transition-opacity duration-300"
          aria-label="Acessar painel administrativo"
        >
          <Lock size={18} className="text-emerald-700/60" />
        </Link>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700/80">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center px-6">
        <Link
          href="/admin"
          className="fixed top-6 right-6 z-50 opacity-30 hover:opacity-100 transition-opacity duration-300"
          aria-label="Acessar painel administrativo"
        >
          <Lock size={18} className="text-emerald-700/60" />
        </Link>
        <div className="text-center max-w-md">
          <div className="relative overflow-hidden rounded-[32px] border border-white/35 bg-white/25 p-10 shadow-[0_35px_80px_-40px_rgba(132,204,22,0.35)] backdrop-blur-2xl">
            <p className="text-emerald-800 mb-4">Nenhuma categoria disponível no momento.</p>
            <p className="text-sm text-emerald-700/70">
              Por favor, popule o banco de dados através do painel administrativo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedCategoryData = categories.find(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] px-6 py-10 pb-[280px]">
      {/* Admin lock icon - discrete in top right corner */}
      <Link
        href="/admin"
        className="fixed top-6 right-6 z-50 opacity-30 hover:opacity-100 transition-opacity duration-300"
        aria-label="Acessar painel administrativo"
      >
        <Lock size={18} className="text-emerald-700/60" />
      </Link>

      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-10 space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/35 px-4 py-1 text-xs font-semibold uppercase tracking-[0.38em] text-emerald-800/80 backdrop-blur-xl">
            <Sparkles size={14} />
            Inicie Sua Jornada
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-emerald-900">
            Meditação Guiada Spirare
          </h1>
          <p className="text-emerald-700/80">
            Escolha uma categoria e inicie sua prática de presença iluminada.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...categories, ...categories, ...categories, ...categories].map(((category, index) => ({ ...category, category: category.category + index }))).map((category) => (
            <button
              key={category.category}
              onClick={() => setSelectedCategory(category.category)}
              className={`group relative overflow-hidden rounded-2xl p-8 backdrop-blur-3xl backdrop-saturate-150 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer ${selectedCategory === category.category
                ? 'scale-[1.02]'
                : 'hover:backdrop-saturate-[180%] hover:scale-[1.01]'
                }`}
              style={{
                border: '2px solid transparent',
                background: selectedCategory === category.category
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.45)), linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(52,211,153,0.4) 25%, rgba(16,185,129,0.35) 50%, rgba(251,191,36,0.4) 75%, rgba(255,255,255,0.85) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.15)), linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.4) 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                boxShadow: selectedCategory === category.category
                  ? '0 35px 80px -40px rgba(34,197,94,0.5), inset 0 1px 0 0 rgba(255,255,255,0.8), inset 0 -1px 0 0 rgba(255,255,255,0.3)'
                  : '0 4px 20px -4px rgba(132,204,22,0.15), inset 0 1px 0 0 rgba(255,255,255,0.4)'
              }}
            >
              {/* Multi-layer liquid glow for selected state */}
              {selectedCategory === category.category && (
                <>
                  <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-200/40 via-cyan-200/30 to-blue-200/40 blur-3xl animate-pulse" aria-hidden="true" />
                  <span className="pointer-events-none absolute inset-0 rounded-2xl bg-white/40 blur-2xl opacity-60" aria-hidden="true" />
                  {/* Inner highlight */}
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/60 to-transparent" aria-hidden="true" />
                </>
              )}

              {/* Subtle glow for non-selected */}
              {selectedCategory !== category.category && (
                <>
                  <span className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-200/30 via-lime-200/25 to-amber-200/25 blur-2xl transition-opacity duration-500 group-hover:opacity-80" aria-hidden="true" />
                  {/* Inner highlight on hover */}
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
                </>
              )}

              <h3 className={`relative text-lg font-medium transition-all duration-500 ${selectedCategory === category.category
                ? 'text-emerald-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]'
                : 'text-emerald-900/80 group-hover:text-emerald-900'
                }`}>
                {category.title}
              </h3>
            </button>
          ))}
        </div>

      </div>

      {/* Play button - fixed at bottom, only show when category is selected */}
      {selectedCategory && selectedCategoryData && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-40 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Link
            href={`/${selectedCategory}`}
            aria-label={`Começar meditação: ${selectedCategoryData.title}`}
            className="group relative flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/40 bg-gradient-to-br from-white/20 via-cyan-100/15 to-blue-100/15 shadow-[0_30px_70px_-35px_rgba(6,182,212,0.35)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.08] hover:shadow-[0_42px_100px_-48px_rgba(6,182,212,0.45)] active:scale-[0.98] animate-[bounce_2s_ease-in-out_3]"
          >
            {/* Multi-layer animated liquid glow */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-200/15 via-blue-200/10 to-teal-200/15 blur-3xl animate-pulse" aria-hidden="true" />
            <span className="absolute inset-0 rounded-full bg-white/20 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} aria-hidden="true" />

            {/* Inner liquid glass ring */}
            <span className="absolute inset-6 rounded-full border border-white/40 bg-gradient-to-br from-white/30 via-cyan-50/15 to-transparent transition-all duration-500 group-hover:shadow-[inset_8px_8px_20px_rgba(78,205,196,0.15),inset_-10px_-10px_18px_rgba(255,255,255,0.5)]" />

            {/* Icon */}
            <span className="relative flex items-center justify-center text-cyan-800 transition-transform duration-500 group-hover:scale-110">
              <span className="flex h-16 w-16 items-center justify-center rounded-full">
                <Play size={32} className="drop-shadow-[0_4px_8px_rgba(14,116,144,0.2)] transition-all duration-300 group-hover:drop-shadow-[0_6px_10px_rgba(14,116,144,0.25)]" />
              </span>
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}