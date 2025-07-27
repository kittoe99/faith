import { NextResponse } from 'next/server';
import { db } from '@/lib/sqlite';
import { randomUUID } from 'crypto';

// GET /api/tests
export async function GET() {
  try {
    const rows = db.prepare('SELECT * FROM test ORDER BY created_at DESC').all();
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}

// POST /api/tests
export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    const id = randomUUID();
    db.prepare('INSERT INTO test (id, content) VALUES (?, ?)').run(id, content);
    
    const row = db.prepare('SELECT * FROM test WHERE id = ?').get(id);
    return NextResponse.json({ data: row });
  } catch (error) {
    console.error('Error creating test:', error);
    return NextResponse.json(
      { error: 'Failed to create test' },
      { status: 500 }
    );
  }
}
