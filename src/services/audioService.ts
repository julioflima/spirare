import { ObjectId, Document } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import {
  Audio,
  CreateAudio,
  UpdateAudio,
  audioCollectionSchema,
  createAudioSchema,
  updateAudioSchema,
} from '@/types/database';

const COLLECTION_NAME = 'audios';

// MongoDB document interface for Audio (without key field)
interface AudioDocument extends Document {
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

export class AudioService {
  static async getAll(): Promise<Audio[]> {
    const db = await getDatabase();
    const collection = db.collection<AudioDocument>(COLLECTION_NAME);
    
    const audios = await collection.find({}).toArray();
    return audios.map(audio => ({
      ...audio,
      _id: audio._id?.toString(),
    })) as Audio[];
  }

  static async getById(id: string): Promise<Audio | null> {
    const db = await getDatabase();
    const collection = db.collection<AudioDocument>(COLLECTION_NAME);
    
    const audio = await collection.findOne({ _id: new ObjectId(id) });
    if (!audio) return null;
    
    return {
      ...audio,
      _id: audio._id?.toString(),
    } as Audio;
  }

  static async create(data: CreateAudio): Promise<Audio> {
    const validatedData = createAudioSchema.parse(data);
    
    const db = await getDatabase();
    const collection = db.collection<AudioDocument>(COLLECTION_NAME);
    
    const audioToInsert: AudioDocument = {
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await collection.insertOne(audioToInsert);
    
    return {
      ...audioToInsert,
      _id: result.insertedId.toString(),
    } as Audio;
  }

  static async update(id: string, data: UpdateAudio): Promise<Audio | null> {
    const validatedData = updateAudioSchema.parse(data);
    
    const db = await getDatabase();
    const collection = db.collection<AudioDocument>(COLLECTION_NAME);
    
    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) return null;
    
    return {
      ...result,
      _id: result._id?.toString(),
    } as Audio;
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const collection = db.collection<AudioDocument>(COLLECTION_NAME);
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Helper method to get audios as array for embedding in main database
  static async getAllAsArray(): Promise<Audio[]> {
    return this.getAll();
  }

  static async validateData(data: unknown): Promise<Audio> {
    return audioCollectionSchema.parse(data);
  }
}