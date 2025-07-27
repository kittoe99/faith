import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key if available, otherwise fall back to anon key so build doesn't fail
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase client will be (re)created inside each handler to avoid evaluating at build if env vars missing
function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  return createClient<Database>(supabaseUrl, supabaseKey);
}

// GET /api/tests - Get all tests
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('test')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tests', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/tests - Create a new test
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('test')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error creating test:', error);
    return NextResponse.json(
      { error: 'Failed to create test', details: error.message },
      { status: 500 }
    );
  }
}
