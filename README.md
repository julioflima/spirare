# Spirare — Meditação Guiada Interativa

Spirare é um ritual de meditação guiada construído com Next.js 15, TypeScript e TailwindCSS. A experiência apresenta## 🧩 Funcionalidades

### Interface de Meditação
- **Overlay inicial**: botão circular sem textos internos, apenas ícones (Play + Wind) com efeito líquido.
- **Header**: badge de milestone, LED ritmado pelo metrônomo e botão "Avançar Etapa".
- **Visualizador de respiração**: barras em glassmorphism pulsando conforme o período configurado.
- **Knob 3D**: controla o período do metrônomo com feedback de BPM e micro-animações no ritmo das batidas.
- **Controles finais**: opções para encerrar ou reiniciar a jornada; na fase final o metrônomo permanece ativo.

### Sistema Administrativo
- **Gestão de Áudios**: upload, edição e controle de trilhas sonoras de fundo.
- **Gestão de Temas**: criação e personalização de temas de meditação (ansiedade, foco, etc.).
- **Edição de Conteúdo**: interface para modificar textos de cada fase da meditação.
- **Estrutura Personalizável**: definição da ordem e duração dos elementos em cada etapa.
- **Validação Completa**: todos os dados são validados com Zod antes de serem salvos.

### API e Dados
- **CRUD Completo**: endpoints REST para todas as operações de dados.
- **Validação de Schema**: Zod assegura integridade dos dados em todos os níveis.
- **Type Safety**: TypeScript garante consistência entre frontend e backend.
- **Seeding Automático**: população inicial do banco com dados estruturados.iva em áudio, temporizadores inteligentes, visualização rítmica de respiração e um sistema completo de gestão de conteúdo.

## ✨ Experiência

- **Fluxo de 4 etapas × 4 momentos** — jornada fixa para cultivar presença, respiração, imaginação e integração.
- **Narrativa por IA** — cada instrução é narrada via rota `/api/speech` usando o modelo `gpt-4o-mini-tts`.
- **Timer líquido + gráfico de respiração** — progresso circular combinado com visualizador em glassmorphism para indicar a cadência.
- **Metrônomo com período ajustável** — knob 3D controla o intervalo das batidas (600–1800 ms) e sincroniza o LED superior.
- **Controles conscientes** — play/pause, pular momento, encerramento e reinício rápido.
- **Sistema de gestão completo** — interface administrativa para editar conteúdos, temas e áudios.
- **Banco de dados MongoDB** — armazenamento estruturado com validação Zod para todos os dados.Meditação Guiada Interativa

Spirare é um ritual de meditação guiada construído com Next.js 15, TypeScript e TailwindCSS. A experiência apresenta narrativa em áudio, temporizadores inteligentes, visualização rítmica de respiração e um metrônomo líquido que conduz a prática do início ao fim.

## ✨ Experiência

- **Fluxo de 4 etapas × 4 momentos** — jornada fixa para cultivar presença, respiração, imaginação e integração.
- **Narrativa por IA** — cada instrução é narrada via rota `/api/speech` usando o modelo `gpt-4o-mini-tts`.
- **Timer líquido + gráfico de respiração** — progresso circular combinado com visualizador em glassmorphism para indicar a cadência.
- **Metrônomo com período ajustável** — knob 3D controla o intervalo das batidas (600–1800 ms) e sincroniza o LED superior.
- **Controles conscientes** — play/pause, pular momento, encerramento e reinício rápido.
- **Overlay inicial líquido** — botão apenas com ícones seguindo o conceito “liquid glass”.

## 🧱 Arquitetura

### Frontend (Interface de Meditação)
| Área                                   | Descrição                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/constants/meditation.ts`          | Conteúdo canônico da sessão (tema "Paz Interior", etapas e duração padrão de 120 s por subetapa).            |
| `src/app/components/meditation/`       | Conjunto modular de componentes (StartOverlay, SessionHeader, TimerPanel, BreathVisualizer, Controles etc.). |
| `src/app/components/meditation/hooks/` | Hooks dedicados para fala (`useSpeech`) e metrônomo (`useMetronome`).                                        |

### Backend (API e Banco de Dados)
| Área                                   | Descrição                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/app/api/speech/route.ts`          | Rota Next.js que consome o SDK oficial da OpenAI para gerar o áudio em tempo real.                           |
| `src/app/api/database/`                | CRUD APIs para áudios, temas e conteúdos de meditação.                                                       |
| `src/services/`                        | Camada de serviços para interação com MongoDB (AudioService, ThemeService, MeditationDatabaseService).      |
| `src/types/database.ts`                | Schemas Zod para validação de dados e tipos TypeScript.                                                      |

