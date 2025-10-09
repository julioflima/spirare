import { ObjectId, Document } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import {
  StructureItem,
  CreateStructureItem,
  UpdateStructureItem,
  structureItemSchema,
  createStructureItemSchema,
  updateStructureItemSchema,
} from "@/types/database";

const COLLECTION_NAME = "structure";

interface StructureDocument extends Document {
  _id?: ObjectId;
  opening?: string[];
  concentration?: string[];
  exploration?: string[];
  awakening?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class StructureService {
  static async getAll(): Promise<StructureItem[]> {
    const db = await getDatabase();
    const collection = db.collection<StructureDocument>(COLLECTION_NAME);

    const structures = await collection.find({}).toArray();

    return structures.map((structure) => ({
      ...structure,
      _id: structure._id?.toString(),
    })) as StructureItem[];
  }

  static async getById(id: string): Promise<StructureItem | null> {
    const db = await getDatabase();
    const collection = db.collection<StructureDocument>(COLLECTION_NAME);

    const structure = await collection.findOne({ _id: new ObjectId(id) });

    if (!structure) return null;

    return {
      ...structure,
      _id: structure._id?.toString(),
    } as StructureItem;
  }

  static async create(data: CreateStructureItem): Promise<StructureItem> {
    const validatedData = createStructureItemSchema.parse(data);

    const db = await getDatabase();
    const collection = db.collection<StructureDocument>(COLLECTION_NAME);

    const structureToInsert: StructureDocument = {
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(structureToInsert);

    return {
      ...structureToInsert,
      _id: result.insertedId.toString(),
    } as StructureItem;
  }

  static async updateById(
    id: string,
    data: UpdateStructureItem
  ): Promise<StructureItem | null> {
    const validatedData = updateStructureItemSchema.parse(data);

    const db = await getDatabase();
    const collection = db.collection<StructureDocument>(COLLECTION_NAME);

    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) return null;

    return {
      ...result,
      _id: result._id?.toString(),
    } as StructureItem;
  }

  static async deleteById(id: string): Promise<boolean> {
    const db = await getDatabase();
    const collection = db.collection<StructureDocument>(COLLECTION_NAME);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount > 0;
  }

  static async initializeDefault(): Promise<StructureItem[]> {
    const db = await getDatabase();
    const collection = db.collection<StructureDocument>(COLLECTION_NAME);

    // Check if structure already exists
    const existing = await collection.find({}).toArray();
    if (existing.length > 0) {
      return existing.map((structure) => ({
        ...structure,
        _id: structure._id?.toString(),
      })) as StructureItem[];
    }

    // Create default structure items based on db.json
    const defaultStructures: StructureDocument[] = [
      {
        opening: [
          "psychoeducation",
          "intention",
          "posture_and_environment",
          "initial_breathing",
          "attention_orientation",
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        concentration: [
          "guided_breathing_rhythm",
          "progressive_body_relaxation",
          "non_judgmental_observation",
          "functional_silence",
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        exploration: [
          "main_focus",
          "narrative_guidance_or_visualization",
          "subtle_reflection_or_insight",
          "emotional_integration",
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        awakening: [
          "body_reorientation",
          "final_breathing",
          "intention_for_the_rest_of_the_day",
          "closing",
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const result = await collection.insertMany(defaultStructures);

    return defaultStructures.map((structure, index) => ({
      ...structure,
      _id: result.insertedIds[index].toString(),
    })) as StructureItem[];
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const collection = db.collection<StructureDocument>(COLLECTION_NAME);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async validateData(data: unknown): Promise<StructureItem> {
    return structureItemSchema.parse(data);
  }
}
