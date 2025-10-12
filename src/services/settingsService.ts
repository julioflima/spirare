import { Document } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import {
  MetronomeSettings,
  metronomeSettingsSchema,
} from "@/types/database";
import { updateMetronomeSettingsRequestSchema } from "@/types/api";

const COLLECTION_NAME = "metronome_settings";

interface MetronomeSettingsDocument extends Document {
  _id?: MetronomeSettings["_id"];
  periodMs: number;
  isMuted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const DEFAULT_METRONOME_SETTINGS: Omit<MetronomeSettings, "_id"> = {
  periodMs: 1080,
  isMuted: false,
};

export class SettingsService {
  static async getMetronomeSettings(): Promise<MetronomeSettings> {
    const db = await getDatabase();
    const collection = db.collection<MetronomeSettingsDocument>(
      COLLECTION_NAME
    );

    const existing = await collection.findOne({});
    if (!existing) {
      const now = new Date();
      const doc: MetronomeSettingsDocument = {
        ...DEFAULT_METRONOME_SETTINGS,
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(doc);
      return {
        ...doc,
        _id: result.insertedId.toString(),
      } as MetronomeSettings;
    }

    return {
      ...existing,
      _id: existing._id ? existing._id.toString() : undefined,
    } as MetronomeSettings;
  }

  static async updateMetronomeSettings(
    data: unknown
  ): Promise<MetronomeSettings> {
    const validated = updateMetronomeSettingsRequestSchema.parse(data);

    const db = await getDatabase();
    const collection = db.collection<MetronomeSettingsDocument>(
      COLLECTION_NAME
    );

    const now = new Date();
    const updateData: Partial<MetronomeSettingsDocument> = {
      ...validated,
      updatedAt: now,
    };

    const result = await collection.findOneAndUpdate(
      {},
      {
        $set: updateData,
        $setOnInsert: {
          createdAt: now,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    const document =
      result?.value ??
      (await collection.findOne({})) ?? {
        ...DEFAULT_METRONOME_SETTINGS,
        createdAt: now,
        updatedAt: now,
      };

    const parsed = metronomeSettingsSchema.parse(document);

    return {
      ...parsed,
      _id: parsed._id ? parsed._id.toString() : undefined,
    } as MetronomeSettings;
  }
}
