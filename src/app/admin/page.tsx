'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Audio, Theme, StructureItem, Meditations } from '@/types/database';

interface AdminData {
    meditations: Meditations | null;
    structure: StructureItem[];
    themes: Theme[];
    audios: Audio[];
}

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [data, setData] = useState<AdminData>({
        meditations: null,
        structure: [],
        themes: [],
        audios: []
    });
    const [activeTab, setActiveTab] = useState<'meditations' | 'structure' | 'themes' | 'audios'>('meditations');

    // Load all collections
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [meditationsRes, structureRes, themesRes, audiosRes] = await Promise.all([
                fetch('/api/meditations'),
                fetch('/api/structure'),
                fetch('/api/database/themes'),
                fetch('/api/database/audios')
            ]);

            if (meditationsRes.ok && structureRes.ok && themesRes.ok && audiosRes.ok) {
                const [meditationsData, structureData, themesData, audiosData] = await Promise.all([
                    meditationsRes.json(),
                    structureRes.json(),
                    themesRes.json(),
                    audiosRes.json()
                ]);

                setData({
                    meditations: meditationsData.meditations,
                    structure: structureData.structures,
                    themes: themesData.themes,
                    audios: audiosData.audios
                });
            } else {
                setMessage({ type: 'error', text: 'Erro ao carregar dados' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
        } finally {
            setIsLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleCreateTheme = async (theme: Omit<Theme, '_id' | 'createdAt' | 'updatedAt'>) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/database/themes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(theme),
            });

            if (response.ok) {
                const result = await response.json();
                setData(prev => ({ ...prev, themes: [...prev.themes, result.theme] }));
                showMessage('success', 'Tema criado com sucesso!');
            } else {
                const error = await response.json();
                showMessage('error', error.message || 'Erro ao criar tema');
            }
        } catch {
            showMessage('error', 'Erro ao conectar com o servidor');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteTheme = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este tema?')) return;

        setIsSaving(true);
        try {
            const response = await fetch(`/api/database/themes/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setData(prev => ({
                    ...prev,
                    themes: prev.themes.filter(theme => theme._id !== id)
                }));
                showMessage('success', 'Tema excluído com sucesso!');
            } else {
                const error = await response.json();
                showMessage('error', error.message || 'Erro ao excluir tema');
            }
        } catch {
            showMessage('error', 'Erro ao conectar com o servidor');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateAudio = async (audio: Omit<Audio, '_id' | 'createdAt' | 'updatedAt'>) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/database/audios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(audio),
            });

            if (response.ok) {
                const result = await response.json();
                setData(prev => ({ ...prev, audios: [...prev.audios, result.audio] }));
                showMessage('success', 'Áudio criado com sucesso!');
            } else {
                const error = await response.json();
                showMessage('error', error.message || 'Erro ao criar áudio');
            }
        } catch {
            showMessage('error', 'Erro ao conectar com o servidor');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAudio = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este áudio?')) return;

        setIsSaving(true);
        try {
            const response = await fetch(`/api/database/audios/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setData(prev => ({
                    ...prev,
                    audios: prev.audios.filter(audio => audio._id !== id)
                }));
                showMessage('success', 'Áudio excluído com sucesso!');
            } else {
                const error = await response.json();
                showMessage('error', error.message || 'Erro ao excluir áudio');
            }
        } catch {
            showMessage('error', 'Erro ao conectar com o servidor');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando painel administrativo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Painel Administrativo
                    </h1>
                    <p className="text-gray-600">Gerencie o conteúdo da aplicação de meditação</p>
                    <div className="mt-4 space-x-4">
                        <Link
                            href="/superadmin"
                            className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            🚨 Super Admin
                        </Link>
                        <Link
                            href="/"
                            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            ← Voltar ao App
                        </Link>
                    </div>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { key: 'meditations', label: 'Meditações' },
                                { key: 'structure', label: 'Estrutura' },
                                { key: 'themes', label: 'Temas' },
                                { key: 'audios', label: 'Áudios' },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.key
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    {activeTab === 'meditations' && (
                        <MeditationsTab meditations={data.meditations} />
                    )}
                    {activeTab === 'structure' && (
                        <StructureTab structure={data.structure} />
                    )}
                    {activeTab === 'themes' && (
                        <ThemesTab
                            themes={data.themes}
                            onCreate={handleCreateTheme}
                            onDelete={handleDeleteTheme}
                            isSaving={isSaving}
                        />
                    )}
                    {activeTab === 'audios' && (
                        <AudiosTab
                            audios={data.audios}
                            onCreate={handleCreateAudio}
                            onDelete={handleDeleteAudio}
                            isSaving={isSaving}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

// Meditations Tab Component
function MeditationsTab({ meditations }: { meditations: Meditations | null }) {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Conteúdo das Meditações</h2>
            {meditations ? (
                <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                        Sistema de meditações carregado com sucesso
                    </div>
                    {Object.entries(meditations).map(([phase, content]) => {
                        if (phase.startsWith('_') || phase === 'createdAt' || phase === 'updatedAt') return null;
                        return (
                            <div key={phase} className="border rounded-lg p-4">
                                <h3 className="text-lg font-medium mb-2 capitalize">{phase}</h3>
                                <div className="text-sm text-gray-600">
                                    {Object.keys(content).length} seções configuradas
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-500">Nenhum conteúdo de meditação encontrado</p>
            )}
        </div>
    );
}

// Structure Tab Component
function StructureTab({ structure }: { structure: StructureItem[] }) {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Estrutura das Meditações</h2>
            <div className="space-y-4">
                {structure.map((item, index) => (
                    <div key={item._id?.toString() || index} className="border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Estrutura {index + 1}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Abertura:</span> {item.opening?.length || 0} itens
                            </div>
                            <div>
                                <span className="font-medium">Concentração:</span> {item.concentration?.length || 0} itens
                            </div>
                            <div>
                                <span className="font-medium">Exploração:</span> {item.exploration?.length || 0} itens
                            </div>
                            <div>
                                <span className="font-medium">Despertar:</span> {item.awakening?.length || 0} itens
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {structure.length === 0 && (
                <p className="text-gray-500 text-center py-8">Nenhuma estrutura encontrada</p>
            )}
        </div>
    );
}

// Themes Tab Component
function ThemesTab({
    themes,
    onCreate,
    onDelete,
    isSaving
}: {
    themes: Theme[];
    onCreate: (theme: Omit<Theme, '_id' | 'createdAt' | 'updatedAt'>) => void;
    onDelete: (id: string) => void;
    isSaving: boolean;
}) {
    const [showForm, setShowForm] = useState(false);
    const [newTheme, setNewTheme] = useState({
        category: '',
        title: '',
        description: '',
        structure: {},
        isActive: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(newTheme);
        setNewTheme({ category: '', title: '', description: '', structure: {}, isActive: true });
        setShowForm(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Temas</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                    {showForm ? 'Cancelar' : 'Adicionar Tema'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Categoria"
                            value={newTheme.category}
                            onChange={(e) => setNewTheme(prev => ({ ...prev, category: e.target.value }))}
                            className="p-2 border rounded-md"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Título"
                            value={newTheme.title}
                            onChange={(e) => setNewTheme(prev => ({ ...prev, title: e.target.value }))}
                            className="p-2 border rounded-md"
                            required
                        />
                    </div>
                    <textarea
                        placeholder="Descrição"
                        value={newTheme.description}
                        onChange={(e) => setNewTheme(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full mt-4 p-2 border rounded-md"
                        rows={3}
                    />
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="mt-4 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                        {isSaving ? 'Criando...' : 'Criar Tema'}
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {themes.map((theme) => (
                    <div key={theme._id?.toString()} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-medium">{theme.title}</h3>
                                    <span className={`px-2 py-1 rounded text-xs ${theme.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {theme.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">Categoria: {theme.category}</p>
                                {theme.description && (
                                    <p className="text-sm text-gray-700">{theme.description}</p>
                                )}
                            </div>
                            <button
                                onClick={() => theme._id && onDelete(theme._id.toString())}
                                disabled={isSaving}
                                className="ml-4 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {themes.length === 0 && (
                <p className="text-gray-500 text-center py-8">Nenhum tema encontrado</p>
            )}
        </div>
    );
}

// Audios Tab Component
function AudiosTab({
    audios,
    onCreate,
    onDelete,
    isSaving
}: {
    audios: Audio[];
    onCreate: (audio: Omit<Audio, '_id' | 'createdAt' | 'updatedAt'>) => void;
    onDelete: (id: string) => void;
    isSaving: boolean;
}) {
    const [showForm, setShowForm] = useState(false);
    const [newAudio, setNewAudio] = useState({
        title: '',
        artist: '',
        src: '',
        fadeInMs: 0,
        fadeOutMs: 0,
        volume: 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(newAudio);
        setNewAudio({ title: '', artist: '', src: '', fadeInMs: 0, fadeOutMs: 0, volume: 1 });
        setShowForm(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Áudios</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                    {showForm ? 'Cancelar' : 'Adicionar Áudio'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Título"
                            value={newAudio.title}
                            onChange={(e) => setNewAudio(prev => ({ ...prev, title: e.target.value }))}
                            className="p-2 border rounded-md"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Artista"
                            value={newAudio.artist}
                            onChange={(e) => setNewAudio(prev => ({ ...prev, artist: e.target.value }))}
                            className="p-2 border rounded-md"
                            required
                        />
                    </div>
                    <input
                        type="url"
                        placeholder="URL do áudio"
                        value={newAudio.src}
                        onChange={(e) => setNewAudio(prev => ({ ...prev, src: e.target.value }))}
                        className="w-full mt-4 p-2 border rounded-md"
                        required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <input
                            type="number"
                            placeholder="Fade In (ms)"
                            value={newAudio.fadeInMs}
                            onChange={(e) => setNewAudio(prev => ({ ...prev, fadeInMs: Number(e.target.value) }))}
                            className="p-2 border rounded-md"
                            min="0"
                        />
                        <input
                            type="number"
                            placeholder="Fade Out (ms)"
                            value={newAudio.fadeOutMs}
                            onChange={(e) => setNewAudio(prev => ({ ...prev, fadeOutMs: Number(e.target.value) }))}
                            className="p-2 border rounded-md"
                            min="0"
                        />
                        <input
                            type="number"
                            placeholder="Volume (0-1)"
                            value={newAudio.volume}
                            onChange={(e) => setNewAudio(prev => ({ ...prev, volume: Number(e.target.value) }))}
                            className="p-2 border rounded-md"
                            min="0"
                            max="1"
                            step="0.1"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                        {isSaving ? 'Criando...' : 'Criar Áudio'}
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {audios.map((audio) => (
                    <div key={audio._id?.toString()} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-medium">{audio.title}</h3>
                                    <span className="text-sm text-gray-500">Vol: {audio.volume}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">Artista: {audio.artist}</p>
                                <p className="text-sm text-gray-600 mb-2">URL: {audio.src}</p>
                                <div className="text-xs text-gray-500">
                                    Fade In: {audio.fadeInMs}ms | Fade Out: {audio.fadeOutMs}ms
                                </div>
                            </div>
                            <button
                                onClick={() => audio._id && onDelete(audio._id.toString())}
                                disabled={isSaving}
                                className="ml-4 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {audios.length === 0 && (
                <p className="text-gray-500 text-center py-8">Nenhum áudio encontrado</p>
            )}
        </div>
    );
}