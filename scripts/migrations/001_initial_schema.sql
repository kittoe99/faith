-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create prayers table
CREATE TABLE IF NOT EXISTS public.prayers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_answered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;

-- Create policies for prayers
CREATE POLICY "Users can view their own prayers." 
  ON public.prayers FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prayers." 
  ON public.prayers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayers." 
  ON public.prayers FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create bible_reading_plans table
CREATE TABLE IF NOT EXISTS public.bible_reading_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create bible_reading_plan_days table
CREATE TABLE IF NOT EXISTS public.bible_reading_plan_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES public.bible_reading_plans(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  reading_references TEXT[] NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_plan_day UNIQUE (plan_id, day_number)
);

-- Enable Row Level Security for reading plans
ALTER TABLE public.bible_reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_reading_plan_days ENABLE ROW LEVEL SECURITY;

-- Create policies for reading plans
CREATE POLICY "Users can view their own reading plans." 
  ON public.bible_reading_plans FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading plans." 
  ON public.bible_reading_plans FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading plans." 
  ON public.bible_reading_plans FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at
CREATE TRIGGER handle_profiles_updated_at 
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER handle_prayers_updated_at 
BEFORE UPDATE ON public.prayers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER handle_reading_plans_updated_at 
BEFORE UPDATE ON public.bible_reading_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER handle_reading_plan_days_updated_at 
BEFORE UPDATE ON public.bible_reading_plan_days
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create a function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to create a profile when a new user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to get table structure (helpful for debugging)
CREATE OR REPLACE FUNCTION public.get_table_structure(table_name text)
RETURNS TABLE(column_name text, data_type text, is_nullable text, column_default text) AS $$
BEGIN
  RETURN QUERY 
  SELECT 
    columns.column_name::text,
    columns.data_type::text,
    columns.is_nullable::text,
    columns.column_default::text
  FROM information_schema.columns 
  WHERE table_schema = 'public' 
    AND table_name = get_table_structure.table_name;
END;
$$ LANGUAGE plpgsql;
