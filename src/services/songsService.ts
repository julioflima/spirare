import { ObjectId, Document } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import {
  Song,
  CreateSong,
  UpdateSong,
  songSchema,
  createSongSchema,
  updateSongSchema,
} from "@/types/database";

const COLLECTION_NAME = "songs";

// MongoDB document interface for Song (without key field)
interface SongDocument extends Document {
  _id?: ObjectId;
  title: string;
  artist: string;
  src: string;
  fadeInMs?: number;
  fadeOutMs?: number;
  volume?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SongService {
  static async getAll(): Promise<Song[]> {
    const db = await getDatabase();
    const collection = db.collection<SongDocument>(COLLECTION_NAME);

    const songs = await collection.find({}).toArray();
    return songs.map((song) => ({
      ...song,
      _id: song._id?.toString(),
    })) as Song[];
  }

  static async getById(id: string): Promise<Song | null> {
    const db = await getDatabase();
    const collection = db.collection<SongDocument>(COLLECTION_NAME);

    const song = await collection.findOne({ _id: new ObjectId(id) });
    if (!song) return null;

    return {
      ...song,
      _id: song._id?.toString(),
    } as Song;
  }

  static async create(data: CreateSong): Promise<Song> {
    const validatedData = createSongSchema.parse(data);

    const db = await getDatabase();
    const collection = db.collection<SongDocument>(COLLECTION_NAME);

    const songToInsert: SongDocument = {
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(songToInsert);

    return {
      ...songToInsert,
      _id: result.insertedId.toString(),
    } as Song;
  }

  static async update(id: string, data: UpdateSong): Promise<Song | null> {
    const validatedData = updateSongSchema.parse(data);

    const db = await getDatabase();
    const collection = db.collection<SongDocument>(COLLECTION_NAME);

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
    } as Song;
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const collection = db.collection<SongDocument>(COLLECTION_NAME);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Helper method to get songs as array for embedding in main database
  static async getAllAsArray(): Promise<Song[]> {
    return this.getAll();
  }

  static async validateData(data: unknown): Promise<Song> {
    return songSchema.parse(data);
  }
}
