# Spirare — Meditação Guiada Interativa

Spirare é um ritual de meditação guiada construído com Next.js 15, TypeScript e TailwindCSS. A experiência apresenta narrativa em áudio, temporizadores inteligentes, visualização rítmica de respiração e um metrônomo líquido que conduz a prática do início ao fim.

## ✨ Experiência

- **Fluxo de 4 etapas × 4 momentos** — jornada fixa para cultivar presença, respiração, imaginação e integração
- **Narrativa por IA** — cada instrução é narrada via rota `/api/speech` usando o modelo `gpt-4o-mini-tts`
- **Timer líquido + gráfico de respiração** — progresso circular combinado com visualizador em glassmorphism
- **Metrônomo com período ajustável** — knob 3D controla o intervalo das batidas (600–1800 ms)
- **Controles conscientes** — play/pause, pular momento, encerramento e reinício rápido
- **Sistema de gestão completo** — interface administrativa para editar conteúdos, temas e áudios
- **Banco de dados MongoDB** — armazenamento estruturado com validação Zod

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

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── [category]/[stage]/[practice]/[variant]/  # Páginas dinâmicas
│   ├── admin/                                     # Interface administrativa
│   ├── api/                                       # API Routes
│   │   ├── speech/                               # Text-to-Speech
│   │   ├── meditation/[category]/                # Composição de sessões
│   │   └── database/                             # CRUD APIs
│   └── components/                               # Componentes React
├── providers/                                     # React Query hooks
├── types/                                         # TypeScript types globais
├── lib/                                          # Utilitários (MongoDB)
└── styles/                                       # Estilos globais

rules/                                            # Documentação de desenvolvimento
├── DATABASE.md                                   # Sistema de banco de dados
├── TYPE_SAFETY_RULES.md                          # Regras de type safety
├── GLOBAL_API_TYPES.md                           # Tipos de API
├── MEDITATION_API_REVIEW.md                      # Review do meditation API
└── README.md                                     # Visão geral das regras
```

## 🎨 Interface Administrativa

Acesse a interface de gestão em: `http://localhost:3000/admin`

**Credenciais padrão:**
- Username: `admin`
- Password: `abreuelima`

**Funcionalidades:**
- Gestão de Áudios (upload, edição, controle)
- Gestão de Temas (criação, personalização)
- Edição de Conteúdo (textos de cada fase)
- Estrutura Personalizável (ordem e duração)

## 📚 Documentação para Desenvolvedores

Para contribuir com o projeto, consulte a documentação em `/rules`:

- **[/rules/DATABASE.md](/rules/DATABASE.md)** - Sistema de banco de dados completo
- **[/rules/TYPE_SAFETY_RULES.md](/rules/TYPE_SAFETY_RULES.md)** - Regras de type safety
- **[/rules/GLOBAL_API_TYPES.md](/rules/GLOBAL_API_TYPES.md)** - Sistema de tipos de API
- **[/rules/MEDITATION_API_REVIEW.md](/rules/MEDITATION_API_REVIEW.md)** - Review e melhorias do API
- **[/rules/README.md](/rules/README.md)** - Visão geral das regras de desenvolvimento

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

**Importante:** Antes de contribuir, leia a documentação em `/rules` para entender os padrões do projeto.

## 📄 Licença

Distribuído sob licença MIT. Consulte `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- OpenAI pela API de Text-to-Speech
- Comunidade Next.js
- Todos os contribuidores do projeto
