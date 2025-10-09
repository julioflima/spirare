import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// GET /api/database/status - Get database status and collection counts
export async function GET() {
  try {
    const db = await getDatabase();
    
    // Get all collection names
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Get document counts for each collection
    const status: Record<string, number> = {};
    
    for (const collectionName of collectionNames) {
      try {
        const count = await db.collection(collectionName).countDocuments();
        status[collectionName] = count;
      } catch (error) {
        status[collectionName] = -1; // Error getting count
      }
    }

    return NextResponse.json({
      success: true,
      collections: collectionNames,
      documentCounts: status,
      totalCollections: collectionNames.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error getting database status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get database status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}