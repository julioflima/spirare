'use client';

import { useQuery } from '@tanstack/react-query';
import { Play, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Category {
  category: string;
  title: string;
  description: string;
}

async function fetchCategories(): Promise<Category[]> {
  const { ThemeService } = await import('@/services/themesService');
  const themes = await ThemeService.getAll();
  
  return themes.map((theme: any) => ({
    category: theme.category,
    title: theme.title,
    description: theme.description,
  }));
}

export function CategorySelector() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Load selected category from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('spirare-selected-category');
    if (saved && categories.some(c => c.category === saved)) {
      setSelectedCategory(saved);
    }
  }, [categories]);

  // Save selected category to localStorage when it changes
  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem('spirare-selected-category', selectedCategory);
    }
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center">
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
        <div className="text-center max-w-md">
          <div className="relative overflow-hidden rounded-[32px] border border-white/35 bg-white/25 p-10 shadow-[0_35px_80px_-40px_rgba(132,204,22,0.35)] backdrop-blur-2xl">
            <p className="text-emerald-800 mb-4">Nenhuma categoria disponível no momento.</p>
            <p className="text-sm text-emerald-700/70 mb-6">
              Por favor, popule o banco de dados através do painel administrativo.
            </p>
            <Link
              href="/admin"
              className="inline-block px-6 py-2 rounded-full border border-white/45 bg-white/35 text-emerald-800 font-semibold hover:bg-white/50 transition-all"
            >
              Painel Administrativo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedCategoryData = categories.find(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center px-6 py-10">
      <div className="max-w-md mx-auto text-center">
        <div className="relative overflow-hidden rounded-[32px] border border-white/35 bg-white/25 p-10 shadow-[0_35px_80px_-40px_rgba(132,204,22,0.35)] backdrop-blur-2xl">
          <span 
            className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-200/40 via-lime-200/35 to-amber-200/35 blur-3xl" 
            aria-hidden="true" 
          />
          <span 
            className="pointer-events-none absolute -bottom-32 -left-24 h-60 w-60 rounded-full bg-gradient-to-br from-white/45 via-emerald-100/35 to-amber-100/35 blur-3xl" 
            aria-hidden="true" 
          />

          <div className="mb-10 space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/35 px-4 py-1 text-xs font-semibold uppercase tracking-[0.38em] text-emerald-800/80">
              <Sparkles size={14} />
              Inicie Sua Jornada
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-emerald-900">
              Meditação Guiada Spirare
            </h1>
            <p className="text-emerald-700/80">
              Escolha uma categoria e inicie sua prática de presença iluminada.
            </p>
          </div>

          {/* Category selector */}
          <div className="mb-8 space-y-3">
            <label 
              htmlFor="category-select" 
              className="block text-sm font-medium text-emerald-800/90"
            >
              Categoria de Meditação
            </label>
            <select
              id="category-select"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full cursor-pointer rounded-xl border border-white/45 bg-white/45 px-4 py-3 text-emerald-900 backdrop-blur-xl transition-all hover:bg-white/55 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="">Selecione uma categoria...</option>
              {categories.map((category) => (
                <option key={category.category} value={category.category}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          {/* Play button - only show when category is selected */}
          {selectedCategory && selectedCategoryData && (
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
          )}

          {/* Admin link */}
          <div className="mt-8">
            <Link
              href="/admin"
              className="text-xs text-emerald-700/60 hover:text-emerald-800 underline transition-colors"
            >
              Painel Administrativo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
