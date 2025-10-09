import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { Meditation } from '@/types/meditation';

const MEDITATION_FILE_PATH = path.join(process.cwd(), 'src/data/meditation.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(MEDITATION_FILE_PATH, 'utf-8');
    const meditation: Meditation = JSON.parse(fileContent);
    
    return NextResponse.json({ meditation });
  } catch (error) {
    console.error('Error reading meditation file:', error);
    return NextResponse.json(
      { error: 'Failed to read meditation data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { meditation } = body as { meditation: Meditation };

    if (!meditation) {
      return NextResponse.json(
        { error: 'Meditation data is required' },
        { status: 400 }
      );
    }

    // Validate meditation structure
    if (!meditation.tema || !Array.isArray(meditation.etapas) || !meditation.congratulacaoFinal) {
      return NextResponse.json(
        { error: 'Invalid meditation structure' },
        { status: 400 }
      );
    }

    // Save to file
    await fs.writeFile(MEDITATION_FILE_PATH, JSON.stringify(meditation, null, 2), 'utf-8');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Meditation data updated successfully' 
    });
  } catch (error) {
    console.error('Error saving meditation file:', error);
    return NextResponse.json(
      { error: 'Failed to save meditation data' },
      { status: 500 }
    );
  }
}