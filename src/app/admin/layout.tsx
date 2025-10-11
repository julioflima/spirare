'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if already authenticated
        const auth = sessionStorage.getItem('spirare-admin-auth');
        if (auth === 'authenticated') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                sessionStorage.setItem('spirare-admin-auth', 'authenticated');
                setIsAuthenticated(true);
            } else {
                setError('Credenciais inválidas');
            }
        } catch {
            setError('Erro ao autenticar');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('spirare-admin-auth');
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-emerald-700/80">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8fff8] via-[#fdf8ec] to-[#fff4d6] flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <div className="relative overflow-hidden rounded-[32px] border border-white/35 bg-white/25 p-10 shadow-[0_35px_80px_-40px_rgba(132,204,22,0.35)] backdrop-blur-2xl">
                        <span
                            className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-200/40 via-lime-200/35 to-amber-200/35 blur-3xl"
                            aria-hidden="true"
                        />
                        <span
                            className="pointer-events-none absolute -bottom-32 -left-24 h-60 w-60 rounded-full bg-gradient-to-br from-white/45 via-emerald-100/35 to-amber-100/35 blur-3xl"
                            aria-hidden="true"
                        />

                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-semibold text-emerald-900 mb-2">
                                Painel Administrativo
                            </h1>
                            <p className="text-sm text-emerald-700/80">
                                Acesso restrito - Faça login para continuar
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-emerald-800/90 mb-2"
                                >
                                    Usuário
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full rounded-xl border border-white/45 bg-white/45 px-4 py-3 text-emerald-900 backdrop-blur-xl transition-all hover:bg-white/55 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-emerald-800/90 mb-2"
                                >
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-white/45 bg-white/45 px-4 py-3 text-emerald-900 backdrop-blur-xl transition-all hover:bg-white/55 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-700 bg-red-50/50 border border-red-200/50 rounded-lg px-4 py-2">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 transition-all hover:scale-[1.02] shadow-lg"
                            >
                                Entrar
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => router.push('/')}
                                className="text-xs text-emerald-700/60 hover:text-emerald-800 underline transition-colors"
                            >
                                Voltar para início
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="bg-emerald-900 text-white px-6 py-3 flex justify-between items-center">
                <h2 className="font-semibold">Painel Administrativo - Spirare</h2>
                <button
                    onClick={handleLogout}
                    className="text-sm bg-emerald-800 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors"
                >
                    Sair
                </button>
            </div>
            {children}
        </div>
    );
}
