import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/scripts/seedDatabase';

// POST /api/database/seed - Seed the database with initial data
export async function POST(request: NextRequest) {
  try {
    // Only allow seeding in development or with proper authorization
    if (process.env.NODE_ENV === 'production') {
      const authHeader = request.headers.get('authorization');
      if (!authHeader || authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const result = await seedDatabase();
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 500 });
    }
  } catch (error) {
    console.error('Error in seed endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to seed database',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}