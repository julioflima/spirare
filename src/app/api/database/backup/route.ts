import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// POST /api/database/backup - Create and download database backup
export async function POST() {
  try {
    const db = await getDatabase();
    
    // Get all collection names
    const collections = await db.listCollections().toArray();
    const backup: Record<string, any[]> = {};
    
    // Export all collections
    for (const collection of collections) {
      const collectionName = collection.name;
      try {
        const documents = await db.collection(collectionName).find({}).toArray();
        backup[collectionName] = documents;
      } catch (error) {
        console.error(`Error backing up collection ${collectionName}:`, error);
        backup[collectionName] = [];
      }
    }

    // Create backup metadata
    const backupData = {
      metadata: {
        createdAt: new Date().toISOString(),
        version: "1.0",
        totalCollections: collections.length,
        totalDocuments: Object.values(backup).reduce((sum, docs) => sum + docs.length, 0)
      },
      collections: backup
    };

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="spirare-backup-${new Date().toISOString().slice(0, 10)}.json"`
      }
    });
  } catch (error) {
    console.error("Error creating database backup:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create database backup",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}