### Sistema de Gestão
| Área                                   | Descrição                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/app/admin/`                       | Interface administrativa para gestão de conteúdos.                                                          |
| `src/scripts/seedDatabase.ts`          | Script para popular o banco com dados iniciais.                                                              |
| `DATABASE.md`                          | Documentação completa do sistema de banco de dados.                                                          |

> Todos os elementos interativos recebem `cursor: pointer`, garantindo consistência com a diretriz de interação do produto.

## 🛠️ Tecnologias

### Frontend
- Next.js 15 (App Router) + React 19
- TypeScript estrito
- TailwindCSS 4 (modo JIT)
- `react-circular-progressbar` para o halo de progresso
- `lucide-react` para iconografia
- Web Audio API para o metrônomo granuloso
- OpenAI SDK (`gpt-4o-mini-tts`) para Text-to-Speech

### Backend & Database
- MongoDB (nativo driver) para armazenamento de dados
- Zod para validação de schemas
- Next.js API Routes para endpoints REST
- TypeScript para type safety em toda a aplicação

## 🎨 Identidade de Marca

- **Nome**: Spirare
- **Essência**: respiração guiada, luz difusa, sensação de orbitar calma.
- **Paleta principal**:
  - Verde floresta `#065f46`
  - Verde brisa `#34d399`
  - Amarelo amanhecer `#fbbf24`
  - Marfim luminoso `#fef9f3`
- **Arquivos oficiais**:
  - Marca: [`public/spirare-mark.svg`](public/spirare-mark.svg)
  - Logotipo horizontal: [`public/spirare-logotype.svg`](public/spirare-logotype.svg)
  - Favicon/App icon: [`src/app/icon.svg`](src/app/icon.svg)
- **Uso**: mantenha a marca sobre fundos claros translúcidos (glassmorphism). Evite distorcer os cantos arredondados e preserve o brilho suave aplicado às superfícies.

## 🖥️ Execução local

```bash
npm install
npm run dev
# abre em http://localhost:3000
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```bash
# OpenAI API (para Text-to-Speech)
OPENAI_API_KEY=your_openai_api_key

# MongoDB (local ou Atlas)
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=spirare
```

### Inicialização do Banco de Dados

Após configurar o MongoDB, popule com dados iniciais:

```bash
# Via API (aplicação rodando)
curl -X POST http://localhost:3000/api/database/seed

# Ou acesse diretamente no navegador
# http://localhost:3000/api/database/seed
```

### Interface Administrativa

Acesse a interface de gestão em:
```
http://localhost:3000/admin
```

## 🧭 Estrutura

```
src/
├── app/
│   ├── admin/                     # Interface administrativa
│   │   ├── components/           # Componentes da interface admin
│   │   └── page.tsx              # Página principal do admin
│   ├── api/
│   │   ├── speech/route.ts       # Rota de TTS
│   │   └── database/             # APIs CRUD para dados
│   │       ├── route.ts          # Database principal
│   │       ├── seed/route.ts     # Seeding do banco
│   │       ├── audios/           # CRUD de áudios
│   │       └── themes/           # CRUD de temas
│   ├── components/
│   │   ├── meditation/           # Componentes da experiência
│   │   └── MeditationGenerator.tsx
│   ├── icon.svg                  # Favicon / PWA icon
│   ├── layout.tsx
│   └── page.tsx
├── constants/meditation.ts       # Conteúdo da sessão
├── services/                     # Camada de serviços MongoDB
│   ├── audioService.ts
│   ├── themeService.ts
│   └── meditationDatabaseService.ts
├── scripts/
│   └── seedDatabase.ts           # Script de inicialização
├── types/
│   ├── meditation.ts             # Tipagens da interface
│   └── database.ts               # Schemas Zod e tipos do banco
└── lib/mongodb.ts                # Conexão MongoDB
```

## 🧩 Interação em detalhes

- **Overlay inicial**: botão circular sem textos internos, apenas ícones (Play + Wind) com efeito líquido.
- **Header**: badge de milestone, LED ritmado pelo metrônomo e botão “Avançar Etapa”.
- **Visualizador de respiração**: barras em glassmorphism pulsando conforme o período configurado.
- **Knob 3D**: controla o período do metrônomo com feedback de BPM e micro-animações no ritmo das batidas.
- **Controles finais**: opções para encerrar ou reiniciar a jornada; na fase final o metrônomo permanece ativo.

## 🔭 Próximos passos sugeridos

- Geração dinâmica de roteiros via IA a partir de temas livres.
- Biblioteca de trilhas sonoras ambientes expandida.
- Sistema de usuários e histórico de sessões.
- Exportação de sessões e compartilhamento.
- Modo escuro multi-tons.
- Analytics de uso e progresso pessoal.
- Integração com dispositivos wearable para biofeedback.

## 📚 Documentação Adicional

- [`DATABASE.md`](DATABASE.md) - Documentação completa do sistema de banco de dados
- [`.github/copilot-instructions.md`](.github/copilot-instructions.md) - Instruções para desenvolvimento com Copilot

## 📄 Licença

Distribuído sob licença MIT. Consulte `LICENSE` para mais detalhes.
