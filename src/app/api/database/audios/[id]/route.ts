import { NextRequest, NextResponse } from 'next/server';
import { AudioService } from '@/services/audioService';
import { updateAudioSchema } from '@/types/database';

// GET /api/database/audios/[id] - Get audio by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const audio = await AudioService.getById(params.id);
    
    if (!audio) {
      return NextResponse.json(
        { error: 'Audio not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ audio });
  } catch (error) {
    console.error('Error fetching audio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audio' },
      { status: 500 }
    );
  }
}

// PUT /api/database/audios/[id] - Update audio by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = updateAudioSchema.parse(body);
    
    const audio = await AudioService.update(params.id, validatedData);
    
    if (!audio) {
      return NextResponse.json(
        { error: 'Audio not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      audio,
      message: 'Audio updated successfully'
    });
  } catch (error) {
    console.error('Error updating audio:', error);
    
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update audio' },
      { status: 500 }
    );
  }
}

// DELETE /api/database/audios/[id] - Delete audio by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await AudioService.delete(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Audio not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Audio deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting audio:', error);
    return NextResponse.json(
      { error: 'Failed to delete audio' },
      { status: 500 }
    );
  }
}