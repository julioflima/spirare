import { NextRequest, NextResponse } from "next/server";
import { SongService } from "@/services/songsService";
import { createSongSchema } from "@/types/database";

// GET /api/database/songs - Get all songs
export async function GET() {
  try {
    const songs = await SongService.getAll();
    return NextResponse.json({ songs });
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json(
      { error: "Failed to fetch songs" },
      { status: 500 }
    );
  }
}

// POST /api/database/songs - Create new song
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createSongSchema.parse(body);

    const song = await SongService.create(validatedData);

    return NextResponse.json(
      { song, message: "Song created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating song:", error);

    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create song" },
      { status: 500 }
    );
  }
}
