# Spirare File Structure and Organization

This document outlines the complete file structure and organization patterns for the Spirare meditation application.

## 🧭 Project Structure

```
src/
├── app/
│   ├── [category]/               # Navegação por categoria
│   │   ├── [stage]/             # Etapas da meditação
│   │   │   ├── [practice]/      # Práticas específicas
│   │   │   │   ├── [variant]/   # Variantes de texto
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── admin/                    # Interface administrativa
│   │   ├── _components/         # Componentes específicos do admin
│   │   ├── layout.tsx           # Layout com autenticação
│   │   └── page.tsx             # Página principal do admin
│   ├── api/
│   │   ├── admin/
│   │   │   └── auth/route.ts    # Autenticação do admin
│   │   ├── speech/route.ts      # Rota de TTS
│   │   ├── categories/route.ts  # Lista de categorias
│   │   └── database/            # APIs CRUD para dados
│   │       ├── route.ts         # Database principal
│   │       ├── seed/route.ts    # Seeding do banco
│   │       ├── songs/          # CRUD de áudios
│   │       └── themes/          # CRUD de temas
│   ├── components/              # Componentes globais puros (sem API calls)
│   │   └── meditation/          # Componentes da experiência
│   ├── layout.tsx
│   ├── query-provider.tsx       # React Query provider
│   └── page.tsx                 # Home com seletor de categoria
├── constants/meditation.ts      # Conteúdo da sessão
├── providers/                   # React Query hooks para API calls
│   ├── useCategoriesQuery.ts    # Query de categorias
│   ├── mutations-example.ts     # Exemplo de mutations
│   └── index.ts                 # Exports centralizados
├── styles/                      # Estilos globais
│   └── globals.css              # Configuração Tailwind e estilos base
├── services/                    # Camada de serviços MongoDB
│   ├── songsService.ts
│   ├── themesService.ts
│   ├── meditationsService.ts
│   ├── structureService.ts
│   └── databaseService.ts
├── scripts/
│   └── seedDatabase.ts          # Script de inicialização
├── types/
│   ├── meditation.ts            # Tipagens da interface
│   └── database.ts              # Schemas Zod e tipos do banco
└── lib/mongodb.ts               # Conexão MongoDB
```

## 📐 Component Organization Rules

### **`src/app/components/`** - Global Pure Components

**Purpose**: Componentes **globais e puros**, sem chamadas a APIs

**Rules**:

- Componentes reutilizáveis em todo o app
- Apenas recebem props e renderizam UI
- Exemplo: botões, cards, layouts genéricos
- ❌ **NUNCA** fazer chamadas a APIs ou usar React Query
- ❌ **NUNCA** usar useState para dados externos
- ✅ **SEMPRE** usar apenas props e callbacks

### **`src/app/[route]/_components/`** - Route-Specific Components

**Purpose**: Componentes **específicos de uma rota**

**Rules**:

- Usam o prefixo `_` para indicar que são privados
- Podem fazer chamadas a APIs e usar hooks de dados
- Exemplo: `src/app/admin/_components/ThemeEditor.tsx`
- ✅ **PODEM** usar React Query providers
- ✅ **PODEM** usar useState, useEffect e outros hooks
- ✅ **PODEM** conter lógica específica da rota

### **`src/app/[route]/page.tsx`** - Pages with Logic

**Purpose**: Páginas podem conter lógica

**Rules**:

- Lógica de fetching com React Query
- useState, useEffect e outros hooks
- Não extrair em componentes separados a menos que necessário para reuso
- ✅ **PODEM** conter toda a lógica da página inline
- ✅ **PODEM** usar múltiplos providers
- ❌ **NÃO** extrair em componentes se usado apenas uma vez

### Example Organization

```typescript
src/app/
├── components/              # ✅ Componentes puros globais
│   ├── Button.tsx          # Botão reutilizável
│   └── Card.tsx            # Card genérico
├── admin/
│   ├── _components/        # ✅ Componentes do admin
│   │   ├── ThemeForm.tsx  # Formulário de tema (usa API)
│   │   └── SongList.tsx  # Lista de áudios (usa API)
│   └── page.tsx           # ✅ Página com lógica inline
└── [category]/
    ├── _components/        # ✅ Componentes da categoria
    │   └── StageCard.tsx  # Card específico de etapa
    └── page.tsx           # ✅ Página com lógica inline
```

