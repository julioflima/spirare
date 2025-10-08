# Spirare - Meditação Guiada Interativa# Spirare - Gerador de Meditações



Uma aplicação Next.js que oferece meditações guiadas com timer, narração automática e metrônomo de relaxamento.Uma aplicação Next.js que gera meditações personalizadas com base em temas escolhidos pelo usuário.



## 🎯 Sobre o Projeto## 🎯 Sobre o Projeto



Spirare é uma aplicação de meditação guiada que proporciona uma experiência imersiva e interativa. A meditação segue uma estrutura de 4 etapas com 16 momentos únicos de reflexão:Spirare é um gerador de meditações que cria experiências contemplativas personalizadas seguindo uma estrutura de 4 etapas:



1. **Acolhimento** - Preparação e conexão com o momento presente1. **Acolhimento** - Preparação e conexão com o momento presente

2. **Respiração e presença** - Técnicas de respiração e mindfulness  2. **Respiração e presença** - Técnicas de respiração e mindfulness

3. **Exploração do tema** - Desenvolvimento do tema "Paz Interior"3. **Exploração do tema** - Desenvolvimento do tema escolhido pelo usuário

4. **Encerramento e reflexão** - Conclusão e integração da prática4. **Encerramento e reflexão** - Conclusão e integração da prática



## ✨ Funcionalidades Principais## 🚀 Tecnologias Utilizadas



- 🎧 **Narração Automática** - Cada etapa é lida automaticamente usando Text-to-Speech- **Next.js 15** - Framework React com App Router

- ⏱️ **Timer Inteligente** - 2 minutos por subetapa com progressão automática- **TypeScript** - Tipagem estática

- 📊 **Gráfico de Progresso** - Visualização circular do tempo e progresso geral- **TailwindCSS** - Estilização utilitária

- ⏸️ **Controles de Reprodução** - Pausar, retomar e reiniciar a meditação- **React Hooks** - Gerenciamento de estado

- 🎵 **Metrônomo Final** - Som relaxante ao final da meditação- **LocalStorage** - Persistência de meditações anteriores

- 📱 **Interface Responsiva** - Design otimizado para todos os dispositivos

- 🌈 **Design Calmante** - Gradientes suaves e cores relaxantes## 📱 Funcionalidades



## 🚀 Tecnologias Utilizadas- ✨ Geração de meditações personalizadas

- 🎨 Interface limpa e minimalista

- **Next.js 15** - Framework React com App Router- 💾 Salvamento automático no navegador

- **TypeScript** - Tipagem estática para maior segurança- 📱 Design responsivo

- **TailwindCSS** - Framework CSS utilitário- 🌈 Gradientes e animações suaves

- **React Circular Progressbar** - Gráficos de progresso circulares

- **Lucide React** - Ícones modernos e limpos## 🏗️ Estrutura do Projeto

- **Web Speech API** - Síntese de voz nativa do navegador

- **Web Audio API** - Geração de sons do metrônomo```

src/

## 🎮 Como Usar├── app/

│   ├── components/

1. **Clique em "Começar Meditação"** para iniciar│   │   ├── MeditationGenerator.tsx  # Componente principal

2. **Feche os olhos e relaxe** - o texto será narrado automaticamente│   │   └── MeditationStep.tsx       # Componente de etapa

3. **Acompanhe o progresso** através do gráfico circular e timer│   ├── layout.tsx                   # Layout da aplicação

4. **Use os controles** para pausar/retomar se necessário│   └── page.tsx                     # Página principal

5. **Aproveite o metrônomo** ao final para relaxamento profundo├── prompts/

│   └── meditationPrompt.ts          # Prompt para geração de meditações

## 📱 Funcionalidades da Interface└── types/

    └── meditation.ts                # Tipos TypeScript

### Tela Inicial```

- Botão de início simples e elegante

- Descrição clara da experiência## 🛠️ Como Executar



### Durante a Meditação  1. **Instalar dependências:**

- **Timer visual** com contagem regressiva   ```bash

- **Gráfico circular** mostrando progresso da etapa atual   npm install

- **Indicador de progresso geral** (X de 16 momentos)   ```

- **Texto atual** sendo narrado

- **Controles de pausa/play e reiniciar**2. **Executar em modo de desenvolvimento:**

   ```bash

### Metrônomo Final   npm run dev

- **Som rítmico** para relaxamento profundo   ```

- **Interface dedicada** com animações visuais

- **Controle para parar** quando desejar3. **Abrir no navegador:**

   ```

## 🏗️ Estrutura do Projeto   http://localhost:3000

   ```

```

src/## 🎨 Como Usar

├── app/

│   ├── components/1. Digite um tema para sua meditação (ex: "Gratidão", "Perdão", "Sono tranquilo")

│   │   └── MeditationGenerator.tsx  # Componente principal com toda a lógica2. Clique em "Gerar Meditação"

│   ├── layout.tsx                   # Layout da aplicação3. Siga as 4 etapas da meditação gerada

│   └── page.tsx                     # Página principal4. Suas meditações ficam salvas no navegador para acesso posterior

├── prompts/

│   └── meditationPrompt.ts          # Prompt original (para referência)## 🔮 Próximas Funcionalidades

└── types/

    └── meditation.ts                # Tipos TypeScript- [ ] Integração com APIs de IA para geração dinâmica

```- [ ] Audio guiado para as meditações

- [ ] Compartilhamento de meditações

## ⚙️ Detalhes Técnicos- [ ] Histórico detalhado de práticas

- [ ] Tempos personalizáveis para cada etapa

### Timer e Progressão

- Cada subetapa dura **2 minutos** (120 segundos)## 📄 Licença

- Progressão automática entre etapas

- 16 momentos únicos de reflexãoEste projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

- Gráfico de pizza mostra progresso visual

## 🤝 Contribuições

### Síntese de Voz

- Configurada para português brasileiro (pt-BR)Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

- Velocidade otimizada para meditação (0.8x)
- Tom suave e relaxante

### Metrônomo
- Frequência de 800Hz para som suave
- Ritmo de 60 BPM (1 batida por segundo)
- Gerado com Web Audio API

## 🛠️ Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Abrir no navegador:**
   ```
   http://localhost:3000
   ```

## 🎨 Design e UX

- **Gradientes suaves** em tons de azul, roxo e rosa
- **Tipografia clara** e legível
- **Espaçamento generoso** para facilitar a leitura
- **Animações sutis** que não distraem
- **Cores semânticas** (azul → roxo → verde conforme progresso)

## 🌟 Diferenciais

- ✅ **Experiência hands-free** - usuário pode manter os olhos fechados
- ✅ **Progressão automática** - sem necessidade de interação manual
- ✅ **Feedback visual claro** - múltiplas formas de acompanhar o progresso
- ✅ **Flexibilidade** - controles para pausar se necessário
- ✅ **Finalização especial** - metrônomo para relaxamento prolongado

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuições

Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.