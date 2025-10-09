import { ObjectId, Document } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import {
  MeditationDatabase,
  UpdateGeneralContent,
  UpdateStructure,
  meditationDatabaseSchema,
  updateGeneralContentSchema,
  updateStructureSchema,
  MeditationPhase,
  Structure,
  Theme,
  Audio,
} from '@/types/database';

const COLLECTION_NAME = 'meditation_database';

// MongoDB document interface for MeditationDatabase (with arrays instead of records)
interface MeditationDatabaseDocument extends Document {
  _id?: ObjectId;
  general: MeditationPhase; // Complex nested structure
  structure: Structure;
  themes: Theme[];
  audios: Audio[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class MeditationDatabaseService {
  static async get(): Promise<MeditationDatabase | null> {
    const db = await getDatabase();
    const collection = db.collection<MeditationDatabaseDocument>(COLLECTION_NAME);
    
    const database = await collection.findOne({});
    if (!database) return null;
    
    return {
      ...database,
      _id: database._id?.toString(),
    } as MeditationDatabase;
  }

  static async create(data: Omit<MeditationDatabase, '_id' | 'createdAt' | 'updatedAt'>): Promise<MeditationDatabase> {
    const validatedData = meditationDatabaseSchema.omit({ _id: true, createdAt: true, updatedAt: true }).parse(data);
    
    const db = await getDatabase();
    const collection = db.collection<MeditationDatabaseDocument>(COLLECTION_NAME);
    
    const databaseToInsert: MeditationDatabaseDocument = {
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await collection.insertOne(databaseToInsert);
    
    return {
      ...databaseToInsert,
      _id: result.insertedId.toString(),
    } as MeditationDatabase;
  }

  static async updateGeneral(data: UpdateGeneralContent): Promise<MeditationDatabase | null> {
    const validatedData = updateGeneralContentSchema.parse(data);
    
    const db = await getDatabase();
    const collection = db.collection<MeditationDatabaseDocument>(COLLECTION_NAME);
    
    const updatePath = `general.${validatedData.phase}.${validatedData.contentType}`;
    
    const result = await collection.findOneAndUpdate(
      {},
      { 
        $set: { 
          [updatePath]: validatedData.content,
          updatedAt: new Date(),
        }
      },
      { returnDocument: 'after' }
    );
    
    if (!result) return null;
    
    return {
      ...result,
      _id: result._id?.toString(),
    } as MeditationDatabase;
  }

  static async updateStructure(data: UpdateStructure): Promise<MeditationDatabase | null> {
    const validatedData = updateStructureSchema.parse(data);
    
    const db = await getDatabase();
    const collection = db.collection<MeditationDatabaseDocument>(COLLECTION_NAME);
    
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    
    // Build the update object for structure fields
    Object.keys(validatedData).forEach(key => {
      updateData[`structure.${key}`] = validatedData[key as keyof UpdateStructure];
    });
    
    const result = await collection.findOneAndUpdate(
      {},
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) return null;
    
    return {
      ...result,
      _id: result._id?.toString(),
    } as MeditationDatabase;
  }

  static async addTheme(theme: Theme): Promise<MeditationDatabase | null> {
    const db = await getDatabase();
    const collection = db.collection<MeditationDatabaseDocument>(COLLECTION_NAME);
    
    const result = await collection.findOneAndUpdate(
      {},
      { 
        $push: { themes: theme },
        $set: { updatedAt: new Date() }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      { returnDocument: 'after' }
    );
    
    if (!result) return null;
    
    return {
      ...result,
      _id: result._id?.toString(),
    } as MeditationDatabase;
  }

  static async removeTheme(category: string): Promise<MeditationDatabase | null> {
    const db = await getDatabase();
    const collection = db.collection<MeditationDatabaseDocument>(COLLECTION_NAME);
    
    const result = await collection.findOneAndUpdate(
      {},
      { 
        $pull: { themes: { category } },
        $set: { updatedAt: new Date() }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      { returnDocument: 'after' }
    );
    
    if (!result) return null;
    
    return {
      ...result,
      _id: result._id?.toString(),
    } as MeditationDatabase;
  }

  static async updateTheme(category: string, theme: Partial<Theme>): Promise<MeditationDatabase | null> {
    const db = await getDatabase();
    const collection = db.collection<MeditationDatabaseDocument>(COLLECTION_NAME);
    
    // First remove the old theme, then add the updated one
    await collection.updateOne(
      {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { $pull: { themes: { category } } } as any
    );
    
    const result = await collection.findOneAndUpdate(
      {},
      { 
        $push: { themes: { ...theme, category } },
        $set: { updatedAt: new Date() }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      { returnDocument: 'after' }
    );
    
    if (!result) return null;
    
    return {
      ...result,
      _id: result._id?.toString(),
    } as MeditationDatabase;
  }

  static async addAudio(audio: Audio): Promise<MeditationDatabase | null> {
    const db = await getDatabase();
    const collection = db.collection<MeditationDatabaseDocument>(COLLECTION_NAME);
    
    const result = await collection.findOneAndUpdate(
      {},
      { 
        $push: { audios: audio },
        $set: { updatedAt: new Date() }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      { returnDocument: 'after' }
    );
    
    if (!result) return null;
    
    return {
      ...result,
      _id: result._id?.toString(),
    } as MeditationDatabase;
  }

  static async removeAudio(title: string): Promise<MeditationDatabase | null> {
    const db = await getDatabase();
    const collection = db.collection<MeditationDatabaseDocument>(COLLECTION_NAME);
    
    const result = await collection.findOneAndUpdate(
      {},
      { 
        $pull: { audios: { title } },
        $set: { updatedAt: new Date() }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      { returnDocument: 'after' }
    );
    
    if (!result) return null;
    
    return {
      ...result,
      _id: result._id?.toString(),
    } as MeditationDatabase;
  }

  static async getGeneral(): Promise<MeditationPhase | null> {
    const database = await this.get();
    return database?.general || null;
  }

  static async getStructure(): Promise<Structure | null> {
    const database = await this.get();
    return database?.structure || null;
  }

  static async getThemes(): Promise<Theme[] | null> {
    const database = await this.get();
    return database?.themes || null;
  }

  static async getAudios(): Promise<Audio[] | null> {
    const database = await this.get();
    return database?.audios || null;
  }

  static async validateData(data: unknown): Promise<MeditationDatabase> {
    return meditationDatabaseSchema.parse(data);
  }

  static async initializeDefault(): Promise<MeditationDatabase> {
    // Check if database already exists
    const existing = await this.get();
    if (existing) return existing;

    // Create default database structure
    const defaultData = {
      general: {
        opening: {
          psychoeducation: [],
          intention: [],
          posture_and_environment: [],
          initial_breathing: [],
          attention_orientation: [],
        },
        concentration: {
          guided_breathing_rhythm: [],
          progressive_body_relaxation: [],
          non_judgmental_observation: [],
          functional_silence: [],
        },
        exploration: {
          main_focus: [],
          narrative_guidance_or_visualization: [],
          subtle_reflection_or_insight: [],
          emotional_integration: [],
        },
        awakening: {
          body_reorientation: [],
          final_breathing: [],
          intention_for_the_rest_of_the_day: [],
          closing: [],
        },
      },
      structure: {
        opening: [
          'psychoeducation',
          'intention',
          'posture_and_environment',
          'initial_breathing',
          'attention_orientation',
        ],
        concentration: [
          'guided_breathing_rhythm',
          'progressive_body_relaxation',
          'non_judgmental_observation',
          'functional_silence',
        ],
        exploration: [
          'main_focus',
          'narrative_guidance_or_visualization',
          'subtle_reflection_or_insight',
          'emotional_integration',
        ],
        awakening: [
          'body_reorientation',
          'final_breathing',
          'intention_for_the_rest_of_the_day',
          'closing',
        ],
      } as Structure,
      themes: [],
      audios: [],
      version: '1.0.0',
    };

    return this.create(defaultData);
  }
}