## 🧱 Architecture Layers

### Frontend (Interface de Meditação)

| Área                                   | Descrição                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/constants/meditation.ts`          | Conteúdo canônico da sessão (tema "Paz Interior", etapas e duração padrão de 120 s por subetapa).            |
| `src/app/components/meditation/`       | Conjunto modular de componentes (StartOverlay, SessionHeader, TimerPanel, BreathVisualizer, Controles etc.). |
| `src/app/components/meditation/hooks/` | Hooks dedicados para fala (`useSpeech`) e metrônomo (`useMetronome`).                                        |

### Backend (API e Banco de Dados)

| Área                          | Descrição                                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/app/api/speech/route.ts` | Rota Next.js que consome o SDK oficial da OpenAI para gerar o áudio em tempo real.                    |
| `src/app/api/database/`       | CRUD APIs para áudios, temas e conteúdos de meditação.                                                |
| `src/services/`               | Camada de serviços para interação com MongoDB (SongService, ThemeService, MeditationDatabaseService). |
| `src/types/database.ts`       | Schemas Zod para validação de dados e tipos TypeScript.                                               |

### Sistema de Gestão

| Área                          | Descrição                                           |
| ----------------------------- | --------------------------------------------------- |
| `src/app/admin/`              | Interface administrativa para gestão de conteúdos.  |
| `src/scripts/seedDatabase.ts` | Script para popular o banco com dados iniciais.     |
| `DATABASE.md`                 | Documentação completa do sistema de banco de dados. |

## 📁 File Organization Guidelines

### **`src/styles/`** - Global Styles

**Rules**:

- Use Sass (`.sass` ou `.scss`) para estilos customizados
- `globals.css` - estilos globais e configuração do Tailwind
- Evite CSS inline ou CSS modules quando possível

### **`public/`** - Static Assets

**Rules**:

- Todos os ícones e favicons devem estar aqui
- Imagens, fontes, e outros assets públicos
- Acessível via `/` (ex: `/icon.svg`)

### **`src/providers/`** - React Query Hooks

**Rules**:

- **Um provider por arquivo**: cada hook em seu próprio arquivo
- Se precisar de escopo, crie um diretório (ex: `CategoryProviders/`)
- **Queries**: Fetching de dados com cache automático (GET requests)
- **Mutations**: Operações de escrita (POST, PUT, DELETE)
- Cada provider exporta um único hook específico
- `index.ts` re-exporta todos os providers

### **`src/types/`** - Type Definitions

**Rules**:

- `database.ts` - Schemas Zod e tipos de banco de dados (Theme, Song, Structure, Meditations)
- `api.ts` - Tipos de API (requests, responses, payloads)
- `index.ts` - Re-exporta todos os tipos para import centralizado

## 🎯 Critical Guidelines

> Todos os elementos interativos recebem `cursor: pointer`, garantindo consistência com a diretriz de interação do produto.

### Interactive Elements

- **Overlay inicial**: botão circular sem textos internos, apenas ícones (Play + Wind) com efeito líquido.
- **Header**: badge de milestone, LED ritmado pelo metrônomo e botão "Avançar Etapa".
- **Visualizador de respiração**: barras em glassmorphism pulsando conforme o período configurado.
- **Knob 3D**: controla o período do metrônomo com feedback de BPM e micro-animações no ritmo das batidas.
- **Controles finais**: opções para encerrar ou reiniciar a jornada; na fase final o metrônomo permanece ativo.

## 🔗 Related Rules

- **[REACT_QUERY_PATTERNS.md](./REACT_QUERY_PATTERNS.md)** - Data fetching patterns
- **[TYPE_SAFETY_RULES.md](./TYPE_SAFETY_RULES.md)** - Type organization
- **[COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md)** - Component patterns
- **[DATABASE.md](./DATABASE.md)** - Service layer organization
