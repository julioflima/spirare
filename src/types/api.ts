/**
 * Global API Types
 * These types are shared between frontend and backend for consistency
 */

import { Audio, Theme, Structure, Meditations } from "./database";

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * API error response
 */
export interface ApiError {
  error: string;
  details?: string;
  status?: number;
}

// ============================================================================
// Database API Responses
// ============================================================================

/**
 * Response from GET /api/database/meditations
 */
export interface GetMeditationsResponse {
  meditations: Meditations;
}

/**
 * Response from GET /api/database/structure
 */
export interface GetStructureResponse {
  structure: Structure;
}

/**
 * Response from GET /api/database/themes
 */
export interface GetThemesResponse {
  themes: Theme[];
}

/**
 * Response from GET /api/database/audios
 */
export interface GetAudiosResponse {
  audios: Audio[];
}

/**
 * Combined response for all database data
 */
export interface AllDatabaseData {
  meditations: Meditations;
  structure: Structure;
  themes: Theme[];
  audios: Audio[];
}

// ============================================================================
// Meditation Session API Types
// ============================================================================

/**
 * Practice data in a meditation session
 */
export interface MeditationPractice {
  practice: string;
  text: string;
  isSpecific: boolean;
}

/**
 * Stage data in a meditation session
 */
export interface MeditationStage {
  stage: string;
  practices: MeditationPractice[];
}

/**
 * Complete meditation session
 */
export interface MeditationSession {
  category: string;
  title: string;
  description: string;
  stages: MeditationStage[];
}

/**
 * Response from GET /api/meditation/[category]
 */
export interface GetMeditationSessionResponse {
  session: MeditationSession;
}

// ============================================================================
// Categories API Types
// ============================================================================

/**
 * Category information
 */
export interface Category {
  category: string;
  title: string;
  description: string;
}

/**
 * Response from GET /api/categories
 */
export interface GetCategoriesResponse {
  categories: Category[];
}

// ============================================================================
// CRUD Operation Responses
// ============================================================================

/**
 * Response from POST /api/database/themes
 */
export interface CreateThemeResponse {
  theme: Theme;
  message: string;
}

/**
 * Response from PUT /api/database/themes/[id]
 */
export interface UpdateThemeResponse {
  theme: Theme;
  message: string;
}

/**
 * Response from DELETE /api/database/themes/[id]
 */
export interface DeleteThemeResponse {
  message: string;
}

/**
 * Response from POST /api/database/audios
 */
export interface CreateAudioResponse {
  audio: Audio;
  message: string;
}

/**
 * Response from PUT /api/database/audios/[id]
 */
export interface UpdateAudioResponse {
  audio: Audio;
  message: string;
}

/**
 * Response from DELETE /api/database/audios/[id]
 */
export interface DeleteAudioResponse {
  message: string;
}

/**
 * Response from PUT /api/database/meditations
 */
export interface UpdateMeditationsResponse {
  meditations: Meditations;
  message: string;
}

/**
 * Response from PUT /api/database/structure
 */
export interface UpdateStructureResponse {
  structure: Structure;
  message: string;
}

// ============================================================================
// Admin API Types
// ============================================================================

/**
 * Response from POST /api/admin/auth
 */
export interface AdminAuthResponse {
  success: boolean;
  message?: string;
}

/**
 * Database operation types for super-admin
 */
export type DatabaseOperation = "seed" | "drop" | "backup" | "restore";

/**
 * Database status information
 */
export interface DatabaseStatus {
  connected: boolean;
  collections: {
    meditations: number;
    structure: number;
    themes: number;
    audios: number;
  };
}

/**
 * Response from database operations
 */
export interface DatabaseOperationResponse {
  success: boolean;
  message: string;
  details?: any;
}

// ============================================================================
// Request Body Types
// ============================================================================

/**
 * Create theme request body
 */
export interface CreateThemeRequest {
  category: string;
  title: string;
  description?: string;
  meditations?: Theme["meditations"];
  isActive?: boolean;
}

/**
 * Update theme request body
 */
export interface UpdateThemeRequest {
  category?: string;
  title?: string;
  description?: string;
  meditations?: Theme["meditations"];
  isActive?: boolean;
}

/**
 * Create audio request body
 */
export interface CreateAudioRequest {
  title: string;
  artist: string;
  src: string;
  fadeInMs?: number;
  fadeOutMs?: number;
  volume?: number;
}

/**
 * Update audio request body
 */
export interface UpdateAudioRequest {
  title?: string;
  artist?: string;
  src?: string;
  fadeInMs?: number;
  fadeOutMs?: number;
  volume?: number;
}

/**
 * Update meditations request body
 */
export interface UpdateMeditationsRequest {
  opening?: Meditations["opening"];
  concentration?: Meditations["concentration"];
  exploration?: Meditations["exploration"];
  awakening?: Meditations["awakening"];
}

/**
 * Update structure request body
 */
export interface UpdateStructureRequest {
  method?: Structure["method"];
  specifics?: Structure["specifics"];
}

/**
 * Admin authentication request body
 */
export interface AdminAuthRequest {
  username: string;
  password: string;
}
