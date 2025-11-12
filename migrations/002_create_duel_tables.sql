-- Code Duel Database Schema
-- Migration for real-time duel functionality
-- PREREQUISITE: Run migrations/001_create_core_tables.sql first!

-- =====================
-- 1. Duels Table
-- =====================
CREATE TABLE public.duels (
    id TEXT PRIMARY KEY,
    problem_id INTEGER NOT NULL, -- Foreign key added later if problems table exists
    player1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    player2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'forfeited', 'timeout')),
    winner_id UUID REFERENCES auth.users(id),
    player1_score INTEGER DEFAULT 0,
    player2_score INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint only if problems table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'problems') THEN
        ALTER TABLE public.duels
        ADD CONSTRAINT duels_problem_id_fkey
        FOREIGN KEY (problem_id) REFERENCES public.problems(id);
    END IF;
END $$;

CREATE INDEX duels_player1_id_idx ON public.duels(player1_id);
CREATE INDEX duels_player2_id_idx ON public.duels(player2_id);
CREATE INDEX duels_status_idx ON public.duels(status);
CREATE INDEX duels_created_at_idx ON public.duels(created_at);

COMMENT ON TABLE public.duels IS 'Real-time code duel sessions';
COMMENT ON COLUMN public.duels.duration_ms IS 'Total duel duration in milliseconds';

-- =====================
-- 2. Duel Submissions Table
-- =====================
CREATE TABLE public.duel_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    duel_id TEXT NOT NULL REFERENCES public.duels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language TEXT NOT NULL,
    status TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    runtime_ms INTEGER,
    memory_kb INTEGER,
    test_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX duel_submissions_duel_id_idx ON public.duel_submissions(duel_id);
CREATE INDEX duel_submissions_user_id_idx ON public.duel_submissions(user_id);

COMMENT ON TABLE public.duel_submissions IS 'Code submissions during duels';

-- =====================
-- 3. Duel Stats Table (Aggregated)
-- =====================
CREATE TABLE public.duel_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_duels INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    forfeits INTEGER DEFAULT 0,
    win_streak INTEGER DEFAULT 0,
    best_win_streak INTEGER DEFAULT 0,
    total_xp_earned INTEGER DEFAULT 0,
    average_completion_time_ms INTEGER,
    rank INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX duel_stats_rank_idx ON public.duel_stats(rank);
CREATE INDEX duel_stats_wins_idx ON public.duel_stats(wins);

COMMENT ON TABLE public.duel_stats IS 'Aggregated duel statistics per user';

-- =====================
-- 4. RLS Policies for Duels
-- =====================
ALTER TABLE public.duels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duel_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duel_stats ENABLE ROW LEVEL SECURITY;

-- Duels policies
CREATE POLICY "Users can read their own duels"
  ON public.duels
  FOR SELECT
  USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE POLICY "System can insert duels"
  ON public.duels
  FOR INSERT
  WITH CHECK (true); -- Backend service will insert

CREATE POLICY "System can update duels"
  ON public.duels
  FOR UPDATE
  USING (true); -- Backend service will update

-- Duel submissions policies
CREATE POLICY "Users can read their own duel submissions"
  ON public.duel_submissions
  FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.duels 
    WHERE duels.id = duel_submissions.duel_id 
    AND (duels.player1_id = auth.uid() OR duels.player2_id = auth.uid())
  ));

CREATE POLICY "Users can insert their own duel submissions"
  ON public.duel_submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Duel stats policies
CREATE POLICY "Anyone can read duel stats (for leaderboard)"
  ON public.duel_stats
  FOR SELECT
  USING (true);

CREATE POLICY "System can update duel stats"
  ON public.duel_stats
  FOR ALL
  USING (true); -- Backend service manages this

-- =====================
-- 5. Functions for Duel Management
-- =====================

-- Function to update duel stats after a duel completes
CREATE OR REPLACE FUNCTION update_duel_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Update player 1 stats
    INSERT INTO public.duel_stats (user_id, total_duels, wins, losses)
    VALUES (
      NEW.player1_id,
      1,
      CASE WHEN NEW.winner_id = NEW.player1_id THEN 1 ELSE 0 END,
      CASE WHEN NEW.winner_id = NEW.player2_id THEN 1 ELSE 0 END
    )
    ON CONFLICT (user_id) DO UPDATE SET
      total_duels = duel_stats.total_duels + 1,
      wins = duel_stats.wins + CASE WHEN NEW.winner_id = NEW.player1_id THEN 1 ELSE 0 END,
      losses = duel_stats.losses + CASE WHEN NEW.winner_id = NEW.player2_id THEN 1 ELSE 0 END,
      updated_at = NOW();

    -- Update player 2 stats
    INSERT INTO public.duel_stats (user_id, total_duels, wins, losses)
    VALUES (
      NEW.player2_id,
      1,
      CASE WHEN NEW.winner_id = NEW.player2_id THEN 1 ELSE 0 END,
      CASE WHEN NEW.winner_id = NEW.player1_id THEN 1 ELSE 0 END
    )
    ON CONFLICT (user_id) DO UPDATE SET
      total_duels = duel_stats.total_duels + 1,
      wins = duel_stats.wins + CASE WHEN NEW.winner_id = NEW.player2_id THEN 1 ELSE 0 END,
      losses = duel_stats.losses + CASE WHEN NEW.winner_id = NEW.player1_id THEN 1 ELSE 0 END,
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER duels_update_stats
  AFTER UPDATE ON public.duels
  FOR EACH ROW
  EXECUTE FUNCTION update_duel_stats();

-- Function to calculate and update leaderboard ranks
CREATE OR REPLACE FUNCTION update_duel_ranks()
RETURNS void AS $$
BEGIN
  WITH ranked_users AS (
    SELECT 
      user_id,
      ROW_NUMBER() OVER (ORDER BY wins DESC, (wins::float / NULLIF(total_duels, 0)) DESC) as new_rank
    FROM public.duel_stats
    WHERE total_duels > 0
  )
  UPDATE public.duel_stats
  SET rank = ranked_users.new_rank
  FROM ranked_users
  WHERE duel_stats.user_id = ranked_users.user_id;
END;
$$ LANGUAGE plpgsql;

-- =====================
-- 6. Create Trigger to update updated_at
-- =====================
CREATE TRIGGER duel_stats_updated_at
  BEFORE UPDATE ON public.duel_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================
-- End of Duel Schema
-- =====================
