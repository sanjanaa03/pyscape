-- SQL script for setting up required tables in Supabase
-- Run this in the Supabase SQL editor

-- Create events table for analytics tracking
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  meta jsonb DEFAULT '{}'::jsonb,
  ts timestamptz DEFAULT now()
);

-- Add comment for clarity
COMMENT ON TABLE public.events IS 'User events for analytics tracking (topic selection, roadmap generation, module completion, etc.)';

-- Create recommendations table for personalized roadmaps
CREATE TABLE IF NOT EXISTS public.recommendations (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  roadmap jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Add comment for clarity
COMMENT ON TABLE public.recommendations IS 'Personalized roadmap recommendations for users based on their selected topics';

-- Create gamification table for points, badges, unlocks
CREATE TABLE IF NOT EXISTS public.gamification (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  points integer DEFAULT 0,
  badges jsonb DEFAULT '[]'::jsonb,
  unlocks jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Add comment for clarity
COMMENT ON TABLE public.gamification IS 'User gamification data including points, badges, and feature unlocks';

-- Add RLS policies for security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification ENABLE ROW LEVEL SECURITY;

-- Create policies to allow authenticated users to access their own data
CREATE POLICY "Users can view their own events" 
ON public.events FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events" 
ON public.events FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own recommendations" 
ON public.recommendations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations" 
ON public.recommendations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own gamification" 
ON public.gamification FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can update gamification" 
ON public.gamification FOR UPDATE 
USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events (user_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events (type);
CREATE INDEX IF NOT EXISTS idx_events_ts ON public.events (ts);

-- Add updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS recommendations_updated_at ON public.recommendations;
CREATE TRIGGER recommendations_updated_at
  BEFORE UPDATE ON public.recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
  
DROP TRIGGER IF EXISTS gamification_updated_at ON public.gamification;
CREATE TRIGGER gamification_updated_at
  BEFORE UPDATE ON public.gamification
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();