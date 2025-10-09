'use client'; 'use client'; 'use client'; 'use client'; 'use client';



import { useState, useEffect } from 'react';



export default function AdminPage() {
    import { useState, useEffect } from 'react';

    const [isLoading, setIsLoading] = useState(true);

    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); import { Audio, Theme, StructureItem, Meditations } from '@/types/database';



    useEffect(() => {
        import { useState, useEffect } from 'react';

        setIsLoading(false);

    }, []); interface AdminData {



    const showMessage = (type: 'success' | 'error', text: string) => {
        meditations: Meditations | null; import { Audio, Theme, StructureItem, Meditations } from '@/types/database';

        setMessage({ type, text });

        setTimeout(() => setMessage(null), 5000); structure: StructureItem[];

    };

    themes: Theme[]; import { useState, useEffect } from 'react'; import { useState, useEffect } from 'react';

    const handleSeedDatabase = async () => {

        try {
            audios: Audio[];

            const response = await fetch('/api/database/seed', { method: 'POST' });

            const data = await response.json();
        }interface AdminData {



            if(response.ok) {

            showMessage('success', 'Base de dados populada com sucesso!');

        } else {
            export default function AdminPage() {
                meditations: Meditations | null; import { Audio, Theme, StructureItem, Meditations } from '@/types/database'; import { MeditationDatabase } from '@/types/database';

                showMessage('error', data.message || 'Erro ao popular base de dados');

            } const [isLoading, setIsLoading] = useState(true);

        } catch {

            showMessage('error', 'Erro ao conectar com o servidor'); const [isSaving, setIsSaving] = useState(false); structure: StructureItem[];

        }

    }; const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);



    if (isLoading) {
        const [data, setData] = useState<AdminData>({
            themes: Theme[];

            return(

            <div className = "min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center" > meditations: null,

                <div className = "text-center" >

                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>      structure: [], audios: Audio[];

                    < p className = "text-gray-600" > Carregando painel administrativo...</p >

                </div > themes: [],

            </div >

        ); audios: []
    } interface AdminData {export default function AdminPage() {

    }

});

return (

    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">    const [activeTab, setActiveTab] = useState<'meditations' | 'structure' | 'themes' | 'audios'>('meditations');

        <div className="container mx-auto px-4 py-8">

            <div className="mb-8 text-center">

                <h1 className="text-4xl font-bold text-gray-800 mb-2">

                    Painel Administrativo    // Load all collectionsexport default function AdminPage() {meditations: Meditations | null;    const [isLoading, setIsLoading] = useState(true);

                </h1>

                <p className="text-gray-600">Gerencie o conteúdo da aplicação de meditação</p>    useEffect(() => {

                </div>

            async function loadData() {    const [isLoading, setIsLoading] = useState(true);

            {message && (

                <div className={`mb-6 p-4 rounded-lg ${            try {

                        message.type === 'success'

                        ? 'bg-green-100 text-green-700 border border-green-300'                 const [meditationsRes, structureRes, themesRes, audiosRes] = await Promise.all([    const [isSaving, setIsSaving] = useState(false);  structure: StructureItem[];    const [isSaving, setIsSaving] = useState(false);

            : 'bg-red-100 text-red-700 border border-red-300'

                    }`}>                  fetch('/api/meditations'),

            {message.text}

        </div>                  fetch('/api/structure'),    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

                )}

        fetch('/api/database/themes'),

        <div className="mb-8 text-center">

            <button fetch('/api/database/audios')    const [data, setData] = useState<AdminData>({themes: Theme[];    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

                onClick={handleSeedDatabase}

                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"                ]);

                    >

                Popular Base de Dados      meditations: null,

            </button>

        </div>                if (meditationsRes.ok && structureRes.ok && themesRes.ok && audiosRes.ok) {



            <div className="bg-white rounded-lg shadow-lg p-6">                    const [meditationsData, structureData, themesData, audiosData] = await Promise.all([      structure: [],  audios: Audio[];    const [database, setDatabase] = useState<MeditationDatabase | null>(null);

                <h2 className="text-2xl font-semibold mb-4">Sistema Atualizado</h2>

                <p className="text-gray-600 mb-4">                      meditationsRes.json(),

                    O sistema foi migrado para usar coleções separadas:

                </p>                      structureRes.json(),      themes: [],

                <ul className="list-disc list-inside space-y-2 text-gray-600">

                    <li><strong>meditations</strong> - Conteúdo das meditações</li>                      themesRes.json(),

                    <li><strong>structure</strong> - Estrutura das fases</li>

                    <li><strong>themes</strong> - Temas e categorias</li>                      audiosRes.json()      audios: []}    const [activeTab, setActiveTab] = useState<'general' | 'structure' | 'themes' | 'audios'>('general');

                    <li><strong>audios</strong> - Arquivos de áudio</li>

                </ul>                    ]);

                <p className="text-gray-600 mt-4">

                        Use o botão acima para popular a base de dados com os dados iniciais.    });

                </p>

            </div>                    setData({

            </div>

        </div > meditations: meditationsData.meditations,    const [activeTab, setActiveTab] = useState<'meditations' | 'structure' | 'themes' | 'audios'>('meditations');

    );

}                      structure: structureData.structures,

    themes: themesData.themes,

        audios: audiosData.audios

                    });    // Load all collectionsexport default function AdminPage() {    // Load database

                } else {

    setMessage({ type: 'error', text: 'Erro ao carregar dados' }); useEffect(() => {

    }

            } catch {
    async function loadData() {
        const [isLoading, setIsLoading] = useState(true); useEffect(() => {

            setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });

        } finally {
            try {

                setIsLoading(false);

            }                const [meditationsRes, structureRes, themesRes, audiosRes] = await Promise.all([    const [isSaving, setIsSaving] = useState(false); async function loadDatabase() {

            }

            fetch('/api/meditations'),

                loadData();

        }, []); fetch('/api/structure'),    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); try {



            const showMessage = (type: 'success' | 'error', text: string) => {
                fetch('/api/database/themes'),

                setMessage({ type, text });

                setTimeout(() => setMessage(null), 5000); fetch('/api/database/audios')    const [data, setData] = useState<AdminData>({
                    const response = await fetch('/api/database');

                };

                ]);

            const handleSeedDatabase = async () => {

                setIsSaving(true); meditations: null,                if (response.ok) {

                    try {

                        const response = await fetch('/api/database/seed', { method: 'POST' }); if (meditationsRes.ok && structureRes.ok && themesRes.ok && audiosRes.ok) {

                            const data = await response.json();

                            const [meditationsData, structureData, themesData, audiosData] = await Promise.all([structure: [],                    const data = await response.json();

                            if (response.ok) {

                                showMessage('success', 'Base de dados populada com sucesso!'); meditationsRes.json(),

                                    window.location.reload();

                            } else {
                                structureRes.json(), themes: [], setDatabase(data.database);

                                showMessage('error', data.message || 'Erro ao popular base de dados');

                            } themesRes.json(),

        } catch {

                            showMessage('error', 'Erro ao conectar com o servidor'); audiosRes.json()      audios: []
                        } else {

                        } finally {

                            setIsSaving(false);                    ]);

                        }

                    };
                }); setMessage({ type: 'error', text: 'Erro ao carregar base de dados' });



                if (isLoading) {
                    setData({

                        return(

            <div className = "min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center" > meditations: meditationsData.meditations, const [activeTab, setActiveTab] = useState<'meditations' | 'structure' | 'themes' | 'audios'>('meditations');
                    }

                        < div className = "text-center" >

                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>                      structure: structureData.structures,

                        <p className="text-gray-600">Carregando painel administrativo...</p>

                </div > themes: themesData.themes,            } catch {

            </div >

        ); audios: audiosData.audios

        }

    });    // Load all collections                setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });

    return (

        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">                } else {

            <div className="container mx-auto px-4 py-8">

                <div className="mb-8 text-center">                    setMessage({ type: 'error', text: 'Erro ao carregar dados' });    useEffect(() => {            } finally {

                    <h1 className="text-4xl font-bold text-gray-800 mb-2">

                        Painel Administrativo                }

                    </h1>

                    <p className="text-gray-600">Gerencie o conteúdo da aplicação de meditação</p>            } catch {        async function loadData() {                setIsLoading(false);

                </div>

                setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });

                {message && (

                    <div className={`mb-6 p-4 rounded-lg ${            } finally {            try {            }

                        message.type === 'success' 

                            ? 'bg-green-100 text-green-700 border border-green-300'                 setIsLoading(false);

                            : 'bg-red-100 text-red-700 border border-red-300'

                    }`}>            }                const [meditationsRes, structureRes, themesRes, audiosRes] = await Promise.all([        }

                        {message.text}

                    </div>        }

                )}

                  fetch('/api/meditations'),

                <div className="mb-8 text-center">

                    <button        loadData();

                        onClick={handleSeedDatabase}

                        disabled={isSaving}    }, []);                  fetch('/api/structure'),        loadDatabase();

                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"

                    >

                        {isSaving ? 'Populando...' : 'Popular Base de Dados'}

                    </button>    const showMessage = (type: 'success' | 'error', text: string) => {                  fetch('/api/database/themes'),    }, []);

                </div>

        setMessage({ type, text });

                <div className="mb-8">

                    <div className="border-b border-gray-200">        setTimeout(() => setMessage(null), 5000);                  fetch('/api/database/audios')

                        <nav className="-mb-px flex space-x-8">

                            {[    };

                                { key: 'meditations', label: 'Meditações' },

                                { key: 'structure', label: 'Estrutura' },                ]);    const showMessage = (type: 'success' | 'error', text: string) => {

                                { key: 'themes', label: 'Temas' },

                                { key: 'audios', label: 'Áudios' },    const handleSeedDatabase = async () => {

                            ].map((tab) => (

                                <button        setIsSaving(true);        setMessage({ type, text });

                                    key={tab.key}

                                    onClick={() => setActiveTab(tab.key as any)}        try {

                                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${

                                        activeTab === tab.key            const response = await fetch('/api/database/seed', { method: 'POST' });                if (meditationsRes.ok && structureRes.ok && themesRes.ok && audiosRes.ok) {        setTimeout(() => setMessage(null), 5000);

                                            ? 'border-indigo-500 text-indigo-600'

                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'            const data = await response.json();

                                    }`}

                                >                    const [meditationsData, structureData, themesData, audiosData] = await Promise.all([    };

                                    {tab.label}

                                </button>            if (response.ok) {

                            ))}

                        </nav>                showMessage('success', 'Base de dados populada com sucesso!');                      meditationsRes.json(),

                    </div>

                </div>                // Reload all data



                <div className="bg-white rounded-lg shadow-lg p-6">                window.location.reload();                      structureRes.json(),    const handleSeedDatabase = async () => {

                    {activeTab === 'meditations' && (

                        <div>            } else {

                            <h2 className="text-2xl font-semibold mb-4">Conteúdo das Meditações</h2>

                            <p className="text-gray-600">                showMessage('error', data.message || 'Erro ao popular base de dados');                      themesRes.json(),        setIsSaving(true);

                                {data.meditations ? 'Dados carregados com sucesso!' : 'Nenhum dado encontrado'}

                            </p>            }

                        </div>

                    )}        } catch {                      audiosRes.json()        try {

                    {activeTab === 'structure' && (

                        <div>            showMessage('error', 'Erro ao conectar com o servidor');

                            <h2 className="text-2xl font-semibold mb-4">Estrutura das Meditações</h2>

                            <p className="text-gray-600">        } finally {                    ]);            const response = await fetch('/api/database/seed', { method: 'POST' });

                                {data.structure.length} estruturas encontradas

                            </p>            setIsSaving(false);

                        </div>

                    )}        }            const data = await response.json();

                    {activeTab === 'themes' && (

                        <div>    };

                            <h2 className="text-2xl font-semibold mb-4">Temas</h2>

                            <p className="text-gray-600">                    setData({

                                {data.themes.length} temas encontrados

                            </p>    if (isLoading) {

                        </div>

                    )}        return (                      meditations: meditationsData.meditations,            if (response.ok) {

                    {activeTab === 'audios' && (

                        <div>            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">

                            <h2 className="text-2xl font-semibold mb-4">Áudios</h2>

                            <p className="text-gray-600">                <div className="text-center">                      structure: structureData.structures,                showMessage('success', 'Base de dados populada com sucesso!');

                                {data.audios.length} áudios encontrados

                            </p>                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>

                        </div>

                    )}                    <p className="text-gray-600">Carregando painel administrativo...</p>                      themes: themesData.themes,                // Reload database

                </div>

            </div>                </div >

        </div >

    );            </div > audios: audiosData.audios                const dbResponse = await fetch('/api/database');

}
        );

    }                    }); if (dbResponse.ok) {



    return (                } else {
        const dbData = await dbResponse.json();

    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">

        <div className="container mx-auto px-4 py-8">                    setMessage({type: 'error', text: 'Erro ao carregar dados' });                    setDatabase(dbData.database);

            {/* Header */}

            <div className="mb-8 text-center">                }                }

                <h1 className="text-4xl font-bold text-gray-800 mb-2">

                        Painel Administrativo            } catch { } else {

                    </h1>

                <p className="text-gray-600">Gerencie o conteúdo da aplicação de meditação</p>                setMessage({type: 'error', text: 'Erro ao conectar com o servidor' });                showMessage('error', data.error || 'Erro ao popular base de dados');

            </div>

            } finally { }

            {/* Message Display */}

            {message && (setIsLoading(false);        } catch {

                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'}            showMessage('error', 'Erro ao conectar com o servidor');

                            ? 'bg-green-100 text-green-700 border border-green-300' 

                            : 'bg-red-100 text-red-700 border border-red-300'        }        } finally {

                    }`}>

                    {message.text}            setIsSaving(false);

                </div>

                )}        loadData();        }



            {/* Seed Database Button */}    }, []);    };

            <div className="mb-8 text-center">

                <button

                    onClick={handleSeedDatabase}

                    disabled={isSaving} const showMessage= (type: 'success' | 'error', text: string) => {    if (isLoading) {

                    className = "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"

                    > setMessage({ type, text });        return (

                {isSaving ? 'Populando...' : 'Popular Base de Dados'}

            </button>        setTimeout(() => setMessage(null), 5000);            <div className="min-h-screen bg-stone-50 flex items-center justify-center">

            </div>

    };                <div className="text-stone-600">Carregando...</div>

            {/* Tab Navigation */}

            <div className="mb-8">            </div>

            <div className="border-b border-gray-200">

                <nav className="-mb-px flex space-x-8">    const handleSeedDatabase = async () => {        );

                    {[

                        { key: 'meditations', label: 'Meditações' }, setIsSaving(true);    }

                    {key: 'structure', label: 'Estrutura' },

                    {key: 'themes', label: 'Temas' },        try {

                        { key: 'audios', label: 'Áudios' },

                            ].map((tab) => (            const response = await fetch('/api/database/seed', {method: 'POST' });    return (

                    <button

                        key={tab.key} const data= await response.json();        <div className="min-h-screen bg-stone-50">

                        onClick={() => setActiveTab(tab.key as any)}

                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${<div className="mx-auto max-w-7xl px-4 py-8">

                            activeTab === tab.key

                            ? 'border-indigo-500 text-indigo-600'            if (response.ok) {{/* Header */ }

                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'

                                    }`}                showMessage('success', 'Base de dados populada com sucesso!');                <div className="mb-8">

                                >

                                {tab.label}                // Reload all data                    <h1 className="text-3xl font-semibold text-stone-900 mb-2">

                                </button>

                            ))}                window.location.reload();                        Administração Spirare

                            </nav>

                        </div>} else {                    </h1>

                </div>

                showMessage('error', data.message || 'Erro ao popular base de dados');                    <p className="text-stone-600">

                {/* Tab Content */}

                <div className="bg-white rounded-lg shadow-lg p-6">            }                        Gerencie o conteúdo e estrutura das meditações

                    {activeTab === 'meditations' && (

                        <div>        } catch {                    </p>

                            <h2 className="text-2xl font-semibold mb-4">Conteúdo das Meditações</h2>

                            <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>            showMessage('error', 'Erro ao conectar com o servidor');                </div>

                        </div>

                    )}        } finally {

                    {activeTab === 'structure' && (

                        <div>            setIsSaving(false);                {/* Message */}

                            <h2 className="text-2xl font-semibold mb-4">Estrutura das Meditações</h2>

                            <div className="space-y-4">        }                {message && (

                                {data.structure.map((item, index) => (

                                    <div key={item._id || index} className="border rounded-lg p-4">    };                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'

                            < pre className="text-sm overflow-auto">

                        {JSON.stringify(item, null, 2)}                            ? 'bg-green-50 text-green-700 border border-green-200'

                    </pre>

            </div>    const handleUpdateMeditations = async (updatedMeditations: Meditations) => {                            : 'bg-red-50 text-red-700 border border-red-200'

                                ))}

        </div>        setIsSaving(true);                        }`}>

        {data.structure.length === 0 && (

            <p className="text-gray-500 text-center py-8">Nenhuma estrutura encontrada</p>        try {{ message.text }

                            )}

    </div>            const response = await fetch('/api/meditations', {                    </div>

                    )
}

{ activeTab === 'themes' && (method: 'PUT',                ) }

<div>

    <h2 className="text-2xl font-semibold mb-4">Temas</h2>                headers: {'Content-Type': 'application/json' },

    <div className="space-y-4">

        {data.themes.map((theme) => (body: JSON.stringify(updatedMeditations), {/* Seed Database Button */ }

            < div key = { theme._id } className = "border rounded-lg p-4" >

                                        <div className="flex justify-between items-start mb-2">            });                <div className="mb-8">

                                            <h3 className="text-lg font-medium">{theme.title}</h3>

                                            <span className={`px-2 py-1 rounded text-xs ${                    <button

                                                theme.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'

                                            }`}>            if (response.ok) {                        onClick={handleSeedDatabase}

                                                {theme.isActive ? 'Ativo' : 'Inativo'}

                                            </span>                const result = await response.json();                        disabled={isSaving}

                                        </div>

                                        <p className="text-sm text-gray-600 mb-2">Categoria: {theme.category}</p>                setData(prev => ({ ...prev, meditations: result.meditations }));                        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"

                                        {theme.description && (

                                            <p className="text-sm text-gray-700 mb-2">{theme.description}</p>                showMessage('success', 'Meditações atualizadas com sucesso!');                    >

                                        )}

                                    </div>            } else {                        {isSaving ? 'Populando...' : 'Popular Base de Dados'}

                                ))}

                            </div>                const error = await response.json();                    </button>

                            {data.themes.length === 0 && (

                                <p className="text-gray-500 text-center py-8">Nenhum tema encontrado</p>                showMessage('error', error.message || 'Erro ao atualizar meditações');                    <p className="text-sm text-stone-600 mt-2">

                            )}

                        </div>            }                        Carrega dados iniciais do arquivo db.json

                    )}

                    {activeTab === 'audios' && (        } catch {                    </p>

                        <div>

                            <h2 className="text-2xl font-semibold mb-4">Áudios</h2>            showMessage('error', 'Erro ao conectar com o servidor');                </div>

                            <div className="space-y-4">

                                {data.audios.map((audio) => (        } finally {

                                    <div key={audio._id} className="border rounded-lg p-4">

                                        <div className="flex justify-between items-start mb-2">            setIsSaving(false);                {/* Tabs */}

                                            <h3 className="text-lg font-medium">{audio.title}</h3>

                                            <span className="text-sm text-gray-500">Vol: {audio.volume}</span>        }                <div className="mb-6">

                                        </div>

                                        <p className="text-sm text-gray-600 mb-1">Artista: {audio.artist}</p>    };                    <nav className="flex space-x-8">

                                        <p className="text-sm text-gray-600 mb-2">URL: {audio.src}</p>

                                        <div className="text-xs text-gray-500">                        {[

                                            Fade In: {audio.fadeInMs}ms | Fade Out: {audio.fadeOutMs}ms

                                        </div>    const handleCreateTheme = async (theme: Omit<Theme, '_id' | 'createdAt' | 'updatedAt'>) => {                            { key: 'general', label: 'Conteúdo Geral' },

                                    </div>

                                ))}        setIsSaving(true);                            { key: 'structure', label: 'Estrutura' },

                            </div>

                            {data.audios.length === 0 && (        try {                            { key: 'themes', label: 'Temas' },

                                <p className="text-gray-500 text-center py-8">Nenhum áudio encontrado</p>

                            )}            const response = await fetch('/api/database/themes', {                            { key: 'audios', label: 'Áudios' },

                        </div>

                    )}                method: 'POST',                        ].map((tab) => (

                </div>

            </div>                headers: { 'Content-Type': 'application/json' },                            <button

        </div>

    );                body: JSON.stringify(theme),                                key={tab.key}

}
            });                                onClick={() => setActiveTab(tab.key as 'general' | 'structure' | 'themes' | 'audios')}

                                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.key

            if (response.ok) {                                        ? 'border-emerald-500 text-emerald-600'

                const result = await response.json();                                        : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'

                setData(prev => ({...prev, themes: [...prev.themes, result.theme] }));                                    }`}

                showMessage('success', 'Tema criado com sucesso!');                            >

            } else {{ tab.label }

                const error = await response.json();                            </button>

                showMessage('error', error.message || 'Erro ao criar tema');                        ))}

            }                    </nav >

        } catch {                </div >

    showMessage('error', 'Erro ao conectar com o servidor');

} finally {
    {/* Tab Content */ }

    setIsSaving(false); {
        database && (

        } <div className="bg-white rounded-lg shadow-sm border border-stone-200">

    };                        {activeTab === 'general' && (

            <GeneralContentTab database={database} />

    const handleCreateAudio = async (audio: Omit<Audio, '_id' | 'createdAt' | 'updatedAt'>) => {                        )}

        setIsSaving(true);                        {activeTab === 'structure' && (

        try {<StructureTab database={database} />

            const response = await fetch('/api/database/audios', {                        )}

        method: 'POST',                        {activeTab === 'themes' && (

            headers: {'Content-Type': 'application/json' },                            <ThemesTab database={database} />

                body: JSON.stringify(audio),                        )}

            });                        {activeTab === 'audios' && (

            <AudiosTab database={database} />

            if (response.ok) {                        )}

        const result = await response.json();                    </div>

    setData(prev => ({ ...prev, audios: [...prev.audios, result.audio] }));                )
}

showMessage('success', 'Áudio criado com sucesso!');            </div >

            } else {        </div >

                const error = await response.json();    );

    showMessage('error', error.message || 'Erro ao criar áudio');
}

            }

        } catch {// General Content Tab Component

    showMessage('error', 'Erro ao conectar com o servidor'); function GeneralContentTab({ database }: { database: MeditationDatabase }) {

    } finally {
        return (

            setIsSaving(false); <div className="p-6">

        }            <h2 className="text-xl font-medium text-stone-900 mb-4">Conteúdo Geral</h2>

    };            <div className="space-y-6">

                    {Object.entries(database.general).map(([phase, phaseContent]) => (

    if (isLoading) {                    <div key={phase} className="border border-stone-200 rounded-lg p-4">

        return (                        <h3 className="text-lg font-medium text-stone-800 mb-3 capitalize">

            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center">                            {phase.replace('_', ' ')}

                <div className="text-center">                        </h3>

                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>                        <div className="grid gap-4">

                    <p className="text-gray-600">Carregando painel administrativo...</p>                            {Object.entries(phaseContent).map(([contentType, items]) => (

                </div>                                <div key={contentType} className="space-y-2">

            </div>                                    <label className="block text-sm font-medium text-stone-700 capitalize">

        );                                        {contentType.replace(/_/g, ' ')}

    }                                    </label>

                                    <div className="text-sm text-stone-600">

    return (                                        {Array.isArray(items) ? `${items.length} items` : 'Não é array'}

        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">                                    </div>

            <div className="container mx-auto px-4 py-8">                                </div>

                {/* Header */}                            ))}

                <div className="mb-8 text-center">                        </div>

                    <h1 className="text-4xl font-bold text-gray-800 mb-2">                    </div>

                        Painel Administrativo                ))}

                    </h1>            </div>

                    <p className="text-gray-600">Gerencie o conteúdo da aplicação de meditação</p>        </div>

            </div>    );

    }

    {/* Message Display */ }

    {
        message && (// Structure Tab Component

            <div className={`mb-6 p-4 rounded-lg ${function StructureTab({ database }: { database: MeditationDatabase }) {

                message.type === 'success'     return (

                            ? 'bg-green-100 text-green-700 border border-green-300' < div className = "p-6" >

                            : 'bg-red-100 text-red-700 border border-red-300' < h2 className = "text-xl font-medium text-stone-900 mb-4" > Estrutura das Fases</h2 >

                    }`}>            <div className="space-y-4">

                        {message.text}                {Object.entries(database.structure).map(([phase, items]) => (

                    </div>                    <div key={phase} className="border border-stone-200 rounded-lg p-4">

                )}                        <h3 className="text-lg font-medium text-stone-800 mb-3 capitalize">

                            {phase}

                {/* Seed Database Button */}                        </h3>

                <div className="mb-8 text-center">                        <div className="space-y-2">

                    <button                            {items.map((item, index) => (

                        onClick={handleSeedDatabase}                                <div key={index} className="flex items-center space-x-2">

                        disabled={isSaving}                                    <span className="text-sm text-stone-600">{index + 1}.</span>

                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-6 py-3 rounded-lg font-medium transition-colors"                                    <span className="text-sm">{item.replace(/_/g, ' ')}</span>

                    >                                </div>

                        {isSaving ? 'Populando...' : 'Popular Base de Dados'}                            ))}

                    </button>                        </div>

                </div>                    </div>

                ))}

                {/* Tab Navigation */}            </div>

                <div className="mb-8">        </div>

                    <div className="border-b border-gray-200">    );

                        <nav className="-mb-px flex space-x-8">}

                            {[

                                { key: 'meditations', label: 'Meditações' },// Themes Tab Component

                                { key: 'structure', label: 'Estrutura' },function ThemesTab({ database }: { database: MeditationDatabase }) {

                                { key: 'themes', label: 'Temas' },    return (

                                { key: 'audios', label: 'Áudios' },        <div className="p-6">

                            ].map((tab) => (            <h2 className="text-xl font-medium text-stone-900 mb-4">Temas de Meditação</h2>

                                <button            {database.themes.length === 0 ? (

                                    key={tab.key}                <p className="text-stone-600">Nenhum tema encontrado.</p>

                                    onClick={() => setActiveTab(tab.key as any)}            ) : (

                                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${                <div className="space-y-4">

                    activeTab === tab.key                    {database.themes.map((theme, index) => (

                                            ? 'border-indigo-500 text-indigo-600' < div key = { index } className = "border border-stone-200 rounded-lg p-4" >

                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'                            <div className="flex justify-between items-start mb-2">

                                    }`}                                <h3 className="text-lg font-medium text-stone-800">

                                >                                    {theme.title}

                            {tab.label}                                </h3>

                    </button>                                <span className="text-sm bg-stone-100 text-stone-600 px-2 py-1 rounded">

                            ))}                                    {theme.category}

                    </nav>                                </span>

                    </ div>                            </div>

                </div > {
            theme.description && (

                <p className="text-stone-600 text-sm mb-2">{theme.description}</p>

                {/* Tab Content */ }                            )
    }

    <div className="bg-white rounded-lg shadow-lg p-6">                            <div className="text-sm text-stone-500">

        {activeTab === 'meditations' && (Estrutura personalizada: {theme.structure ? 'Sim' : 'Não'}

        <MeditationsTab                             </div>

        meditations={data.meditations}                         </div>

    onUpdate = { handleUpdateMeditations }                    ))
}

isSaving = { isSaving }                </div >

                        />            )}

                    )}        </div >

    { activeTab === 'structure' && (    );

<StructureTab }

    structure={data.structure}

    onUpdate={() => {/* TODO: Implement structure updates */ }}// Audios Tab Component

    isSaving={isSaving} function AudiosTab({ database }: { database: MeditationDatabase }) {

                        />    return (

                    )
    }        <div className="p-6">

        {activeTab === 'themes' && (            <h2 className="text-xl font-medium text-stone-900 mb-4">Áudios de Fundo</h2>

                        <ThemesTab             {database.audios.length === 0 ? (

                            themes={data.themes}                 <p className="text-stone-600">Nenhum áudio encontrado.</p>

                            onCreate={handleCreateTheme}            ) : (

        isSaving={isSaving}                <div className="space-y-4">

                        />                    {database.audios.map((audio, index) => (

                    )}                        <div key={index} className="border border-stone-200 rounded-lg p-4">

                {activeTab === 'audios' && (<div className="flex justify-between items-start mb-2">

                    <AudiosTab                                 <h3 className="text-lg font-medium text-stone-800">

                        audios={data.audios}                                     {audio.title}

                        onCreate={handleCreateAudio}                                </h3>

                    isSaving={isSaving}                                <span className="text-sm text-stone-600">

                        />                                    {audio.artist}

                    )}                                </span>

                </div>                            </div>

        </div>                            <div className="text-sm text-stone-600 space-y-1">

        </div>                                <div>Fonte: {audio.src}</div>

        );                                {audio.volume && <div>Volume: {(audio.volume * 100).toFixed(0)}%</div>}

}                                {audio.fadeInMs && <div>Fade In: {audio.fadeInMs}ms</div>}

        {audio.fadeOutMs && <div>Fade Out: {audio.fadeOutMs}ms</div>}

// Component for Meditations tab                            </div>

function MeditationsTab({                         </div>

    meditations,                     ))}

onUpdate,                 </div >

    isSaving             )}

}: {         </div >

    meditations: Meditations | null;     );

    onUpdate: (meditations: Meditations) => void;
}
isSaving: boolean;
}) {
    const [editedMeditations, setEditedMeditations] = useState<Meditations | null>(meditations);

    useEffect(() => {
        setEditedMeditations(meditations);
    }, [meditations]);

    if (!editedMeditations) {
        return <div>Carregando meditações...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Conteúdo das Meditações</h2>
            <div className="space-y-6">
                {Object.entries(editedMeditations).map(([phase, content]) => (
                    <div key={phase} className="border rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-3 capitalize">{phase}</h3>
                        <textarea
                            value={JSON.stringify(content, null, 2)}
                            onChange={(e) => {
                                try {
                                    const parsed = JSON.parse(e.target.value);
                                    setEditedMeditations(prev => prev ? { ...prev, [phase]: parsed } : null);
                                } catch {
                                    // Invalid JSON, don't update
                                }
                            }}
                            className="w-full h-40 p-3 border rounded-md font-mono text-sm"
                            placeholder={`Conteúdo da fase ${phase}...`}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <button
                    onClick={() => editedMeditations && onUpdate(editedMeditations)}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                    {isSaving ? 'Salvando...' : 'Atualizar Meditações'}
                </button>
            </div>
        </div>
    );
}

// Component for Structure tab
function StructureTab({
    structure,
    onUpdate,
    isSaving
}: {
    structure: StructureItem[];
    onUpdate: () => void;
    isSaving: boolean;
}) {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Estrutura das Meditações</h2>
            <div className="space-y-4">
                {structure.map((item, index) => (
                    <div key={item._id || index} className="border rounded-lg p-4">
                        <pre className="text-sm overflow-auto">
                            {JSON.stringify(item, null, 2)}
                        </pre>
                    </div>
                ))}
            </div>
            {structure.length === 0 && (
                <p className="text-gray-500 text-center py-8">Nenhuma estrutura encontrada</p>
            )}
        </div>
    );
}

// Component for Themes tab
function ThemesTab({
    themes,
    onCreate,
    isSaving
}: {
    themes: Theme[];
    onCreate: (theme: Omit<Theme, '_id' | 'createdAt' | 'updatedAt'>) => void;
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
                    <div key={theme._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-medium">{theme.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs ${theme.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {theme.isActive ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Categoria: {theme.category}</p>
                        {theme.description && (
                            <p className="text-sm text-gray-700 mb-2">{theme.description}</p>
                        )}
                    </div>
                ))}
            </div>
            {themes.length === 0 && (
                <p className="text-gray-500 text-center py-8">Nenhum tema encontrado</p>
            )}
        </div>
    );
}

// Component for Audios tab
function AudiosTab({
    audios,
    onCreate,
    isSaving
}: {
    audios: Audio[];
    onCreate: (audio: Omit<Audio, '_id' | 'createdAt' | 'updatedAt'>) => void;
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
                    <div key={audio._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-medium">{audio.title}</h3>
                            <span className="text-sm text-gray-500">Vol: {audio.volume}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Artista: {audio.artist}</p>
                        <p className="text-sm text-gray-600 mb-2">URL: {audio.src}</p>
                        <div className="text-xs text-gray-500">
                            Fade In: {audio.fadeInMs}ms | Fade Out: {audio.fadeOutMs}ms
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