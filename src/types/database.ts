import { z } from "zod";
import { ObjectId } from "mongodb";

// Content Item Schema (for meditation content arrays)
export const contentItemSchema = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]).optional(),
  text: z.string().min(1, "Texto é obrigatório"),
  order: z.number().min(0, "Ordem deve ser positiva"),
  duration: z.number().min(1, "Duração deve ser positiva").optional(),
  audioId: z.union([z.string(), z.instanceof(ObjectId)]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Audio Schema for the audios collection
export const audioSchema = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]).optional(),
  title: z.string().min(1, "Título é obrigatório"),
  artist: z.string().min(1, "Artista é obrigatório"),
  src: z.string().url("URL deve ser válida"),
  fadeInMs: z.number().min(0, "Fade in deve ser positivo").optional(),
  fadeOutMs: z.number().min(0, "Fade out deve ser positivo").optional(),
  volume: z.number().min(0).max(1, "Volume deve estar entre 0 e 1").optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Meditations Collection Schema (single document with all meditation content)
export const meditationsSchema = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]).optional(),
  opening: z.object({
    psychoeducation: z.array(contentItemSchema).default([]),
    intention: z.array(contentItemSchema).default([]),
    posture_and_environment: z.array(contentItemSchema).default([]),
    initial_breathing: z.array(contentItemSchema).default([]),
    attention_orientation: z.array(contentItemSchema).default([]),
  }),
  concentration: z.object({
    guided_breathing_rhythm: z.array(contentItemSchema).default([]),
    progressive_body_relaxation: z.array(contentItemSchema).default([]),
    non_judgmental_observation: z.array(contentItemSchema).default([]),
    functional_silence: z.array(contentItemSchema).default([]),
  }),
  exploration: z.object({
    main_focus: z.array(contentItemSchema).default([]),
    narrative_guidance_or_visualization: z.array(contentItemSchema).default([]),
    subtle_reflection_or_insight: z.array(contentItemSchema).default([]),
    emotional_integration: z.array(contentItemSchema).default([]),
  }),
  awakening: z.object({
    body_reorientation: z.array(contentItemSchema).default([]),
    final_breathing: z.array(contentItemSchema).default([]),
    intention_for_the_rest_of_the_day: z.array(contentItemSchema).default([]),
    closing: z.array(contentItemSchema).default([]),
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const structurePhaseListSchema = z.array(z.string()).optional();

const structureMethodItemSchema = z.object({
  opening: structurePhaseListSchema,
  concentration: structurePhaseListSchema,
  exploration: structurePhaseListSchema,
  awakening: structurePhaseListSchema,
});

const structurePhaseSpecificsSchema = z
  .record(z.string(), z.boolean())
  .default({});

export const structureSchema = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]).optional(),
  method: z.array(structureMethodItemSchema).default([]),
  specifics: z
    .object({
      opening: structurePhaseSpecificsSchema,
      concentration: structurePhaseSpecificsSchema,
      exploration: structurePhaseSpecificsSchema,
      awakening: structurePhaseSpecificsSchema,
    })
    .default({
      opening: {},
      concentration: {},
      exploration: {},
      awakening: {},
    }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Theme Schema for the themes collection
export const themeSchema = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]).optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  meditations: z.object({
    opening: z.object({
      psychoeducation: z.array(contentItemSchema).default([]),
      intention: z.array(contentItemSchema).default([]),
      posture_and_environment: z.array(contentItemSchema).default([]),
      initial_breathing: z.array(contentItemSchema).default([]),
      attention_orientation: z.array(contentItemSchema).default([]),
    }),
    concentration: z.object({
      guided_breathing_rhythm: z.array(contentItemSchema).default([]),
      progressive_body_relaxation: z.array(contentItemSchema).default([]),
      non_judgmental_observation: z.array(contentItemSchema).default([]),
      functional_silence: z.array(contentItemSchema).default([]),
    }),
    exploration: z.object({
      main_focus: z.array(contentItemSchema).default([]),
      narrative_guidance_or_visualization: z
        .array(contentItemSchema)
        .default([]),
      subtle_reflection_or_insight: z.array(contentItemSchema).default([]),
      emotional_integration: z.array(contentItemSchema).default([]),
    }),
    awakening: z.object({
      body_reorientation: z.array(contentItemSchema).default([]),
      final_breathing: z.array(contentItemSchema).default([]),
      intention_for_the_rest_of_the_day: z.array(contentItemSchema).default([]),
      closing: z.array(contentItemSchema).default([]),
    }),
  }),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create schemas for API operations
export const createAudioSchema = audioSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateAudioSchema = audioSchema
  .omit({ _id: true, createdAt: true })
  .partial();

export const createThemeSchema = themeSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateThemeSchema = themeSchema
  .omit({ _id: true, createdAt: true })
  .partial();

export const createStructureSchema = structureSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateStructureSchema = structureSchema
  .omit({ _id: true, createdAt: true })
  .partial();

export const updateMeditationsSchema = meditationsSchema
  .omit({ _id: true, createdAt: true })
  .partial();

// Collection schemas for validation
export const audioCollectionSchema = z.array(audioSchema);
export const themeCollectionSchema = z.array(themeSchema);
export const structureCollectionSchema = z.array(structureSchema);

// Type exports
export type ContentItem = z.infer<typeof contentItemSchema>;
export type Audio = z.infer<typeof audioSchema>;
export type Meditations = z.infer<typeof meditationsSchema>;
export type Structure = z.infer<typeof structureSchema>;
export type Theme = z.infer<typeof themeSchema>;

export type CreateAudio = z.infer<typeof createAudioSchema>;
export type UpdateAudio = z.infer<typeof updateAudioSchema>;
export type CreateTheme = z.infer<typeof createThemeSchema>;
export type UpdateTheme = z.infer<typeof updateThemeSchema>;
export type CreateStructure = z.infer<typeof createStructureSchema>;
export type UpdateStructure = z.infer<typeof updateStructureSchema>;
export type UpdateMeditations = z.infer<typeof updateMeditationsSchema>;
