# Spirare Meditation Methodology

This document describes the meditation composition system and methodology used in Spirare.

## 🧘 Método de Meditação

### Estrutura de Composição

O sistema de meditação compõe sessões dinamicamente a partir de três fontes:

1. **Base Global** (`meditations` collection): Frases padrão para todas as categorias
2. **Método de Estrutura** (`structure.method`): Define a ordem das práticas
3. **Especificidades do Tema** (`structure.specifics` + `themes[].meditations`): Sobrescreve práticas específicas

### Fluxo de Composição

1. **Frontend**: Seleciona categoria
2. **Backend**: Busca `structure.method` para determinar ordem das práticas
3. **Backend**: Para cada prática, pega **1 frase aleatória** de:

   - `meditations.opening.psychoeducation`
   - `meditations.opening.intention`
   - `meditations.opening.posture_and_environment`
   - `meditations.opening.initial_breathing`
   - `meditations.opening.attention_orientation`
   - `meditations.concentration.guided_breathing_rhythm`
   - `meditations.concentration.progressive_body_relaxation`
   - `meditations.concentration.non_judgmental_observation`
   - `meditations.concentration.functional_silence`
   - `meditations.exploration.main_focus`
   - `meditations.exploration.narrative_guidance_or_visualization`
   - `meditations.exploration.subtle_reflection_or_insight`
   - `meditations.exploration.emotional_integration`
   - `meditations.awakening.body_reorientation`
   - `meditations.awakening.final_breathing`
   - `meditations.awakening.intention_for_the_rest_of_the_day`
   - `meditations.awakening.closing`

4. **Aplicação de Especificidades**: Verifica `structure.specifics[stage][practice]`
   - Se `true`: Substitui a frase base por uma aleatória de `themes[category].meditations[stage][practice]`
   - Se `false`: Mantém a frase da base global

### Exemplo Prático

Para categoria "anxiety":

- `structure.specifics.opening.psychoeducation = true`
  → Usa frase de `themes.anxiety.meditations.opening.psychoeducation[]`
- `structure.specifics.opening.intention = false`
  → Usa frase de `meditations.opening.intention[]`

### Schema de Dados

```typescript
{
  meditations: {
    [stage]: {
      [practice]: string[]  // Base global
    }
  },
  structure: {
    method: Array<{ [stage]: string[] }>,  // Ordem das práticas
    specifics: {
      [stage]: {
        [practice]: boolean  // true = usa tema específico
      }
    }
  },
  themes: [{
    category: string,
    meditations: {
      [stage]: {
        [practice]: string[]  // Sobrescreve quando specific = true
      }
    }
  }]
}
```

## 🎭 Stages and Practices

### Opening (Abertura)
- **psychoeducation**: Explicação educativa sobre o tema
- **intention**: Definição de intenção para a sessão
- **posture_and_environment**: Orientações de postura e ambiente
- **initial_breathing**: Respiração inicial preparatória
- **attention_orientation**: Direcionamento da atenção

### Concentration (Concentração)
- **guided_breathing_rhythm**: Ritmo de respiração guiada
- **progressive_body_relaxation**: Relaxamento progressivo do corpo
- **non_judgmental_observation**: Observação sem julgamento
- **functional_silence**: Silêncio funcional

### Exploration (Exploração)
- **main_focus**: Foco principal do tema
- **narrative_guidance_or_visualization**: Orientação narrativa ou visualização
- **subtle_reflection_or_insight**: Reflexão sutil ou insight
- **emotional_integration**: Integração emocional

### Awakening (Despertar)
- **body_reorientation**: Reorientação do corpo
- **final_breathing**: Respiração final
- **intention_for_the_rest_of_the_day**: Intenção para o resto do dia
- **closing**: Encerramento

## 🔄 Dynamic Composition Algorithm

```typescript
// Pseudocódigo para composição de sessão
function composeSession(category: string): SessionContent {
  const structure = getStructure();
  const meditations = getBaseMeditations();
  const theme = getTheme(category);
  
  const session = [];
  
  for (const stage of structure.method) {
    for (const practice of stage.practices) {
      const useSpecific = structure.specifics[stage.name][practice];
      
      if (useSpecific && theme.meditations[stage.name][practice]) {
        // Usa frase específica do tema
        const phrases = theme.meditations[stage.name][practice];
        session.push(randomSelect(phrases));
      } else {
        // Usa frase da base global
        const phrases = meditations[stage.name][practice];
        session.push(randomSelect(phrases));
      }
    }
  }
  
  return session;
}
```

## 📊 Content Sources Priority

1. **Tema Específico** (Highest Priority)
   - Usado quando `structure.specifics[stage][practice] = true`
   - Fonte: `themes[category].meditations[stage][practice][]`

2. **Base Global** (Fallback)
   - Usado quando `structure.specifics[stage][practice] = false`
   - Fonte: `meditations[stage][practice][]`

3. **Estrutura Método** (Order Definition)
   - Define ordem das práticas: `structure.method`
   - Determina quais práticas incluir em cada etapa

## 🎯 Benefits of This System

### Flexibility
- Permite personalização por categoria
- Mantém consistência global
- Facilita adição de novos temas

### Scalability
- Novos temas só precisam definir conteúdo específico
- Base global serve como fallback
- Estrutura método pode ser modificada independentemente

### Randomization
- Cada sessão usa frases aleatórias
- Evita repetição excessiva
- Mantém frescor na experiência

### Content Management
- Administradores podem editar conteúdo específico
- Base global permanece estável
- Validação Zod garante integridade

## 🔗 Related Documentation

- **[DATABASE.md](./DATABASE.md)** - Complete database schema
- **[GLOBAL_API_TYPES.md](./GLOBAL_API_TYPES.md)** - API types for meditation content
- **[MEDITATION_API_REVIEW.md](./MEDITATION_API_REVIEW.md)** - Implementation details