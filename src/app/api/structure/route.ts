import { NextRequest, NextResponse } from "next/server";
import { StructureService } from "@/services/structureService";

// GET /api/structure - Get all structure items
export async function GET() {
  try {
    let structures = await StructureService.getAll();

    // Initialize with default data if empty
    if (structures.length === 0) {
      await StructureService.initializeDefault();
      structures = await StructureService.getAll();
    }

    return NextResponse.json({ structures });
  } catch (error) {
    console.error("Error fetching structures:", error);
    return NextResponse.json(
      { error: "Failed to fetch structures" },
      { status: 500 }
    );
  }
}

// POST /api/structure - Create new structure item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const structure = await StructureService.create(body);

    return NextResponse.json({
      structure,
      message: "Structure created successfully",
    });
  } catch (error) {
    console.error("Error creating structure:", error);

    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create structure" },
      { status: 500 }
    );
  }
}