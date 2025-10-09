'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SuperAdminPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error' | 'warning', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 8000);
  };

  const handleSeedDatabase = async () => {
    if (!confirm('⚠️ Tem certeza que deseja popular a base de dados? Isso irá adicionar dados padrão.')) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/database', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'seed' })
      });
      
      const data = await response.json();

      if (response.ok) {
        showMessage('success', `Base de dados populada com sucesso! ${JSON.stringify(data.data, null, 2)}`);
      } else {
        showMessage('error', data.message || 'Erro ao popular base de dados');
      }
    } catch {
      showMessage('error', 'Erro ao conectar com o servidor');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDropDatabase = async () => {
    if (!confirm('🚨 ATENÇÃO: Tem certeza que deseja EXCLUIR TODA a base de dados? Esta ação é IRREVERSÍVEL!')) return;
    
    if (!confirm('🚨 ÚLTIMA CONFIRMAÇÃO: Todos os dados serão perdidos permanentemente. Continuar?')) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/database', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'drop' })
      });
      
      const data = await response.json();

      if (response.ok) {
        showMessage('warning', 'Base de dados excluída com sucesso! Todos os dados foram removidos.');
      } else {
        showMessage('error', data.message || 'Erro ao excluir base de dados');
      }
    } catch {
      showMessage('error', 'Erro ao conectar com o servidor');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGetDatabaseStatus = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/database');
      const data = await response.json();

      if (response.ok) {
        showMessage('success', `Status da base de dados: ${JSON.stringify(data, null, 2)}`);
      } else {
        showMessage('error', data.message || 'Erro ao obter status da base de dados');
      }
    } catch {
      showMessage('error', 'Erro ao conectar com o servidor');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackupDatabase = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'backup' })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `spirare-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showMessage('success', 'Backup da base de dados criado e baixado com sucesso!');
      } else {
        const data = await response.json();
        showMessage('error', data.message || 'Erro ao criar backup da base de dados');
      }
    } catch {
      showMessage('error', 'Erro ao conectar com o servidor');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-red-800 mb-2">
            🚨 Painel Super Administrativo
          </h1>
          <p className="text-red-600 font-medium">
            CUIDADO: Operações perigosas que afetam toda a base de dados
          </p>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              ⚠️ Este painel permite operações que podem alterar ou excluir todos os dados do sistema.
              Use apenas se você souber exatamente o que está fazendo.
            </p>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 border-green-300' 
              : message.type === 'warning'
              ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
              : 'bg-red-100 text-red-700 border-red-300'
          }`}>
            <pre className="whitespace-pre-wrap font-mono text-xs">{message.text}</pre>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Database Status */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              📊 Status da Base de Dados
            </h2>
            <p className="text-gray-600 mb-4">
              Verificar o status atual e estatísticas da base de dados.
            </p>
            <button
              onClick={handleGetDatabaseStatus}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              {isProcessing ? 'Verificando...' : 'Verificar Status'}
            </button>
          </div>

          {/* Backup Database */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <h2 className="text-xl font-semibold text-green-800 mb-3">
              💾 Backup da Base de Dados
            </h2>
            <p className="text-gray-600 mb-4">
              Criar e baixar um backup completo de todas as coleções.
            </p>
            <button
              onClick={handleBackupDatabase}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              {isProcessing ? 'Criando Backup...' : 'Criar Backup'}
            </button>
          </div>

          {/* Seed Database */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <h2 className="text-xl font-semibold text-purple-800 mb-3">
              🌱 Popular Base de Dados
            </h2>
            <p className="text-gray-600 mb-4">
              Adicionar dados padrão às coleções. Seguro para executar múltiplas vezes.
            </p>
            <button
              onClick={handleSeedDatabase}
              disabled={isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              {isProcessing ? 'Populando...' : 'Popular Base de Dados'}
            </button>
          </div>

          {/* Drop Database */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-red-800 mb-3">
              🗑️ Excluir Toda a Base de Dados
            </h2>
            <p className="text-red-600 font-medium mb-4">
              ⚠️ PERIGOSO: Remove TODOS os dados de TODAS as coleções permanentemente!
            </p>
            <button
              onClick={handleDropDatabase}
              disabled={isProcessing}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              {isProcessing ? 'Excluindo...' : '🚨 EXCLUIR TUDO'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="space-x-4">
            <Link
              href="/admin"
              className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ← Painel Admin Normal
            </Link>
            <Link
              href="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ← Voltar ao App
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Guia de Operações</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <strong>Status:</strong> Mostra informações sobre as coleções existentes e contagem de documentos.
            </div>
            <div>
              <strong>Backup:</strong> Exporta todos os dados em formato JSON para download.
            </div>
            <div>
              <strong>Popular:</strong> Adiciona dados iniciais às coleções. Não remove dados existentes.
            </div>
            <div>
              <strong className="text-red-600">Excluir Tudo:</strong> Remove completamente todas as coleções e dados. 
              <span className="text-red-700 font-medium"> Esta operação NÃO pode ser desfeita!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}