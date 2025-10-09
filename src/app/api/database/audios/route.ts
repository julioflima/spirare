import { NextRequest, NextResponse } from "next/server";
import { AudioService } from "@/services/audioService";
import { createAudioSchema, updateAudioSchema } from "@/types/database";

// GET /api/database/audios - Get all audios
export async function GET() {
  try {
    const audios = await AudioService.getAll();
    return NextResponse.json({ audios });
  } catch (error) {
    console.error("Error fetching audios:", error);
    return NextResponse.json(
      { error: "Failed to fetch audios" },
      { status: 500 }
    );
  }
}

// POST /api/database/audios - Create new audio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createAudioSchema.parse(body);

    const audio = await AudioService.create(validatedData);

    return NextResponse.json(
      { audio, message: "Audio created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating audio:", error);

    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create audio" },
      { status: 500 }
    );
  }
}
