import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Initialize Supabase client for data operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Service for common database operations
export class DatabaseService {
  // Generic method to get data from any table
  static async getData<T>(
    table: keyof Database['public']['Tables'],
    filters: Record<string, any> = {},
    select: string = '*'
  ): Promise<{ data: T[] | null; error: any }> {
    let query = supabase.from(table).select(select);
    
    // Apply filters
    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });
    
    const { data, error } = await query;
    return { data: data as T[] | null, error };
  }
  
  // Generic method to insert data into any table
  static async insertData<T>(
    table: keyof Database['public']['Tables'],
    data: T
  ): Promise<{ data: T | null; error: any }> {
    const { data: result, error } = await supabase.from(table).insert(data).select().single();
    return { data: result as T | null, error };
  }
  
  // Generic method to update data in any table
  static async updateData<T>(
    table: keyof Database['public']['Tables'],
    filters: Record<string, any>,
    data: Partial<T>
  ): Promise<{ data: T | null; error: any }> {
    let query = supabase.from(table).update(data);
    
    // Apply filters
    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });
    
    const { data: result, error } = await query.select().single();
    return { data: result as T | null, error };
  }
  
  // Generic method to delete data from any table
  static async deleteData(
    table: keyof Database['public']['Tables'],
    filters: Record<string, any>
  ): Promise<{ data: null; error: any }> {
    let query = supabase.from(table).delete();
    
    // Apply filters
    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });
    
    const { error } = await query;
    return { data: null, error };
  }
  
  // Method to subscribe to real-time changes
  static subscribeToChanges(
    table: keyof Database['public']['Tables'],
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        callback
      )
      .subscribe();
  }
}

// Specific services for common tables
export class TestService {
  static table: keyof Database['public']['Tables'] = 'test' as const;
  
  static async getAll() {
    return DatabaseService.getData<TestRow>('test');
  }
  
  static async getById(id: string) {
    return DatabaseService.getData<TestRow>('test', { id });
  }
  
  static async create(data: Database['public']['Tables']['test']['Insert']) {
    return DatabaseService.insertData('test', data as any);
  }
  
  static async update(id: string, data: Database['public']['Tables']['test']['Update']) {
    return DatabaseService.updateData('test', { id }, data);
  }
  
  static async delete(id: string) {
    return DatabaseService.deleteData('test', { id });
  }
  
  static subscribe(callback: (payload: any) => void) {
    return DatabaseService.subscribeToChanges('test', callback);
  }
}

// Type for our test table
type TestRow = Database['public']['Tables']['test']['Row'];
