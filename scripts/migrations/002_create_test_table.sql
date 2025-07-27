-- Create a test table with common field types
CREATE TABLE IF NOT EXISTS public.test (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  value INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add a comment to the table
COMMENT ON TABLE public.test IS 'A test table for development and experimentation';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_test_name ON public.test(name);
CREATE INDEX IF NOT EXISTS idx_test_created_at ON public.test(created_at);

-- Enable Row Level Security
ALTER TABLE public.test ENABLE ROW LEVEL SECURITY;

-- Create policies for the test table
CREATE POLICY "Enable read access for all users" 
  ON public.test 
  FOR SELECT 
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
  ON public.test 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user_id" 
  ON public.test 
  FOR UPDATE 
  USING (auth.uid() = (metadata->>'user_id')::uuid)
  WITH CHECK (auth.uid() = (metadata->>'user_id')::uuid);

-- Create a trigger to update the updated_at column
CREATE TRIGGER handle_test_updated_at
BEFORE UPDATE ON public.test
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some test data
INSERT INTO public.test (name, description, value, tags, metadata)
VALUES 
  ('First Test', 'This is the first test record', 100, ARRAY['test', 'demo'], '{"user_id": "00000000-0000-0000-0000-000000000000", "category": "sample"}'),
  ('Second Test', 'Another test record', 200, ARRAY['demo'], '{"user_id": "00000000-0000-0000-0000-000000000000", "category": "sample"}'),
  ('Active Test', 'This test is active', 300, ARRAY['test', 'active'], '{"user_id": "00000000-0000-0000-0000-000000000000", "category": "sample"}');

-- Create a view for active tests
CREATE OR REPLACE VIEW public.active_tests AS
SELECT id, name, description, value, created_at
FROM public.test
WHERE is_active = true;
