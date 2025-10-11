/**
 * Global API Types
 * These types are shared between frontend and backend for consistency
 * All types are defined using Zod for runtime validation
 */

import { z } from "zod";
import {
  audioSchema,
  themeSchema,
  structureSchema,
  meditationsSchema,
  createAudioSchema,
  updateAudioSchema,
  createThemeSchema,
  updateThemeSchema,
  updateStructureSchema,
  updateMeditationsSchema,
} from "./database";

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper schema
 */
export const apiResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type ApiResponse<T = any> = {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
};

/**
 * API error response schema
 */
export const apiErrorSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
  status: z.number().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

// ============================================================================
// Database API Responses
// ============================================================================

/**
 * Response from GET /api/database/meditations
 */
export const getMeditationsResponseSchema = z.object({
  meditations: meditationsSchema,
});
export type GetMeditationsResponse = z.infer<typeof getMeditationsResponseSchema>;

/**
 * Response from GET /api/database/structure
 */
export const getStructureResponseSchema = z.object({
  structure: structureSchema,
});
export type GetStructureResponse = z.infer<typeof getStructureResponseSchema>;

/**
 * Response from GET /api/database/themes
 */
export const getThemesResponseSchema = z.object({
  themes: z.array(themeSchema),
});
export type GetThemesResponse = z.infer<typeof getThemesResponseSchema>;

/**
 * Response from GET /api/database/songs (formerly audios)
 */
export const getSongsResponseSchema = z.object({
  songs: z.array(audioSchema),
});
export type GetSongsResponse = z.infer<typeof getSongsResponseSchema>;

/**
 * Combined response for all database data
 */
export const allDatabaseDataSchema = z.object({
  meditations: meditationsSchema,
  structure: structureSchema,
  themes: z.array(themeSchema),
  songs: z.array(audioSchema),
});
export type AllDatabaseData = z.infer<typeof allDatabaseDataSchema>;

// ============================================================================
// Meditation Session API Types
// ============================================================================

/**
 * Practice data in a meditation session
 */
export const meditationPracticeSchema = z.object({
  practice: z.string(),
  text: z.string(),
  isSpecific: z.boolean(),
});
export type MeditationPractice = z.infer<typeof meditationPracticeSchema>;

/**
 * Stage data in a meditation session
 */
export const meditationStageSchema = z.object({
  stage: z.string(),
  practices: z.array(meditationPracticeSchema),
});
export type MeditationStage = z.infer<typeof meditationStageSchema>;

/**
 * Song for meditation session (renamed from Audio to avoid browser Audio API conflict)
 */
export const meditationSongSchema = z.object({
  _id: z.string(),
  title: z.string(),
  artist: z.string(),
  src: z.string().url(),
  fadeInMs: z.number().optional(),
  fadeOutMs: z.number().optional(),
  volume: z.number().min(0).max(1).optional(),
});
export type MeditationSong = z.infer<typeof meditationSongSchema>;

/**
 * Complete meditation session
 */
export const meditationSessionSchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
  stages: z.array(meditationStageSchema),
  song: meditationSongSchema.optional(), // Optional background song
});
export type MeditationSession = z.infer<typeof meditationSessionSchema>;

/**
 * Response from GET /api/meditation/[category]
 */
export const getMeditationSessionResponseSchema = z.object({
  session: meditationSessionSchema,
});
export type GetMeditationSessionResponse = z.infer<typeof getMeditationSessionResponseSchema>;

// ============================================================================
// Categories API Types
// ============================================================================

/**
 * Category information
 */
export const categorySchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
});
export type Category = z.infer<typeof categorySchema>;

/**
 * Response from GET /api/categories
 */
export const getCategoriesResponseSchema = z.object({
  categories: z.array(categorySchema),
});
export type GetCategoriesResponse = z.infer<typeof getCategoriesResponseSchema>;

// ============================================================================
// CRUD Operation Responses
// ============================================================================

/**
 * Response from POST /api/database/themes
 */
export const createThemeResponseSchema = z.object({
  theme: themeSchema,
  message: z.string(),
});
export type CreateThemeResponse = z.infer<typeof createThemeResponseSchema>;

