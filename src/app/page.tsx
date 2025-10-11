'use client';

import { useCategoriesQuery } from '@/providers';
import { Lock, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const { data: categories = [], isLoading } = useCategoriesQuery();

  // Set mounted state on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load selected category from localStorage on mount
  useEffect(() => {
    if (mounted) {
      const saved = localStorage.getItem('spirare-selected-category');
      if (saved && categories.some(c => c.category === saved)) {
        setSelectedCategory(saved);
      }
    }
  }, [mounted, categories]);

  // Save selected category to localStorage when it changes
  useEffect(() => {
    if (mounted && selectedCategory) {
      localStorage.setItem('spirare-selected-category', selectedCategory);
    }
  }, [mounted, selectedCategory]);

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
    <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] px-6 py-10">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {categories.map((category) => (
            <button
              key={category.category}
              onClick={() => setSelectedCategory(category.category)}
              className={`group relative overflow-hidden rounded-2xl border p-8 backdrop-blur-2xl transition-all duration-300 cursor-pointer ${selectedCategory === category.category
                  ? 'border-emerald-400/50 bg-white/40 shadow-[0_8px_30px_-8px_rgba(34,197,94,0.3)] scale-[1.02]'
                  : 'border-white/30 bg-white/20 shadow-[0_4px_20px_-4px_rgba(132,204,22,0.15)] hover:border-white/40 hover:bg-white/30 hover:shadow-[0_8px_30px_-8px_rgba(132,204,22,0.25)]'
                }`}
            >
              <span
                className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-200/30 via-lime-200/25 to-amber-200/25 blur-2xl"
                aria-hidden="true"
              />

              <h3 className={`relative text-lg font-medium transition-colors ${selectedCategory === category.category
                  ? 'text-emerald-800'
                  : 'text-emerald-900/80 group-hover:text-emerald-900'
                }`}>
                {category.title}
              </h3>
            </button>
          ))}
        </div>

        {/* Play button - only show when category is selected */}
        {selectedCategory && selectedCategoryData && (
          <div className="flex justify-center">
            <Link
              href={`/${selectedCategory}`}
              aria-label={`Começar meditação: ${selectedCategoryData.title}`}
              className="group relative mx-auto flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/55 bg-gradient-to-br from-white/55 via-emerald-100/45 to-amber-100/45 shadow-[0_30px_70px_-35px_rgba(34,197,94,0.45)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_42px_100px_-48px_rgba(132,204,22,0.58)]"
            >
              <span className="absolute inset-0 rounded-full bg-white/35 blur-3xl" aria-hidden="true" />
              <span className="absolute inset-6 rounded-full border border-white/55 bg-gradient-to-br from-white/70 via-emerald-50/25 to-transparent transition-all duration-500 group-hover:shadow-[inset_12px_12px_28px_rgba(78,205,196,0.28),inset_-14px_-14px_24px_rgba(255,255,255,0.7)]" />
              <span className="relative flex items-center justify-center text-emerald-900">
                <span className="flex h-16 w-16 items-center justify-center rounded-full text-emerald-900">
                  <Play size={32} className="drop-shadow-[0_6px_10px_rgba(14,116,144,0.25)]" />
                </span>
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}