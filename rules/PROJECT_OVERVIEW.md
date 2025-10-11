# Spirare — Meditação Guiada Interativa

Spirare é um ritual de meditação guiada construído com Next.js 15, TypeScript e TailwindCSS. A experiência apresenta narrativa em áudio, temporizadores inteligentes, visualização rítmica de respiração e um sistema completo de gestão de conteúdo.

## ✨ Experiência

- **Fluxo de 4 etapas × 4 momentos** — jornada fixa para cultivar presença, respiração, imaginação e integração.
- **Narrativa por IA** — cada instrução é narrada via rota `/api/speech` usando o modelo `gpt-4o-mini-tts`.
- **Timer líquido + gráfico de respiração** — progresso circular combinado com visualizador em glassmorphism para indicar a cadência.
- **Metrônomo com período ajustável** — knob 3D controla o intervalo das batidas (600–1800 ms) e sincroniza o LED superior.
- **Controles conscientes** — play/pause, pular momento, encerramento e reinício rápido.
- **Overlay inicial líquido** — botão apenas com ícones seguindo o conceito "liquid glass".

## 🧩 Funcionalidades

### Interface de Meditação

- **Overlay inicial**: botão circular sem textos internos, apenas ícones (Play + Wind) com efeito líquido.
- **Header**: badge de milestone, LED ritmado pelo metrônomo e botão "Avançar Etapa".
- **Visualizador de respiração**: barras em glassmorphism pulsando conforme o período configurado.
- **Knob 3D**: controla o período do metrônomo com feedback de micro-animações no ritmo das batidas.
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
- **Seeding Automático**: população inicial do banco com dados estruturados.

## 🛠️ Tecnologias

### Frontend

- Next.js 15 (App Router) + React 19
- TypeScript estrito
- TailwindCSS 4 (modo JIT) + Sass para estilos customizados
- `@tanstack/react-query` para data fetching e caching
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
  - Marca: `public/spirare-mark.svg`
  - Logotipo horizontal: `public/spirare-logotype.svg`
  - Favicon/App icon: `public/icon.svg`
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

A interface administrativa é protegida por autenticação. As credenciais podem ser configuradas via variáveis de ambiente:

```bash
ADMIN_USERNAME=admin        # Padrão: admin
ADMIN_PASSWORD=abreuelima   # Padrão: abreuelima
```

Acesse a interface de gestão em:

```
http://localhost:3000/admin
```

## 🔭 Próximos passos sugeridos

- Geração dinâmica de roteiros via IA a partir de temas livres.
- Biblioteca de trilhas sonoras ambientes expandida.
- Sistema de usuários e histórico de sessões.
- Exportação de sessões e compartilhamento.
- Modo escuro multi-tons.
- Analytics de uso e progresso pessoal.
- Integração com dispositivos wearable para biofeedback.

## 📄 Licença

Distribuído sob licença MIT. Consulte `LICENSE` para mais detalhes.