'use client';

import { useState, useEffect } from 'react';
import { MeditationDatabase, Audio, Theme } from '@/types/database';

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [database, setDatabase] = useState<MeditationDatabase | null>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'structure' | 'themes' | 'audios'>('general');

    // Load database
    useEffect(() => {
        async function loadDatabase() {
            try {
                const response = await fetch('/api/database');
                if (response.ok) {
                    const data = await response.json();
                    setDatabase(data.database);
                } else {
                    setMessage({ type: 'error', text: 'Erro ao carregar base de dados' });
                }
            } catch {
                setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
            } finally {
                setIsLoading(false);
            }
        }

        loadDatabase();
    }, []);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleSeedDatabase = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/database/seed', { method: 'POST' });
            const data = await response.json();
            
            if (response.ok) {
                showMessage('success', 'Base de dados populada com sucesso!');
                // Reload database
                const dbResponse = await fetch('/api/database');
                if (dbResponse.ok) {
                    const dbData = await dbResponse.json();
                    setDatabase(dbData.database);
                }
            } else {
                showMessage('error', data.error || 'Erro ao popular base de dados');
            }
        } catch {
            showMessage('error', 'Erro ao conectar com o servidor');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="text-stone-600">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-stone-900 mb-2">
                        Administração Spirare
                    </h1>
                    <p className="text-stone-600">
                        Gerencie o conteúdo e estrutura das meditações
                    </p>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        message.type === 'success' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                        {message.text}
                    </div>
                )}

                {/* Seed Database Button */}
                <div className="mb-8">
                    <button
                        onClick={handleSeedDatabase}
                        disabled={isSaving}
                        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                        {isSaving ? 'Populando...' : 'Popular Base de Dados'}
                    </button>
                    <p className="text-sm text-stone-600 mt-2">
                        Carrega dados iniciais do arquivo db.json
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <nav className="flex space-x-8">
                        {[
                            { key: 'general', label: 'Conteúdo Geral' },
                            { key: 'structure', label: 'Estrutura' },
                            { key: 'themes', label: 'Temas' },
                            { key: 'audios', label: 'Áudios' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.key
                                        ? 'border-emerald-500 text-emerald-600'
                                        : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                {database && (
                    <div className="bg-white rounded-lg shadow-sm border border-stone-200">
                        {activeTab === 'general' && (
                            <GeneralContentTab database={database} onUpdate={setDatabase} />
                        )}
                        {activeTab === 'structure' && (
                            <StructureTab database={database} onUpdate={setDatabase} />
                        )}
                        {activeTab === 'themes' && (
                            <ThemesTab database={database} onUpdate={setDatabase} />
                        )}
                        {activeTab === 'audios' && (
                            <AudiosTab database={database} onUpdate={setDatabase} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// General Content Tab Component
function GeneralContentTab({ database, onUpdate }: { 
    database: MeditationDatabase; 
    onUpdate: (db: MeditationDatabase) => void;
}) {
    return (
        <div className="p-6">
            <h2 className="text-xl font-medium text-stone-900 mb-4">Conteúdo Geral</h2>
            <div className="space-y-6">
                {Object.entries(database.general).map(([phase, phaseContent]) => (
                    <div key={phase} className="border border-stone-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-stone-800 mb-3 capitalize">
                            {phase.replace('_', ' ')}
                        </h3>
                        <div className="grid gap-4">
                            {Object.entries(phaseContent).map(([contentType, items]) => (
                                <div key={contentType} className="space-y-2">
                                    <label className="block text-sm font-medium text-stone-700 capitalize">
                                        {contentType.replace(/_/g, ' ')}
                                    </label>
                                    <div className="text-sm text-stone-600">
                                        {Array.isArray(items) ? `${items.length} items` : 'Não é array'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Structure Tab Component
function StructureTab({ database, onUpdate }: { 
    database: MeditationDatabase; 
    onUpdate: (db: MeditationDatabase) => void;
}) {
    return (
        <div className="p-6">
            <h2 className="text-xl font-medium text-stone-900 mb-4">Estrutura das Fases</h2>
            <div className="space-y-4">
                {Object.entries(database.structure).map(([phase, items]) => (
                    <div key={phase} className="border border-stone-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-stone-800 mb-3 capitalize">
                            {phase}
                        </h3>
                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <span className="text-sm text-stone-600">{index + 1}.</span>
                                    <span className="text-sm">{item.replace(/_/g, ' ')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Themes Tab Component
function ThemesTab({ database, onUpdate }: { 
    database: MeditationDatabase; 
    onUpdate: (db: MeditationDatabase) => void;
}) {
    return (
        <div className="p-6">
            <h2 className="text-xl font-medium text-stone-900 mb-4">Temas de Meditação</h2>
            {database.themes.length === 0 ? (
                <p className="text-stone-600">Nenhum tema encontrado.</p>
            ) : (
                <div className="space-y-4">
                    {database.themes.map((theme, index) => (
                        <div key={index} className="border border-stone-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-medium text-stone-800">
                                    {theme.title}
                                </h3>
                                <span className="text-sm bg-stone-100 text-stone-600 px-2 py-1 rounded">
                                    {theme.category}
                                </span>
                            </div>
                            {theme.description && (
                                <p className="text-stone-600 text-sm mb-2">{theme.description}</p>
                            )}
                            <div className="text-sm text-stone-500">
                                Estrutura personalizada: {theme.structure ? 'Sim' : 'Não'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Audios Tab Component
function AudiosTab({ database, onUpdate }: { 
    database: MeditationDatabase; 
    onUpdate: (db: MeditationDatabase) => void;
}) {
    return (
        <div className="p-6">
            <h2 className="text-xl font-medium text-stone-900 mb-4">Áudios de Fundo</h2>
            {database.audios.length === 0 ? (
                <p className="text-stone-600">Nenhum áudio encontrado.</p>
            ) : (
                <div className="space-y-4">
                    {database.audios.map((audio, index) => (
                        <div key={index} className="border border-stone-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-medium text-stone-800">
                                    {audio.title}
                                </h3>
                                <span className="text-sm text-stone-600">
                                    {audio.artist}
                                </span>
                            </div>
                            <div className="text-sm text-stone-600 space-y-1">
                                <div>Fonte: {audio.src}</div>
                                {audio.volume && <div>Volume: {(audio.volume * 100).toFixed(0)}%</div>}
                                {audio.fadeInMs && <div>Fade In: {audio.fadeInMs}ms</div>}
                                {audio.fadeOutMs && <div>Fade Out: {audio.fadeOutMs}ms</div>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}