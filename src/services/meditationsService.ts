import { ObjectId, Document } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import {
  Meditations,
  UpdateMeditations,
  meditationsSchema,
  updateMeditationsSchema,
  ContentItem,
} from "@/types/database";

const COLLECTION_NAME = "meditations";

interface MeditationsDocument extends Document {
  _id?: ObjectId;
  opening: {
    psychoeducation: ContentItem[];
    intention: ContentItem[];
    posture_and_environment: ContentItem[];
    initial_breathing: ContentItem[];
    attention_orientation: ContentItem[];
  };
  concentration: {
    guided_breathing_rhythm: ContentItem[];
    progressive_body_relaxation: ContentItem[];
    non_judgmental_observation: ContentItem[];
    functional_silence: ContentItem[];
  };
  exploration: {
    main_focus: ContentItem[];
    narrative_guidance_or_visualization: ContentItem[];
    subtle_reflection_or_insight: ContentItem[];
    emotional_integration: ContentItem[];
  };
  awakening: {
    body_reorientation: ContentItem[];
    final_breathing: ContentItem[];
    intention_for_the_rest_of_the_day: ContentItem[];
    closing: ContentItem[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export class MeditationsService {
  static async get(): Promise<Meditations | null> {
    const db = await getDatabase();
    const collection = db.collection<MeditationsDocument>(COLLECTION_NAME);

    const meditations = await collection.findOne({});

    if (!meditations) return null;

    return {
      ...meditations,
      _id: meditations._id?.toString(),
    } as Meditations;
  }

  static async initializeDefault(): Promise<Meditations> {
    const db = await getDatabase();
    const collection = db.collection<MeditationsDocument>(COLLECTION_NAME);

    // Check if meditations already exist
    const existing = await collection.findOne({});
    if (existing) {
      return {
        ...existing,
        _id: existing._id?.toString(),
      } as Meditations;
    }

    // Create default meditations structure
    const defaultMeditations: MeditationsDocument = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(defaultMeditations);

    return {
      ...defaultMeditations,
      _id: result.insertedId.toString(),
    } as Meditations;
  }

  static async update(data: UpdateMeditations): Promise<Meditations | null> {
    const validatedData = updateMeditationsSchema.parse(data);

    const db = await getDatabase();
    const collection = db.collection<MeditationsDocument>(COLLECTION_NAME);

    const updateData: Record<string, unknown> = {
      ...validatedData,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      {},
      { $set: updateData },
      { returnDocument: "after", upsert: true }
    );

    if (!result) return null;

    return {
      ...result,
      _id: result._id?.toString(),
    } as Meditations;
  }

  static async updatePhaseContent(
    phase: "opening" | "concentration" | "exploration" | "awakening",
    contentType: string,
    content: ContentItem[]
  ): Promise<Meditations | null> {
    const db = await getDatabase();
    const collection = db.collection<MeditationsDocument>(COLLECTION_NAME);

    const result = await collection.findOneAndUpdate(
      {},
      {
        $set: {
          [`${phase}.${contentType}`]: content,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) return null;

    return {
      ...result,
      _id: result._id?.toString(),
    } as Meditations;
  }

  static async validateData(data: unknown): Promise<Meditations> {
    return meditationsSchema.parse(data);
  }
}
