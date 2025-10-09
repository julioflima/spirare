import { z } from 'zod';
import { ObjectId } from 'mongodb';

// Audio Schema (without key field, using array structure)
export const audioSchema = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]).optional(),
  title: z.string().min(1, 'Título é obrigatório'),
  artist: z.string().min(1, 'Artista é obrigatório'),
  src: z.string().url('URL deve ser válida'),
  fadeInMs: z.number().min(0, 'Fade in deve ser positivo').optional(),
  fadeOutMs: z.number().min(0, 'Fade out deve ser positivo').optional(),
  volume: z.number().min(0).max(1, 'Volume deve estar entre 0 e 1').optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Content Item Schema (for meditation content arrays)
export const contentItemSchema = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]).optional(),
  text: z.string().min(1, 'Texto é obrigatório'),
  order: z.number().min(0, 'Ordem deve ser positiva'),
  duration: z.number().min(1, 'Duração deve ser positiva').optional(),
  audioId: z.union([z.string(), z.instanceof(ObjectId)]).optional(), // Reference to audio
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Phase Content Schema (for each meditation phase)
export const phaseContentSchema = z.object({
  psychoeducation: z.array(contentItemSchema).default([]),
  intention: z.array(contentItemSchema).default([]),
  posture_and_environment: z.array(contentItemSchema).default([]),
  initial_breathing: z.array(contentItemSchema).default([]),
  attention_orientation: z.array(contentItemSchema).default([]),
  guided_breathing_rhythm: z.array(contentItemSchema).default([]),
  progressive_body_relaxation: z.array(contentItemSchema).default([]),
  non_judgmental_observation: z.array(contentItemSchema).default([]),
  functional_silence: z.array(contentItemSchema).default([]),
  main_focus: z.array(contentItemSchema).default([]),
  narrative_guidance_or_visualization: z.array(contentItemSchema).default([]),
  subtle_reflection_or_insight: z.array(contentItemSchema).default([]),
  emotional_integration: z.array(contentItemSchema).default([]),
  body_reorientation: z.array(contentItemSchema).default([]),
  final_breathing: z.array(contentItemSchema).default([]),
  intention_for_the_rest_of_the_day: z.array(contentItemSchema).default([]),
  closing: z.array(contentItemSchema).default([]),
});

// Meditation Phase Schema
export const meditationPhaseSchema = z.object({
  opening: phaseContentSchema.pick({
    psychoeducation: true,
    intention: true,
    posture_and_environment: true,
    initial_breathing: true,
    attention_orientation: true,
  }),
  concentration: phaseContentSchema.pick({
    guided_breathing_rhythm: true,
    progressive_body_relaxation: true,
    non_judgmental_observation: true,
    functional_silence: true,
  }),
  exploration: phaseContentSchema.pick({
    main_focus: true,
    narrative_guidance_or_visualization: true,
    subtle_reflection_or_insight: true,
    emotional_integration: true,
  }),
  awakening: phaseContentSchema.pick({
    body_reorientation: true,
    final_breathing: true,
    intention_for_the_rest_of_the_day: true,
    closing: true,
  }),
});

// Structure Schema (defines the order of elements in each phase)
export const structureSchema = z.object({
  opening: z.array(z.enum([
    'psychoeducation',
    'intention',
    'posture_and_environment',
    'initial_breathing',
    'attention_orientation'
  ])),
  concentration: z.array(z.enum([
    'guided_breathing_rhythm',
    'progressive_body_relaxation',
    'non_judgmental_observation',
    'functional_silence'
  ])),
  exploration: z.array(z.enum([
    'main_focus',
    'narrative_guidance_or_visualization',
    'subtle_reflection_or_insight',
    'emotional_integration'
  ])),
  awakening: z.array(z.enum([
    'body_reorientation',
    'final_breathing',
    'intention_for_the_rest_of_the_day',
    'closing'
  ])),
});

// Theme Schema (using category instead of key, array structure)
export const themeSchema = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]).optional(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  structure: meditationPhaseSchema.partial(), // Partial because themes may not override all phases
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// General Meditation Database Schema (with arrays instead of records)
export const meditationDatabaseSchema = z.object({
  _id: z.union([z.string(), z.instanceof(ObjectId)]).optional(),
  general: meditationPhaseSchema,
  structure: structureSchema,
  themes: z.array(themeSchema),
  audios: z.array(audioSchema),
  version: z.string().default('1.0.0'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Separate schemas for individual collections
export const audioCollectionSchema = audioSchema;
export const themeCollectionSchema = themeSchema;
export const contentItemCollectionSchema = contentItemSchema;

// API Request/Response Schemas
export const createAudioSchema = audioSchema.omit({ _id: true, createdAt: true, updatedAt: true });
export const updateAudioSchema = createAudioSchema.partial();

export const createThemeSchema = themeSchema.omit({ _id: true, createdAt: true, updatedAt: true });
export const updateThemeSchema = createThemeSchema.partial();

export const createContentItemSchema = contentItemSchema.omit({ _id: true, createdAt: true, updatedAt: true });
export const updateContentItemSchema = createContentItemSchema.partial();

export const updateGeneralContentSchema = z.object({
  phase: z.enum(['opening', 'concentration', 'exploration', 'awakening']),
  contentType: z.string(),
  content: z.array(contentItemSchema),
});

export const updateStructureSchema = structureSchema.partial();

// Type exports
export type Audio = z.infer<typeof audioSchema>;
export type ContentItem = z.infer<typeof contentItemSchema>;
export type PhaseContent = z.infer<typeof phaseContentSchema>;
export type MeditationPhase = z.infer<typeof meditationPhaseSchema>;
export type Structure = z.infer<typeof structureSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type MeditationDatabase = z.infer<typeof meditationDatabaseSchema>;

export type CreateAudio = z.infer<typeof createAudioSchema>;
export type UpdateAudio = z.infer<typeof updateAudioSchema>;
export type CreateTheme = z.infer<typeof createThemeSchema>;
export type UpdateTheme = z.infer<typeof updateThemeSchema>;
export type CreateContentItem = z.infer<typeof createContentItemSchema>;
export type UpdateContentItem = z.infer<typeof updateContentItemSchema>;
export type UpdateGeneralContent = z.infer<typeof updateGeneralContentSchema>;
export type UpdateStructure = z.infer<typeof updateStructureSchema>;

// Enums for phase and content types
export const MEDITATION_PHASES = ['opening', 'concentration', 'exploration', 'awakening'] as const;
export const CONTENT_TYPES = {
  opening: ['psychoeducation', 'intention', 'posture_and_environment', 'initial_breathing', 'attention_orientation'],
  concentration: ['guided_breathing_rhythm', 'progressive_body_relaxation', 'non_judgmental_observation', 'functional_silence'],
  exploration: ['main_focus', 'narrative_guidance_or_visualization', 'subtle_reflection_or_insight', 'emotional_integration'],
  awakening: ['body_reorientation', 'final_breathing', 'intention_for_the_rest_of_the_day', 'closing'],
} as const;

export type MeditationPhaseType = typeof MEDITATION_PHASES[number];
export type ContentType = typeof CONTENT_TYPES[MeditationPhaseType][number];