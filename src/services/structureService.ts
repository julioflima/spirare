import { ObjectId, Document } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import {
  Structure,
  CreateStructure,
  UpdateStructure,
  structureSchema,
  createStructureSchema,
  updateStructureSchema,
} from "@/types/database";

const COLLECTION_NAME = "structure";

interface StructureDocument extends Document {
  _id?: ObjectId;
  method?: CreateStructure["method"];
  specifics?: CreateStructure["specifics"];
  createdAt?: Date;
  updatedAt?: Date;
}

const DEFAULT_STRUCTURE: CreateStructure = {
  method: [
    {
      opening: [
        "psychoeducation",
        "intention",
        "posture_and_environment",
        "initial_breathing",
        "attention_orientation",
      ],
    },
    {
      concentration: [
        "guided_breathing_rhythm",
        "progressive_body_relaxation",
        "non_judgmental_observation",
        "functional_silence",
      ],
    },
    {
      exploration: [
        "main_focus",
        "narrative_guidance_or_visualization",
        "subtle_reflection_or_insight",
        "emotional_integration",
      ],
    },
    {
      awakening: [
        "body_reorientation",
        "final_breathing",
        "intention_for_the_rest_of_the_day",
        "closing",
      ],
    },
  ],
  specifics: {
    opening: {
      psychoeducation: true,
      intention: false,
      posture_and_environment: false,
      initial_breathing: false,
      attention_orientation: false,
    },
    concentration: {
      guided_breathing_rhythm: false,
      progressive_body_relaxation: false,
      non_judgmental_observation: false,
      functional_silence: false,
    },
    exploration: {
      main_focus: false,
      narrative_guidance_or_visualization: true,
      subtle_reflection_or_insight: true,
      emotional_integration: false,
    },
    awakening: {
      body_reorientation: false,
      final_breathing: false,
      intention_for_the_rest_of_the_day: false,
      closing: false,
    },
  },
};

function mapStructure(document: StructureDocument | null): Structure | null {
  if (!document) return null;
  return {
    ...document,
    _id: document._id?.toString(),
  } as Structure;
}

export class StructureService {
  static async get(): Promise<Structure | null> {
    const db = await getDatabase();
    const collection = db.collection<StructureDocument>(COLLECTION_NAME);

    const structure = await collection.findOne({});
    return mapStructure(structure);
  }

  static async set(data: CreateStructure): Promise<Structure> {
    const validatedData = createStructureSchema.parse(data);

    const db = await getDatabase();
    const collection = db.collection<StructureDocument>(COLLECTION_NAME);

    await collection.updateOne(
      {},
      {
        $set: {
          ...validatedData,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    const updated = await collection.findOne({});
    return mapStructure(updated)!;
  }

  static async update(data: UpdateStructure): Promise<Structure | null> {
    const validatedData = updateStructureSchema.parse(data);

    const db = await getDatabase();
    const collection = db.collection<StructureDocument>(COLLECTION_NAME);

    const updatePayload: Record<string, unknown> = {
      ...validatedData,
      updatedAt: new Date(),
    };

    await collection.updateOne(
      {},
      {
        $set: updatePayload,
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    const updated = await collection.findOne({});
    return mapStructure(updated);
  }

  static async initializeDefault(): Promise<Structure> {
    const existing = await this.get();
    if (existing) {
      return existing;
    }
    return this.set(DEFAULT_STRUCTURE);
  }

  static async deleteAll(): Promise<void> {
    const db = await getDatabase();
    const collection = db.collection<StructureDocument>(COLLECTION_NAME);
    await collection.deleteMany({});
  }

  static async validateData(data: unknown): Promise<Structure> {
    return structureSchema.parse(data);
  }
}
