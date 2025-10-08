# Spirare — Meditação Guiada Interativa

Spirare é um ritual de meditação guiada construído com Next.js 15, TypeScript e TailwindCSS. A experiência apresenta narrativa em áudio, temporizadores inteligentes, visualização rítmica de respiração e um metrônomo líquido que conduz a prática do início ao fim.

## ✨ Experiência

- **Fluxo de 4 etapas × 4 momentos** — jornada fixa para cultivar presença, respiração, imaginação e integração.
- **Narrativa por IA** — cada instrução é narrada via rota `/api/speech` usando o modelo `gpt-4o-mini-tts`.
- **Timer líquido + gráfico de respiração** — progresso circular combinado com visualizador em glassmorphism para indicar a cadência.
- **Metrônomo com período ajustável** — knob 3D controla o intervalo das batidas (600–1800 ms) e sincroniza o LED superior.
- **Controles conscientes** — play/pause, pular momento, encerramento e reinício rápido.
- **Overlay inicial líquido** — botão apenas com ícones seguindo o conceito “liquid glass”.

## 🧱 Arquitetura

| Área                                   | Descrição                                                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `src/constants/meditation.ts`          | Conteúdo canônico da sessão (tema “Paz Interior”, etapas e duração padrão de 120 s por subetapa).            |
| `src/app/components/meditation/`       | Conjunto modular de componentes (StartOverlay, SessionHeader, TimerPanel, BreathVisualizer, Controles etc.). |
| `src/app/components/meditation/hooks/` | Hooks dedicados para fala (`useSpeech`) e metrônomo (`useMetronome`).                                        |
| `src/app/api/speech/route.ts`          | Rota Next.js que consome o SDK oficial da OpenAI para gerar o áudio em tempo real.                           |

> Todos os elementos interativos recebem `cursor: pointer`, garantindo consistência com a diretriz de interação do produto.

## 🛠️ Tecnologias

- Next.js 15 (App Router) + React 19
- TypeScript estrito
- TailwindCSS 4 (modo JIT)
- `react-circular-progressbar` para o halo de progresso
- `lucide-react` para iconografia
- Web Audio API para o metrônomo granuloso
- OpenAI SDK (`gpt-4o-mini-tts`) para Text-to-Speech

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

Para gerar áudio é necessário definir `OPENAI_API_KEY` no arquivo `.env.local`.

## 🧭 Estrutura

```
src/
├── app/
│   ├── api/speech/route.ts        # Rota de TTS
│   ├── components/
│   │   ├── meditation/            # Componentes refatorados da experiência
│   │   └── MeditationGenerator.tsx# Re-export mantém o import da página
│   ├── icon.svg                   # Favicon / PWA icon
│   ├── layout.tsx
│   └── page.tsx
├── constants/meditation.ts        # Conteúdo da sessão
└── types/meditation.ts            # Tipagens compartilhadas
```

## 🧩 Interação em detalhes

- **Overlay inicial**: botão circular sem textos internos, apenas ícones (Play + Wind) com efeito líquido.
- **Header**: badge de milestone, LED ritmado pelo metrônomo e botão “Avançar Etapa”.
- **Visualizador de respiração**: barras em glassmorphism pulsando conforme o período configurado.
- **Knob 3D**: controla o período do metrônomo com feedback de BPM e micro-animações no ritmo das batidas.
- **Controles finais**: opções para encerrar ou reiniciar a jornada; na fase final o metrônomo permanece ativo.

## 🔭 Próximos passos sugeridos

- Geração dinâmica de roteiros via IA a partir de temas livres.
- Biblioteca de trilhas sonoras ambientes.
- Exportação de sessões e compartilhamento.
- Modo escuro multi-tons.

## 📄 Licença

Distribuído sob licença MIT. Consulte `LICENSE` para mais detalhes.
