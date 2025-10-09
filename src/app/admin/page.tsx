'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Audio, Theme, Structure, Meditations } from '@/types/database';

interface AdminData {
    meditations: Meditations | null;
    structure: Structure | null;
    themes: Theme[];
    audios: Audio[];
}

const createEmptyMeditations = (): Theme['meditations'] => ({
    opening: {
        psychoeducation: [],
        intention: [],
        posture_and_environment: [],
        initial_breathing: [],
        attention_orientation: []
    },
    concentration: {
        guided_breathing_rhythm: [],
        progressive_body_relaxation: [],
        non_judgmental_observation: [],
        functional_silence: []
    },
    exploration: {
        main_focus: [],
        narrative_guidance_or_visualization: [],
        subtle_reflection_or_insight: [],
        emotional_integration: []
    },
    awakening: {
        body_reorientation: [],
        final_breathing: [],
        intention_for_the_rest_of_the_day: [],
        closing: []
    }
});

const createInitialTheme = (): Omit<Theme, '_id' | 'createdAt' | 'updatedAt'> => ({
    category: '',
    title: '',
    description: '',
    isActive: true,
    meditations: createEmptyMeditations()
});

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [data, setData] = useState<AdminData>({
        meditations: null,
        structure: null,
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
                fetch('/api/database/meditations'),
                fetch('/api/database/structure'),
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
                    structure: structureData.structure,
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
                            href="/super-admin"
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
                    <div className="border-b border-gray-300">
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
                                        ? 'border-indigo-600 text-indigo-700'
                                        : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-400'
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
                            structure={data.structure}
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

// Modal Component
function Modal({ 
    isOpen, 
    onClose, 
    title, 
    children 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Meditations Tab Component
function MeditationsTab({ meditations: initialMeditations }: { meditations: Meditations | null }) {
    const [meditations, setMeditations] = useState<Meditations | null>(initialMeditations);
    const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<{ phase: string; section: string; index: number } | null>(null);
    const [editText, setEditText] = useState('');
    const [showAddModal, setShowAddModal] = useState<{ phase: string; section: string } | null>(null);
    const [newMeditationText, setNewMeditationText] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Update local state when prop changes
    useEffect(() => {
        setMeditations(initialMeditations);
    }, [initialMeditations]);

    if (!meditations) {
        return (
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Conteúdo das Meditações</h2>
                <p className="text-gray-600">Nenhum conteúdo de meditação encontrado</p>
            </div>
        );
    }

    const handleEdit = (phase: string, section: string, index: number, currentText: string) => {
        setEditingItem({ phase, section, index });
        setEditText(currentText);
    };

    const handleSave = async () => {
        if (!editingItem || !meditations) return;

        setIsSaving(true);
        try {
            const updatedMeditations = JSON.parse(JSON.stringify(meditations));

            // Remove _id, createdAt, updatedAt before sending
            delete updatedMeditations._id;
            delete updatedMeditations.createdAt;
            delete updatedMeditations.updatedAt;

            const phaseData = updatedMeditations[editingItem.phase as keyof Meditations] as Record<string, Array<{ text: string; order: number }>>;
            phaseData[editingItem.section][editingItem.index].text = editText;

            const response = await fetch('/api/database/meditations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMeditations),
            });

            if (response.ok) {
                const result = await response.json();
                setMeditations(result.meditations);
                setMessage({ type: 'success', text: 'Meditação atualizada com sucesso!' });
                setEditingItem(null);
                setTimeout(() => setMessage(null), 3000);
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.message || 'Erro ao atualizar' });
            }
        } catch (err) {
            console.error('Error saving meditation:', err);
            setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (phase: string, section: string, index: number) => {
        if (!confirm('Tem certeza que deseja excluir este item?')) return;

        setIsSaving(true);
        try {
            const updatedMeditations = JSON.parse(JSON.stringify(meditations));

            // Remove _id, createdAt, updatedAt before sending
            delete updatedMeditations._id;
            delete updatedMeditations.createdAt;
            delete updatedMeditations.updatedAt;

            const phaseData = updatedMeditations[phase as keyof Meditations] as Record<string, Array<{ text: string; order: number }>>;
            phaseData[section].splice(index, 1);

            const response = await fetch('/api/database/meditations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMeditations),
            });

            if (response.ok) {
                const result = await response.json();
                setMeditations(result.meditations);
                setMessage({ type: 'success', text: 'Item excluído com sucesso!' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.message || 'Erro ao excluir' });
            }
        } catch (err) {
            console.error('Error deleting meditation:', err);
            setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAdd = async () => {
        if (!showAddModal || !newMeditationText.trim()) return;

        const { phase, section } = showAddModal;
        setIsSaving(true);
        try {
            const updatedMeditations = JSON.parse(JSON.stringify(meditations));

            // Remove _id, createdAt, updatedAt before sending
            delete updatedMeditations._id;
            delete updatedMeditations.createdAt;
            delete updatedMeditations.updatedAt;

            const phaseData = updatedMeditations[phase as keyof Meditations] as Record<string, Array<{ text: string; order: number }>>;
            const newOrder = phaseData[section].length;
            phaseData[section].push({ text: newMeditationText, order: newOrder });

            const response = await fetch('/api/database/meditations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMeditations),
            });

            if (response.ok) {
                const result = await response.json();
                setMeditations(result.meditations);
                setMessage({ type: 'success', text: 'Meditação adicionada com sucesso!' });
                setShowAddModal(null);
                setNewMeditationText('');
                setTimeout(() => setMessage(null), 3000);
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.message || 'Erro ao adicionar' });
            }
        } catch (err) {
            console.error('Error adding meditation:', err);
            setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Conteúdo das Meditações</h2>

            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                    {message.text}
                </div>
            )}

            <Modal
                isOpen={showAddModal !== null}
                onClose={() => {
                    setShowAddModal(null);
                    setNewMeditationText('');
                }}
                title="Adicionar Nova Meditação"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Texto da Meditação
                        </label>
                        <textarea
                            value={newMeditationText}
                            onChange={(e) => setNewMeditationText(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows={5}
                            placeholder="Digite o texto da meditação..."
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setShowAddModal(null);
                                setNewMeditationText('');
                            }}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={isSaving || !newMeditationText.trim()}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-md transition-colors"
                        >
                            {isSaving ? 'Adicionando...' : 'Adicionar'}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="space-y-4">
                {Object.entries(meditations).map(([phase, content]) => {
                    if (phase.startsWith('_') || phase === 'createdAt' || phase === 'updatedAt') return null;
                    const phaseContent = content as Record<string, Array<{ text: string; order: number }>>;
                    const isExpanded = expandedPhase === phase;

                    return (
                        <div key={phase} className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                            <button
                                onClick={() => setExpandedPhase(isExpanded ? null : phase)}
                                className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold capitalize text-gray-800">{phase}</h3>
                                    <p className="text-sm text-gray-600">{Object.keys(phaseContent).length} seções</p>
                                </div>
                                <span className="text-2xl text-gray-400">{isExpanded ? '−' : '+'}</span>
                            </button>

                            {isExpanded && (
                                <div className="border-t border-gray-200 p-4 bg-gray-50">
                                    {Object.entries(phaseContent).map(([section, items]) => (
                                        <div key={section} className="mb-4 last:mb-0">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-medium text-gray-800">{section.replace(/_/g, ' ')}</h4>
                                                <button
                                                    onClick={() => setShowAddModal({ phase, section })}
                                                    disabled={isSaving}
                                                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded"
                                                >
                                                    + Adicionar
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {items.map((item, index) => (
                                                    <div key={index} className="border border-gray-300 rounded p-2 bg-white">
                                                        {editingItem?.phase === phase && editingItem?.section === section && editingItem?.index === index ? (
                                                            <div>
                                                                <textarea
                                                                    value={editText}
                                                                    onChange={(e) => setEditText(e.target.value)}
                                                                    className="w-full p-2 border border-gray-300 rounded text-sm text-gray-800"
                                                                    rows={3}
                                                                />
                                                                <div className="flex gap-2 mt-2">
                                                                    <button
                                                                        onClick={handleSave}
                                                                        disabled={isSaving}
                                                                        className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                                                    >
                                                                        Salvar
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditingItem(null)}
                                                                        className="text-xs bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                                                                    >
                                                                        Cancelar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-between items-start gap-2">
                                                                <p className="text-sm text-gray-700 flex-1">{item.text}</p>
                                                                <div className="flex gap-1">
                                                                    <button
                                                                        onClick={() => handleEdit(phase, section, index, item.text)}
                                                                        disabled={isSaving}
                                                                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                                                                    >
                                                                        Editar
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(phase, section, index)}
                                                                        disabled={isSaving}
                                                                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                                                                    >
                                                                        Excluir
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {items.length === 0 && (
                                                    <p className="text-sm text-gray-500 italic">Nenhum item</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Structure Tab Component
function StructureTab({ structure }: { structure: Structure | null }) {
    const [editedSpecifics, setEditedSpecifics] = useState<Structure['specifics'] | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Initialize edited specifics when structure changes
    useEffect(() => {
        if (structure?.specifics) {
            setEditedSpecifics(structure.specifics);
        }
    }, [structure]);

    if (!structure) {
        return (
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Estrutura das Meditações</h2>
                <p className="text-gray-600 text-center py-8">Nenhuma estrutura configurada</p>
            </div>
        );
    }

    const methodSteps = structure.method || [];
    const specificsEntries = Object.entries(editedSpecifics || structure.specifics || {});
    const hasChanges = JSON.stringify(editedSpecifics) !== JSON.stringify(structure.specifics);

    const handleToggleSpecific = (phase: string, key: string) => {
        if (!editedSpecifics) return;

        setEditedSpecifics({
            ...editedSpecifics,
            [phase]: {
                ...editedSpecifics[phase as keyof typeof editedSpecifics],
                [key]: !editedSpecifics[phase as keyof typeof editedSpecifics][key]
            }
        });
    };

    const handleSave = async () => {
        if (!editedSpecifics) return;

        setIsSaving(true);
        try {
            const response = await fetch('/api/database/structure', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ specifics: editedSpecifics }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Especificidades salvas com sucesso!' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.message || 'Erro ao salvar especificidades' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        setEditedSpecifics(structure.specifics);
        setMessage(null);
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Estrutura das Meditações</h2>

            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                    {message.text}
                </div>
            )}

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">Especificidades Ativas</h3>
                    {hasChanges && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleReset}
                                disabled={isSaving}
                                className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50"
                            >
                                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specificsEntries.map(([phase, flags]) => {
                        const entries = Object.entries(flags || {});
                        const active = entries.filter(([, value]) => value).length;

                        return (
                            <div key={phase} className="border border-gray-300 rounded-lg p-4 bg-white">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                                    <span className="font-semibold capitalize text-gray-800">{phase.replace('_', ' ')}</span>
                                    <span className="text-sm text-gray-600">
                                        {active} ativos de {entries.length}
                                    </span>
                                </div>
                                <ul className="space-y-2">
                                    {entries.map(([key, value]) => (
                                        <li key={key} className="flex items-center justify-between py-1">
                                            <label htmlFor={`${phase}-${key}`} className="flex items-center gap-3 cursor-pointer flex-1">
                                                <input
                                                    id={`${phase}-${key}`}
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={() => handleToggleSpecific(phase, key)}
                                                    className="w-4 h-4 text-indigo-600 border-gray-400 rounded focus:ring-indigo-500 cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-800">{key.replace(/_/g, ' ')}</span>
                                            </label>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {value ? 'ativo' : 'inativo'}
                                            </span>
                                        </li>
                                    ))}
                                    {entries.length === 0 && (
                                        <li className="text-gray-500 text-sm">Sem itens configurados</li>
                                    )}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Fluxo do Método (por seção)</h3>
                {methodSteps.length === 0 ? (
                    <p className="text-gray-600 text-sm">Nenhum passo configurado</p>
                ) : (
                    <div className="space-y-4">
                        {/* Collect all phases/sections from all steps */}
                        {(() => {
                            const allPhases = new Set<string>();
                            methodSteps.forEach(step => {
                                Object.keys(step).forEach(phase => allPhases.add(phase));
                            });

                            return Array.from(allPhases).map(phase => {
                                // Collect all items for this phase across all steps
                                const allItemsForPhase: Array<{ step: number; item: string; index: number }> = [];
                                methodSteps.forEach((step, stepIndex) => {
                                    const items = step[phase as keyof typeof step];
                                    if (Array.isArray(items)) {
                                        items.forEach((item, itemIndex) => {
                                            allItemsForPhase.push({ step: stepIndex, item, index: itemIndex });
                                        });
                                    }
                                });

                                return (
                                    <div key={phase} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                        <h4 className="font-semibold mb-3 text-gray-800 capitalize">
                                            {phase.replace(/_/g, ' ')}
                                        </h4>
                                        {allItemsForPhase.length > 0 ? (
                                            <ol className="list-decimal list-inside space-y-1.5">
                                                {allItemsForPhase.map((entry, idx) => (
                                                    <li key={idx} className="text-sm text-gray-700">
                                                        <span className="font-mono text-xs text-indigo-600">[Etapa {entry.step + 1}]</span>{' '}
                                                        <span className="font-mono text-xs text-gray-500">[{entry.index}]</span>{' '}
                                                        {entry.item}
                                                    </li>
                                                ))}
                                            </ol>
                                        ) : (
                                            <p className="text-sm text-gray-500">Nenhum item</p>
                                        )}
                                    </div>
                                );
                            });
                        })()}
                    </div>
                )}
            </div>


        </div>
    );
}

// Themes List Component with Accordion
function ThemesList({
    themes: initialThemes,
    structure,
    onDelete,
    isSaving
}: {
    themes: Theme[];
    structure: Structure | null;
    onDelete: (id: string) => void;
    isSaving: boolean;
}) {
    const [themes, setThemes] = useState<Theme[]>(initialThemes);
    const [expandedTheme, setExpandedTheme] = useState<string | null>(null);
    const [editingTheme, setEditingTheme] = useState<string | null>(null);
    const [editingPhrase, setEditingPhrase] = useState<{ themeId: string; phase: string; section: string; index: number } | null>(null);
    const [showAddPhraseModal, setShowAddPhraseModal] = useState<{ themeId: string; phase: string; section: string } | null>(null);
    const [newPhraseText, setNewPhraseText] = useState('');
    const [phraseText, setPhraseText] = useState('');
    const [themeData, setThemeData] = useState<{ category: string; title: string; description: string; isActive: boolean } | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [saving, setSaving] = useState(false);

    // Sync local state with prop changes
    useEffect(() => {
        setThemes(initialThemes);
    }, [initialThemes]);

    const refreshThemes = async () => {
        try {
            const response = await fetch('/api/database/themes');
            if (response.ok) {
                const data = await response.json();
                setThemes(data.themes || []);
            }
        } catch (error) {
            console.error('Error refreshing themes:', error);
        }
    };

    const handleAddPhrase = async () => {
        if (!showAddPhraseModal || !newPhraseText.trim()) return;

        const { themeId, phase, section } = showAddPhraseModal;
        setSaving(true);
        try {
            const theme = themes.find(t => t._id?.toString() === themeId);
            if (!theme) return;

            const updatedMeditations = JSON.parse(JSON.stringify(theme.meditations));
            const phaseData = updatedMeditations[phase as keyof Theme['meditations']] as Record<string, Array<{ text: string; order: number }>>;
            const newOrder = phaseData[section].length;
            phaseData[section].push({ text: newPhraseText, order: newOrder });

            const response = await fetch(`/api/database/themes/${themeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meditations: updatedMeditations }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Frase adicionada com sucesso!' });
                setShowAddPhraseModal(null);
                setNewPhraseText('');
                await refreshThemes();
                setTimeout(() => setMessage(null), 3000);
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.message || 'Erro ao adicionar frase' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
        } finally {
            setSaving(false);
        }
    };

    const handleEditPhrase = (themeId: string, phase: string, section: string, index: number, currentText: string) => {
        setEditingPhrase({ themeId, phase, section, index });
        setPhraseText(currentText);
    };

    const handleSavePhrase = async () => {
        if (!editingPhrase) return;

        setSaving(true);
        try {
            const theme = themes.find(t => t._id?.toString() === editingPhrase.themeId);
            if (!theme) return;

            const updatedMeditations = JSON.parse(JSON.stringify(theme.meditations));
            const phaseData = updatedMeditations[editingPhrase.phase as keyof Theme['meditations']] as Record<string, Array<{ text: string; order: number }>>;
            phaseData[editingPhrase.section][editingPhrase.index].text = phraseText;

            const response = await fetch(`/api/database/themes/${editingPhrase.themeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meditations: updatedMeditations }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Frase atualizada com sucesso!' });
                setEditingPhrase(null);
                await refreshThemes();
                setTimeout(() => setMessage(null), 3000);
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.message || 'Erro ao atualizar frase' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePhrase = async (themeId: string, phase: string, section: string, index: number) => {
        if (!confirm('Tem certeza que deseja excluir esta frase?')) return;

        setSaving(true);
        try {
            const theme = themes.find(t => t._id?.toString() === themeId);
            if (!theme) return;

            const updatedMeditations = JSON.parse(JSON.stringify(theme.meditations));
            const phaseData = updatedMeditations[phase as keyof Theme['meditations']] as Record<string, Array<{ text: string; order: number }>>;
            phaseData[section].splice(index, 1);

            const response = await fetch(`/api/database/themes/${themeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ meditations: updatedMeditations }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Frase excluída com sucesso!' });
                await refreshThemes();
                setTimeout(() => setMessage(null), 3000);
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.message || 'Erro ao excluir frase' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
        } finally {
            setSaving(false);
        }
    };

    const handleEditTheme = (themeId: string) => {
        const theme = themes.find(t => t._id?.toString() === themeId);
        if (!theme) return;

        setEditingTheme(themeId);
        setThemeData({
            category: theme.category,
            title: theme.title,
            description: theme.description || '',
            isActive: theme.isActive
        });
    };

    const handleSaveTheme = async () => {
        if (!editingTheme || !themeData) return;

        setSaving(true);
        try {
            const response = await fetch(`/api/database/themes/${editingTheme}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(themeData),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Tema atualizado com sucesso!' });
                setEditingTheme(null);
                await refreshThemes();
                setTimeout(() => setMessage(null), 3000);
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.message || 'Erro ao atualizar tema' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            {message && (
                <div className={`p-3 rounded-lg ${message.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                    {message.text}
                </div>
            )}

            {themes.map((theme) => {
                const themeId = theme._id?.toString() || '';
                const isExpanded = expandedTheme === themeId;

                return (
                    <div key={themeId} className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <div className="p-4 bg-gray-50">
                            {editingTheme === themeId && themeData ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-1">Título</label>
                                        <input
                                            type="text"
                                            value={themeData.title}
                                            onChange={(e) => setThemeData({ ...themeData, title: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-md text-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-1">Categoria</label>
                                        <input
                                            type="text"
                                            value={themeData.category}
                                            onChange={(e) => setThemeData({ ...themeData, category: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-md text-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-800 mb-1">Descrição</label>
                                        <textarea
                                            value={themeData.description}
                                            onChange={(e) => setThemeData({ ...themeData, description: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-md text-gray-800"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveTheme}
                                            disabled={saving}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Salvar
                                        </button>
                                        <button
                                            onClick={() => setEditingTheme(null)}
                                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <button
                                        onClick={() => setExpandedTheme(isExpanded ? null : themeId)}
                                        className="flex-1 text-left"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800">{theme.title}</h3>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${theme.isActive ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
                                                }`}>
                                                {theme.isActive ? 'Ativo' : 'Inativo'}
                                            </span>
                                            <span className="text-2xl text-gray-500">{isExpanded ? '−' : '+'}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-1"><strong>Categoria:</strong> {theme.category}</p>
                                        {theme.description && (
                                            <p className="text-sm text-gray-700">{theme.description}</p>
                                        )}
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditTheme(themeId)}
                                            disabled={saving}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => onDelete(themeId)}
                                            disabled={isSaving}
                                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-3 py-1 rounded text-sm transition-colors"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {isExpanded && theme.meditations && (
                            <div className="border-t border-gray-300 p-4">
                                <h4 className="font-semibold text-gray-800 mb-3">Meditações do Tema</h4>
                                {Object.entries(theme.meditations).map(([phase, sections]) => {
                                    const sectionEntries = Object.entries(sections as Record<string, Array<{ text: string; order: number }>>);
                                    
                                    // Filter sections based on structure.specifics active status
                                    const activeSectionEntries = sectionEntries.filter(([section]) => {
                                        if (!structure?.specifics) return true;
                                        const phaseKey = phase as keyof typeof structure.specifics;
                                        const phaseData = structure.specifics[phaseKey];
                                        if (!phaseData) return true;
                                        return phaseData[section as keyof typeof phaseData] === true;
                                    });

                                    if (activeSectionEntries.length === 0) return null;

                                    return (
                                        <div key={phase} className="mb-4 last:mb-0">
                                            <div className="flex justify-between items-center mb-2">
                                                <h5 className="font-medium text-gray-800 capitalize text-sm bg-indigo-50 p-2 rounded flex-1">
                                                    {phase.replace(/_/g, ' ')}
                                                </h5>
                                            </div>
                                            {activeSectionEntries.map(([section, items]) => (
                                                <div key={section} className="ml-4 mb-3">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <h6 className="text-xs font-medium text-gray-700">
                                                            {section.replace(/_/g, ' ')}
                                                        </h6>
                                                        <button
                                                            onClick={() => setShowAddPhraseModal({ themeId, phase, section })}
                                                            disabled={saving}
                                                            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-0.5 rounded"
                                                        >
                                                            + Frase
                                                        </button>
                                                    </div>
                                                    <div className="space-y-1">
                                                        {items.length === 0 ? (
                                                            <p className="text-xs text-gray-500 italic ml-2">Nenhuma frase adicionada</p>
                                                        ) : (
                                                            items.map((item, index) => (
                                                                <div key={index} className="border border-gray-300 rounded p-2 bg-white text-sm">
                                                                    {editingPhrase?.themeId === themeId &&
                                                                        editingPhrase?.phase === phase &&
                                                                        editingPhrase?.section === section &&
                                                                        editingPhrase?.index === index ? (
                                                                        <div>
                                                                            <textarea
                                                                                value={phraseText}
                                                                                onChange={(e) => setPhraseText(e.target.value)}
                                                                                className="w-full p-2 border border-gray-300 rounded text-sm text-gray-800"
                                                                                rows={2}
                                                                            />
                                                                            <div className="flex gap-2 mt-1">
                                                                                <button
                                                                                    onClick={handleSavePhrase}
                                                                                    disabled={saving}
                                                                                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                                                                                >
                                                                                    Salvar
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => setEditingPhrase(null)}
                                                                                    className="text-xs bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded"
                                                                                >
                                                                                    Cancelar
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex justify-between items-start gap-2">
                                                                            <p className="text-gray-700 flex-1">{item.text}</p>
                                                                            <div className="flex gap-1">
                                                                                <button
                                                                                    onClick={() => handleEditPhrase(themeId, phase, section, index, item.text)}
                                                                                    disabled={saving}
                                                                                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded"
                                                                                >
                                                                                    Editar
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeletePhrase(themeId, phase, section, index)}
                                                                                    disabled={saving}
                                                                                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded"
                                                                                >
                                                                                    Excluir
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Modal for adding phrase */}
            {showAddPhraseModal && (
                <Modal
                    isOpen={true}
                    onClose={() => {
                        setShowAddPhraseModal(null);
                        setNewPhraseText('');
                    }}
                    title="Adicionar Nova Frase"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Texto da Frase
                            </label>
                            <textarea
                                value={newPhraseText}
                                onChange={(e) => setNewPhraseText(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={5}
                                placeholder="Digite o texto da nova frase..."
                                disabled={saving}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddPhraseModal(null);
                                    setNewPhraseText('');
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleAddPhrase}
                                disabled={saving || !newPhraseText.trim()}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Adicionando...' : 'Adicionar'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// Themes Tab Component
function ThemesTab({
    themes,
    structure,
    onCreate,
    onDelete,
    isSaving
}: {
    themes: Theme[];
    structure: Structure | null;
    onCreate: (theme: Omit<Theme, '_id' | 'createdAt' | 'updatedAt'>) => void;
    onDelete: (id: string) => void;
    isSaving: boolean;
}) {
    const [showForm, setShowForm] = useState(false);
    const [newTheme, setNewTheme] = useState<Omit<Theme, '_id' | 'createdAt' | 'updatedAt'>>(() => createInitialTheme());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(newTheme);
        setNewTheme(createInitialTheme());
        setShowForm(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Temas</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                    {showForm ? 'Cancelar' : 'Adicionar Tema'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-1">Categoria *</label>
                            <input
                                type="text"
                                value={newTheme.category}
                                onChange={(e) => setNewTheme(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400"
                                placeholder="Ex: Estresse, Ansiedade, Sono"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-1">Título *</label>
                            <input
                                type="text"
                                value={newTheme.title}
                                onChange={(e) => setNewTheme(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400"
                                placeholder="Ex: Meditação para Ansiedade"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-800 mb-1">Descrição</label>
                        <textarea
                            value={newTheme.description}
                            onChange={(e) => setNewTheme(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400"
                            placeholder="Descrição do tema de meditação..."
                            rows={3}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="mt-4 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                        {isSaving ? 'Criando...' : 'Criar Tema'}
                    </button>
                </form>
            )}

            <ThemesList themes={themes} structure={structure} onDelete={onDelete} isSaving={isSaving} />
            {themes.length === 0 && (
                <p className="text-gray-600 text-center py-8">Nenhum tema encontrado</p>
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
        fadeInMs: 3000,
        fadeOutMs: 3000,
        volume: 1
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(newAudio);
        setNewAudio({ title: '', artist: '', src: '', fadeInMs: 3000, fadeOutMs: 3000, volume: 1 });
        setShowForm(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Áudios</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                    {showForm ? 'Cancelar' : 'Adicionar Áudio'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-1">Título *</label>
                            <input
                                type="text"
                                value={newAudio.title}
                                onChange={(e) => setNewAudio(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400"
                                placeholder="Nome do áudio"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-1">Artista *</label>
                            <input
                                type="text"
                                value={newAudio.artist}
                                onChange={(e) => setNewAudio(prev => ({ ...prev, artist: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400"
                                placeholder="Nome do artista"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-800 mb-1">URL do Áudio *</label>
                        <input
                            type="url"
                            value={newAudio.src}
                            onChange={(e) => setNewAudio(prev => ({ ...prev, src: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400"
                            placeholder="https://exemplo.com/audio.mp3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-1">Fade In (ms)</label>
                            <input
                                type="number"
                                value={newAudio.fadeInMs}
                                onChange={(e) => setNewAudio(prev => ({ ...prev, fadeInMs: Number(e.target.value) }))}
                                className="w-full p-2 border border-gray-300 rounded-md text-gray-800"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-1">Fade Out (ms)</label>
                            <input
                                type="number"
                                value={newAudio.fadeOutMs}
                                onChange={(e) => setNewAudio(prev => ({ ...prev, fadeOutMs: Number(e.target.value) }))}
                                className="w-full p-2 border border-gray-300 rounded-md text-gray-800"
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                            Volume: {newAudio.volume.toFixed(1)}
                        </label>
                        <input
                            type="range"
                            value={newAudio.volume}
                            onChange={(e) => setNewAudio(prev => ({ ...prev, volume: Number(e.target.value) }))}
                            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                            min="0"
                            max="1"
                            step="0.1"
                        />
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>0.0 (Mudo)</span>
                            <span>1.0 (Máximo)</span>
                        </div>
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
                    <div key={audio._id?.toString()} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-800">{audio.title}</h3>
                                    <span className="text-sm text-gray-700 bg-gray-200 px-2 py-0.5 rounded">Vol: {audio.volume}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-1"><strong>Artista:</strong> {audio.artist}</p>
                                <p className="text-sm text-gray-700 mb-2 break-all"><strong>URL:</strong> {audio.src}</p>
                                <div className="text-xs text-gray-600">
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
                <p className="text-gray-600 text-center py-8">Nenhum áudio encontrado</p>
            )}
        </div>
    );
}