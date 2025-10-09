import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// DELETE /api/database/drop - Drop all collections (DANGEROUS)
export async function DELETE(request: NextRequest) {
  try {
    // Security check - only allow in development or with proper authorization
    if (process.env.NODE_ENV === "production") {
      const authHeader = request.headers.get("authorization");
      if (!authHeader || authHeader !== `Bearer ${process.env.DROP_SECRET}`) {
        return NextResponse.json({ 
          success: false,
          message: "Unauthorized - dropping database is restricted in production" 
        }, { status: 401 });
      }
    }

    const db = await getDatabase();
    
    // Get all collection names
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    const results: Record<string, boolean> = {};
    
    // Drop each collection
    for (const collectionName of collectionNames) {
      try {
        await db.collection(collectionName).drop();
        results[collectionName] = true;
      } catch (error) {
        console.error(`Error dropping collection ${collectionName}:`, error);
        results[collectionName] = false;
      }
    }

    const successCount = Object.values(results).filter(Boolean).length;
    const totalCount = collectionNames.length;

    return NextResponse.json({
      success: successCount === totalCount,
      message: `Database drop completed. ${successCount}/${totalCount} collections dropped successfully.`,
      results,
      droppedCollections: successCount,
      totalCollections: totalCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error dropping database:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to drop database",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}