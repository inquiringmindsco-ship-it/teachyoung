-- ============================================================
-- TeachYoung / Overstood™ — Supabase Schema
-- Linked to Likeness™ ecosystem via lk_id
-- ============================================================

-- Users: one row per LikenessVerified user who accesses TeachYoung
-- Created on first session (auto-provisioned by bridge)
CREATE TABLE IF NOT EXISTS teachyoung_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lk_id TEXT NOT NULL UNIQUE,
  email TEXT,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual lesson sessions
CREATE TABLE IF NOT EXISTS teachyoung_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES teachyoung_users(id) ON DELETE CASCADE,
  lk_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  image_url TEXT,
  lesson_data JSONB NOT NULL DEFAULT '{}',
  depth_mode TEXT DEFAULT 'standard' CHECK (depth_mode IN ('quick', 'standard', 'deep')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz scores per lesson attempt
CREATE TABLE IF NOT EXISTS teachyoung_quiz_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES teachyoung_users(id) ON DELETE CASCADE,
  lk_id TEXT NOT NULL,
  lesson_id UUID REFERENCES teachyoung_lessons(id) ON DELETE SET NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  subject TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Streak and daily progress
CREATE TABLE IF NOT EXISTS teachyoung_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES teachyoung_users(id) ON DELETE CASCADE UNIQUE,
  lk_id TEXT NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_discoveries INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_teachyoung_lessons_lk ON teachyoung_lessons(lk_id);
CREATE INDEX IF NOT EXISTS idx_teachyoung_lessons_user ON teachyoung_lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_teachyoung_quiz_lk ON teachyoung_quiz_scores(lk_id);
CREATE INDEX IF NOT EXISTS idx_teachyoung_progress_lk ON teachyoung_progress(lk_id);

-- RLS
ALTER TABLE teachyoung_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachyoung_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachyoung_quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachyoung_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "users_own_data" ON teachyoung_users FOR ALL
  USING (lk_id = current_setting('app.lk_id', true));

CREATE POLICY "lessons_own_data" ON teachyoung_lessons FOR ALL
  USING (lk_id = current_setting('app.lk_id', true));

CREATE POLICY "quiz_own_data" ON teachyoung_quiz_scores FOR ALL
  USING (lk_id = current_setting('app.lk_id', true));

CREATE POLICY "progress_own_data" ON teachyoung_progress FOR ALL
  USING (lk_id = current_setting('app.lk_id', true));
