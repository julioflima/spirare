import { ObjectId, Document } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import {
  Theme,
  CreateTheme,
  UpdateTheme,
  createThemeSchema,
  updateThemeSchema,
  themeSchema,
} from "@/types/database";

const COLLECTION_NAME = "themes";

// MongoDB document interface for Theme (using category instead of key)
interface ThemeDocument extends Document {
  _id?: ObjectId;
  category: string;
  title: string;
  description?: string;
  meditations?: Theme["meditations"];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ThemeService {
  static async getAll(): Promise<Theme[]> {
    const db = await getDatabase();
    const collection = db.collection<ThemeDocument>(COLLECTION_NAME);

    const themes = await collection.find({}).toArray();
    return themes.map((theme) => ({
      ...theme,
      _id: theme._id?.toString(),
    })) as Theme[];
  }

  static async getById(id: string): Promise<Theme | null> {
    const db = await getDatabase();
    const collection = db.collection<ThemeDocument>(COLLECTION_NAME);

    const theme = await collection.findOne({ _id: new ObjectId(id) });
    if (!theme) return null;

    return {
      ...theme,
      _id: theme._id?.toString(),
    } as Theme;
  }

  static async getByCategory(category: string): Promise<Theme | null> {
    const db = await getDatabase();
    const collection = db.collection<ThemeDocument>(COLLECTION_NAME);

    const theme = await collection.findOne({ category });
    if (!theme) return null;

    return {
      ...theme,
      _id: theme._id?.toString(),
    } as Theme;
  }

  static async getActive(): Promise<Theme[]> {
    const db = await getDatabase();
    const collection = db.collection<ThemeDocument>(COLLECTION_NAME);

    const themes = await collection
      .find({ isActive: { $ne: false } })
      .toArray();
    return themes.map((theme) => ({
      ...theme,
      _id: theme._id?.toString(),
    })) as Theme[];
  }

  static async create(data: CreateTheme): Promise<Theme> {
    const validatedData = createThemeSchema.parse(data);

    const db = await getDatabase();
    const collection = db.collection<ThemeDocument>(COLLECTION_NAME);

    const themeToInsert: ThemeDocument = {
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(themeToInsert);

    return {
      ...themeToInsert,
      _id: result.insertedId.toString(),
    } as Theme;
  }

  static async update(id: string, data: UpdateTheme): Promise<Theme | null> {
    const validatedData = updateThemeSchema.parse(data);

    const db = await getDatabase();
    const collection = db.collection<ThemeDocument>(COLLECTION_NAME);

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
    } as Theme;
  }

  static async updateByCategory(
    category: string,
    data: UpdateTheme
  ): Promise<Theme | null> {
    const validatedData = updateThemeSchema.parse(data);

    const db = await getDatabase();
    const collection = db.collection<ThemeDocument>(COLLECTION_NAME);

    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { category },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) return null;

    return {
      ...result,
      _id: result._id?.toString(),
    } as Theme;
  }

  static async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const collection = db.collection<ThemeDocument>(COLLECTION_NAME);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async deleteByCategory(category: string): Promise<boolean> {
    const db = await getDatabase();
    const collection = db.collection<ThemeDocument>(COLLECTION_NAME);

    const result = await collection.deleteOne({ category });
    return result.deletedCount > 0;
  }

  static async setActive(id: string, isActive: boolean): Promise<Theme | null> {
    return this.update(id, { isActive });
  }

  static async setActiveByCategory(
    category: string,
    isActive: boolean
  ): Promise<Theme | null> {
    return this.updateByCategory(category, { isActive });
  }

  // Helper method to get themes as array for embedding in main database
  static async getAllAsArray(): Promise<Theme[]> {
    return this.getAll();
  }

  static async validateData(data: unknown): Promise<Theme> {
    return themeSchema.parse(data);
  }
}