/**
 * Response from PUT /api/database/themes/[id]
 */
export const updateThemeResponseSchema = z.object({
  theme: themeSchema,
  message: z.string(),
});
export type UpdateThemeResponse = z.infer<typeof updateThemeResponseSchema>;

/**
 * Response from DELETE /api/database/themes/[id]
 */
export const deleteThemeResponseSchema = z.object({
  message: z.string(),
});
export type DeleteThemeResponse = z.infer<typeof deleteThemeResponseSchema>;

/**
 * Response from POST /api/database/songs (formerly audios)
 */
export const createSongResponseSchema = z.object({
  song: audioSchema,
  message: z.string(),
});
export type CreateSongResponse = z.infer<typeof createSongResponseSchema>;

/**
 * Response from PUT /api/database/songs/[id]
 */
export const updateSongResponseSchema = z.object({
  song: audioSchema,
  message: z.string(),
});
export type UpdateSongResponse = z.infer<typeof updateSongResponseSchema>;

/**
 * Response from DELETE /api/database/songs/[id]
 */
export const deleteSongResponseSchema = z.object({
  message: z.string(),
});
export type DeleteSongResponse = z.infer<typeof deleteSongResponseSchema>;

/**
 * Response from PUT /api/database/meditations
 */
export const updateMeditationsResponseSchema = z.object({
  meditations: meditationsSchema,
  message: z.string(),
});
export type UpdateMeditationsResponse = z.infer<typeof updateMeditationsResponseSchema>;

/**
 * Response from PUT /api/database/structure
 */
export const updateStructureResponseSchema = z.object({
  structure: structureSchema,
  message: z.string(),
});
export type UpdateStructureResponse = z.infer<typeof updateStructureResponseSchema>;

// ============================================================================
// Admin API Types
// ============================================================================

/**
 * Response from POST /api/admin/auth
 */
export const adminAuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});
export type AdminAuthResponse = z.infer<typeof adminAuthResponseSchema>;

/**
 * Database operation types for super-admin
 */
export const databaseOperationSchema = z.enum(["seed", "drop", "backup", "restore"]);
export type DatabaseOperation = z.infer<typeof databaseOperationSchema>;

/**
 * Database status information
 */
export const databaseStatusSchema = z.object({
  connected: z.boolean(),
  collections: z.object({
    meditations: z.number(),
    structure: z.number(),
    themes: z.number(),
    songs: z.number(), // renamed from audios
  }),
});
export type DatabaseStatus = z.infer<typeof databaseStatusSchema>;

/**
 * Response from database operations
 */
export const databaseOperationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  details: z.any().optional(),
});
export type DatabaseOperationResponse = z.infer<typeof databaseOperationResponseSchema>;

// ============================================================================
// Request Body Types (reuse database schemas)
// ============================================================================

/**
 * Create theme request body
 */
export const createThemeRequestSchema = createThemeSchema;
export type CreateThemeRequest = z.infer<typeof createThemeRequestSchema>;

/**
 * Update theme request body
 */
export const updateThemeRequestSchema = updateThemeSchema;
export type UpdateThemeRequest = z.infer<typeof updateThemeRequestSchema>;

/**
 * Create song request body (formerly audio)
 */
export const createSongRequestSchema = createAudioSchema;
export type CreateSongRequest = z.infer<typeof createSongRequestSchema>;

/**
 * Update song request body (formerly audio)
 */
export const updateSongRequestSchema = updateAudioSchema;
export type UpdateSongRequest = z.infer<typeof updateSongRequestSchema>;

/**
 * Update meditations request body
 */
export const updateMeditationsRequestSchema = updateMeditationsSchema;
export type UpdateMeditationsRequest = z.infer<typeof updateMeditationsRequestSchema>;

/**
 * Update structure request body
 */
export const updateStructureRequestSchema = updateStructureSchema;
export type UpdateStructureRequest = z.infer<typeof updateStructureRequestSchema>;

/**
 * Admin authentication request body
 */
export const adminAuthRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
export type AdminAuthRequest = z.infer<typeof adminAuthRequestSchema>;
