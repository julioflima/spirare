# Spirare — Meditação Guiada Interativa

**Spirare** (do latim "respirar") é uma aplicação web de meditação guiada que combina técnicas milenares com tecnologia moderna para criar experiências personalizadas de mindfulness e bem-estar emocional.

## 🎯 Propósito

A meditação é uma ferramenta poderosa para cultivar presença, reduzir ansiedade e promover equilíbrio emocional. Porém, práticas tradicionais muitas vezes carecem de personalização para diferentes contextos e necessidades individuais.

**Spirare** resolve isso oferecendo:

- **Sessões dinâmicas e personalizadas** — cada meditação é única, composta em tempo real a partir de um banco de conteúdos calibrados para diferentes temas (ansiedade, foco, sono, etc.)
- **Narrativa inteligente por IA** — instruções são narradas com voz natural usando Text-to-Speech, eliminando a necessidade de gravações pré-produzidas
- **Ritmo adaptável** — metrônomo visual e sonoro que você controla para sincronizar com sua respiração natural
- **Sistema de gestão completo** — interface administrativa que permite criar, editar e personalizar conteúdos, temas e estruturas de meditação sem tocar em código

## 💡 Como Funciona

Cada sessão de meditação segue uma jornada de **4 etapas científicas**:

1. **Abertura (Opening)** — contextualização, intenção e preparação do ambiente
2. **Concentração (Concentration)** — foco na respiração, relaxamento corporal e silêncio funcional
3. **Exploração (Exploration)** — aprofundamento no tema específico (ex: visualizações para ansiedade)
4. **Despertar (Awakening)** — reorientação corporal, respiração final e integração

Dentro de cada etapa, há **práticas específicas** que podem ser:
- **Gerais** — frases compartilhadas por todos os temas
- **Específicas** — frases personalizadas para o tema escolhido (ex: ansiedade tem suas próprias visualizações)

O sistema seleciona **aleatoriamente** uma frase diferente a cada sessão, garantindo que a experiência nunca seja repetitiva, mesmo para o mesmo tema.

## ✨ Recursos Principais

### Para Praticantes
- 🎙️ **Narração por IA em tempo real** — Text-to-Speech natural que narra cada instrução
- ⏱️ **Timer circular líquido** — visualização suave do progresso da sessão
- 🌬️ **Gráfico de respiração** — barras pulsantes em glassmorphism que guiam a cadência
- 🎛️ **Metrônomo ajustável** — controle 3D para definir o ritmo (600-1800ms) que melhor se adapta à sua respiração
- 🎵 **Áudios ambientes** — trilhas de fundo selecionáveis para aprofundar a imersão
- ⏭️ **Controles intuitivos** — play/pause, pular prática, encerrar ou reiniciar a qualquer momento

### Para Administradores
- 📝 **Editor de conteúdos** — crie e edite frases para cada prática de meditação
- 🎨 **Gestor de temas** — defina novos temas (ansiedade, foco, sono) com conteúdos específicos
- 🔧 **Configurador de estrutura** — determine quais práticas usam conteúdo geral vs específico
- 🎵 **Biblioteca de áudios** — faça upload e gerencie trilhas sonoras de fundo
- ✅ **Validação automática** — todos os dados são validados com Zod antes de salvar

## 🛠️ Tecnologias

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** strict mode
- **TailwindCSS 4** + Sass
- **MongoDB** com agregações otimizadas
- **React Query** para data fetching
- **Zod** para validação de schemas
- **OpenAI SDK** (`gpt-4o-mini-tts`) para Text-to-Speech

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- MongoDB (local ou Atlas)
- Conta OpenAI com acesso à API

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/spirare.git
cd spirare

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### Variáveis de Ambiente

Crie um arquivo `.env.local`:

```bash
# OpenAI API (para Text-to-Speech)
OPENAI_API_KEY=your_openai_api_key

# MongoDB (local ou Atlas)
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=spirare

# Admin (opcional - padrões abaixo)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=abreuelima
```

### Inicialização do Banco de Dados

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Em outro terminal ou no navegador, popule o banco:
curl -X POST http://localhost:3000/api/database/seed
# Ou acesse: http://localhost:3000/api/database/seed
```

### Executar

```bash
npm run dev
# Abra http://localhost:3000
```

### Build para Produção

```bash
npm run build
npm start
```

## � Documentação

Para desenvolvedores, consulte:

- **[Copilot Instructions](.github/copilot-instructions.md)** - Padrões de desenvolvimento
- **[Rules Directory](/rules/)** - Documentação técnica completa

## 🤝 Contribuindo

Antes de contribuir, leia a documentação em `/rules` para entender os padrões do projeto.

## 📄 Licença

Distribuído sob licença MIT. Consulte `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- OpenAI pela API de Text-to-Speech
- Comunidade Next.js
- Todos os contribuidores do projeto
