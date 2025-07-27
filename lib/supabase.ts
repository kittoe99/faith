import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper type for tables
type Tables = Database['public']['Tables']
type TableName = keyof Tables

// Helper type for table row types
export type TableRow<T extends TableName> = Tables[T]['Row']
export type TableInsert<T extends TableName> = Tables[T]['Insert']
export type TableUpdate<T extends TableName> = Tables[T]['Update']

// Helper function for type-safe table access
export const from = <T extends TableName>(table: T) => {
  return {
    select: <K extends keyof Tables[T]['Row'] = keyof Tables[T]['Row']>(
      columns?: K[] | string
    ) => {
      return supabase.from(table).select(columns as string)
    },
    insert: (values: Tables[T]['Insert'] | Tables[T]['Insert'][]) => {
      return supabase.from(table).insert(values as any)
    },
    update: (values: Tables[T]['Update']) => {
      return supabase.from(table).update(values as any)
    },
    delete: () => {
      return supabase.from(table).delete()
    },
  }
}

// Helper function to get the current user's session
export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session?.user ?? null;
};

// Helper function to sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
