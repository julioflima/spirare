'use client';

import { useState, useEffect } from 'react';
import type { Meditation } from '@/types/meditation';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [meditation, setMeditation] = useState<Meditation>({
    tema: '',
    etapas: [],
    congratulacaoFinal: '',
  });

  // Load meditation data
  useEffect(() => {
    async function loadMeditation() {
      try {
        const response = await fetch('/api/meditation');
        if (response.ok) {
          const data = await response.json();
          setMeditation(data.meditation);
        } else {
          setMessage({ type: 'error', text: 'Erro ao carregar dados da meditação' });
        }
      } catch {
        setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
      } finally {
        setIsLoading(false);
      }
    }

    loadMeditation();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/meditation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meditation }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Meditação salva com sucesso!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Erro ao salvar' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
    } finally {
      setIsSaving(false);
    }
  };

  const addEtapa = () => {
    setMeditation(prev => ({
      ...prev,
      etapas: [
        ...prev.etapas,
        {
          nome: '',
          introducao: '',
          encerramento: '',
          trilha: {
            title: '',
            artist: '',
            src: '',
            fadeInMs: 2000,
            fadeOutMs: 2000,
            volume: 0.3,
          },
          subetapas: [''],
        },
      ],
    }));
  };

  const removeEtapa = (index: number) => {
    setMeditation(prev => ({
      ...prev,
      etapas: prev.etapas.filter((_, i) => i !== index),
    }));
  };

  const updateEtapa = (index: number, field: string, value: string) => {
    setMeditation(prev => ({
      ...prev,
      etapas: prev.etapas.map((etapa, i) => 
        i === index ? { ...etapa, [field]: value } : etapa
      ),
    }));
  };

  const updateTrilha = (etapaIndex: number, field: string, value: string | number) => {
    setMeditation(prev => ({
      ...prev,
      etapas: prev.etapas.map((etapa, i) => 
        i === etapaIndex 
          ? { ...etapa, trilha: { ...etapa.trilha, [field]: value } }
          : etapa
      ),
    }));
  };

  const addSubetapa = (etapaIndex: number) => {
    setMeditation(prev => ({
      ...prev,
      etapas: prev.etapas.map((etapa, i) => 
        i === etapaIndex 
          ? { ...etapa, subetapas: [...etapa.subetapas, ''] }
          : etapa
      ),
    }));
  };

  const removeSubetapa = (etapaIndex: number, subetapaIndex: number) => {
    setMeditation(prev => ({
      ...prev,
      etapas: prev.etapas.map((etapa, i) => 
        i === etapaIndex 
          ? { ...etapa, subetapas: etapa.subetapas.filter((_, j) => j !== subetapaIndex) }
          : etapa
      ),
    }));
  };

  const updateSubetapa = (etapaIndex: number, subetapaIndex: number, value: string) => {
    setMeditation(prev => ({
      ...prev,
      etapas: prev.etapas.map((etapa, i) => 
        i === etapaIndex 
          ? { 
              ...etapa, 
              subetapas: etapa.subetapas.map((sub, j) => j === subetapaIndex ? value : sub)
            }
          : etapa
      ),
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-lg text-emerald-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-emerald-800 mb-6">Admin - Editor de Meditação</h1>

          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            {/* Tema */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema da Meditação
              </label>
              <input
                type="text"
                value={meditation.tema}
                onChange={(e) => setMeditation(prev => ({ ...prev, tema: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ex: Meditação de Respiração Consciente"
              />
            </div>

            {/* Congratulação Final */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Congratulação Final
              </label>
              <textarea
                value={meditation.congratulacaoFinal}
                onChange={(e) => setMeditation(prev => ({ ...prev, congratulacaoFinal: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Mensagem de congratulação ao final da meditação..."
              />
            </div>

            {/* Etapas */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Etapas</h2>
                <button
                  type="button"
                  onClick={addEtapa}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Adicionar Etapa
                </button>
              </div>

              {meditation.etapas.map((etapa, etapaIndex) => (
                <div key={etapaIndex} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Etapa {etapaIndex + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeEtapa(etapaIndex)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      Remover
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Nome */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <input
                        type="text"
                        value={etapa.nome}
                        onChange={(e) => updateEtapa(etapaIndex, 'nome', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Ex: Preparação"
                      />
                    </div>

                    {/* Trilha - Título */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título da Trilha</label>
                      <input
                        type="text"
                        value={etapa.trilha.title}
                        onChange={(e) => updateTrilha(etapaIndex, 'title', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Ex: Ambient Waves"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Trilha - Artista */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Artista</label>
                      <input
                        type="text"
                        value={etapa.trilha.artist}
                        onChange={(e) => updateTrilha(etapaIndex, 'artist', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Ex: Nature Sounds"
                      />
                    </div>

                    {/* Trilha - URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL do Áudio</label>
                      <input
                        type="text"
                        value={etapa.trilha.src}
                        onChange={(e) => updateTrilha(etapaIndex, 'src', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="/audio/exemplo.mp3"
                      />
                    </div>

                    {/* Trilha - Volume */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Volume (0-1)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={etapa.trilha.volume || 0.3}
                        onChange={(e) => updateTrilha(etapaIndex, 'volume', parseFloat(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="0.3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Fade In */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fade In (ms)</label>
                      <input
                        type="number"
                        min="0"
                        value={etapa.trilha.fadeInMs || 2000}
                        onChange={(e) => updateTrilha(etapaIndex, 'fadeInMs', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="2000"
                      />
                    </div>

                    {/* Fade Out */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fade Out (ms)</label>
                      <input
                        type="number"
                        min="0"
                        value={etapa.trilha.fadeOutMs || 2000}
                        onChange={(e) => updateTrilha(etapaIndex, 'fadeOutMs', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="2000"
                      />
                    </div>
                  </div>

                  {/* Introdução */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Introdução</label>
                    <textarea
                      value={etapa.introducao}
                      onChange={(e) => updateEtapa(etapaIndex, 'introducao', e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Texto de introdução da etapa..."
                    />
                  </div>

                  {/* Encerramento */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Encerramento</label>
                    <textarea
                      value={etapa.encerramento}
                      onChange={(e) => updateEtapa(etapaIndex, 'encerramento', e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Texto de encerramento da etapa..."
                    />
                  </div>

                  {/* Subetapas */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Subetapas</label>
                      <button
                        type="button"
                        onClick={() => addSubetapa(etapaIndex)}
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                      >
                        Adicionar Subetapa
                      </button>
                    </div>

                    {etapa.subetapas.map((subetapa, subetapaIndex) => (
                      <div key={subetapaIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={subetapa}
                          onChange={(e) => updateSubetapa(etapaIndex, subetapaIndex, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder={`Subetapa ${subetapaIndex + 1}...`}
                        />
                        <button
                          type="button"
                          onClick={() => removeSubetapa(etapaIndex, subetapaIndex)}
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Salvando...' : 'Salvar Meditação'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}