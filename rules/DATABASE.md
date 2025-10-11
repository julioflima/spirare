# Spirare Database System

This document describes the MongoDB-based database system for the Spirare meditation application.

## Overview

The database system is built with:

- **MongoDB** as the primary database
- **Zod** for data validation
- **TypeScript** for type safety
- **Next.js API routes** for CRUD operations

## Database Structure

### Collections

1. **structure** - Single document with meditation method and specifics (which practices use theme-specific content)
2. **meditations** - Single document with base/general meditation phrases for all categories
3. **themes** - Multiple documents, one per category (anxiety, focus, etc.) with category-specific phrases
4. **songs** - Multiple documents for background song tracks

### Data Models

#### Structure Collection (Single Document)

```typescript
{
  _id: ObjectId,
  method: Array<{        // Order of practices for each stage
    [stageName]: string[]  // e.g., opening: ["psychoeducation", "intention", ...]
  }>,
  specifics: {           // Flags: true = use theme-specific phrases, false = use base
    opening: {
      psychoeducation: boolean,
      intention: boolean,
      posture_and_environment: boolean,
      initial_breathing: boolean,
      attention_orientation: boolean
    },
    concentration: {
      guided_breathing_rhythm: boolean,
      progressive_body_relaxation: boolean,
      non_judgmental_observation: boolean,
      functional_silence: boolean
    },
    exploration: {
      main_focus: boolean,
      narrative_guidance_or_visualization: boolean,
      subtle_reflection_or_insight: boolean,
      emotional_integration: boolean
    },
    awakening: {
      body_reorientation: boolean,
      final_breathing: boolean,
      intention_for_the_rest_of_the_day: boolean,
      closing: boolean
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Meditations Collection (Single Document)

```typescript
{
  _id: ObjectId,
  // Base phrases shared across all categories
  opening: {
    psychoeducation: string[],     // Array of phrase variations
    intention: string[],
    posture_and_environment: string[],
    initial_breathing: string[],
    attention_orientation: string[]
  },
  concentration: {
    guided_breathing_rhythm: string[],
    progressive_body_relaxation: string[],
    non_judgmental_observation: string[],
    functional_silence: string[]
  },
  exploration: {
    main_focus: string[],
    narrative_guidance_or_visualization: string[],
    subtle_reflection_or_insight: string[],
    emotional_integration: string[]
  },
  awakening: {
    body_reorientation: string[],
    final_breathing: string[],
    intention_for_the_rest_of_the_day: string[],
    closing: string[]
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Themes Collection (Multiple Documents)

```typescript
{
  _id: ObjectId,
  category: string,      // Unique identifier (e.g., "anxiety", "focus")
  title: string,         // Display name (e.g., "Anxiety Relief")
  description?: string,  // Theme description
  meditations: {         // Category-specific phrases (same structure as meditations collection)
    opening: {
      psychoeducation: string[],
      intention: string[],
      posture_and_environment: string[],
      initial_breathing: string[],
      attention_orientation: string[]
    },
    concentration: {
      guided_breathing_rhythm: string[],
      progressive_body_relaxation: string[],
      non_judgmental_observation: string[],
      functional_silence: string[]
    },
    exploration: {
      main_focus: string[],
      narrative_guidance_or_visualization: string[],
      subtle_reflection_or_insight: string[],
      emotional_integration: string[]
    },
    awakening: {
      body_reorientation: string[],
      final_breathing: string[],
      intention_for_the_rest_of_the_day: string[],
      closing: string[]
    }
  },
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Songs Collection (Multiple Documents)

```typescript
{
  _id: ObjectId,
  title: string,         // Display name
  artist: string,        // Artist/Creator
  src: string,          // Song file URL
  fadeInMs?: number,    // Fade in duration
  fadeOutMs?: number,   // Fade out duration
  volume?: number,      // Default volume (0-1)
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Meditation Session Composition

- `GET /api/meditation/[category]` - Compose meditation session for a category
  - Randomly selects phrases based on structure.specifics
  - Returns complete session with all stages and practices

### Database Management

- `GET /api/database` - Get all collections data (structure, meditations, themes, songs)
- `POST /api/database/seed` - Seed database with initial data

### Meditations API

- `GET /api/database/meditations` - Get base meditation phrases
- `PUT /api/database/meditations` - Update base meditation phrases

### Structure API

- `GET /api/database/structure` - Get meditation structure (method + specifics)
- `PUT /api/database/structure` - Update meditation structure

### Themes API

- `GET /api/database/themes` - Get all themes
- `POST /api/database/themes` - Create new theme
- `GET /api/database/themes/[id]` - Get theme by ID
- `PUT /api/database/themes/[id]` - Update theme
- `DELETE /api/database/themes/[id]` - Delete theme

### Songs API

- `GET /api/database/songs` - Get all songs
- `POST /api/database/songs` - Create new song
- `GET /api/database/songs/[id]` - Get song by ID
- `PUT /api/database/songs/[id]` - Update song
- `DELETE /api/database/songs/[id]` - Delete song

## Setup

1. **Install MongoDB** locally or use MongoDB Atlas
2. **Set environment variables:**
   ```bash
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB=spirare
   ```
3. **Seed the database:**
   ```bash
   POST /api/database/seed
   ```

## How Meditation Sessions Are Composed

See [MEDITATION_API_REVIEW.md](./MEDITATION_API_REVIEW.md) for complete documentation on session composition.

### Flow

1. **Frontend**: Selects category
2. **Backend**: Fetches `structure.method` to determine order of practices
3. **Backend**: For each practice, gets **1 random phrase** from:
   - `meditations[stage][practice]` (base phrases)
   - OR `themes[category].meditations[stage][practice]` (category-specific phrases)
4. **Application of Specifics**: Checks `structure.specifics[stage][practice]`
   - If `true`: Uses phrase from themes collection (category-specific)
   - If `false`: Uses phrase from meditations collection (base phrases)

### Example

For category "anxiety":

- `structure.specifics.opening.psychoeducation = true`
  → Uses phrase from `themes.anxiety.meditations.opening.psychoeducation[]`
- `structure.specifics.opening.intention = false`
  → Uses phrase from `meditations.opening.intention[]`

## Validation & Type Safety

All data is validated using:

- **Zod schemas** in `/src/types/database.ts` for data validation
- **TypeScript types** in `/src/types/api.ts` for API contracts
- See [TYPE_SAFETY_RULES.md](./TYPE_SAFETY_RULES.md) for complete guidelines

## Related Documentation

- [MEDITATION_API_REVIEW.md](./MEDITATION_API_REVIEW.md) - Session composition API
- [TYPE_SAFETY_RULES.md](./TYPE_SAFETY_RULES.md) - Type safety guidelines
- [GLOBAL_API_TYPES.md](./GLOBAL_API_TYPES.md) - Complete API type system
