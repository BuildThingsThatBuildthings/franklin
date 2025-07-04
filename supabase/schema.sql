-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth)

-- Roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Outcomes table (12-week goals)
CREATE TABLE outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  target_date DATE NOT NULL,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Milestones table
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outcome_id UUID REFERENCES outcomes(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  due_date DATE,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Micro-steps table
CREATE TABLE micro_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  type TEXT CHECK (type IN ('do', 'avoid', 'numeric')) NOT NULL DEFAULT 'do',
  integration JSONB,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Daily check-ins table
CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  micro_step_id UUID REFERENCES micro_steps(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('planned', 'done', 'skipped')) NOT NULL DEFAULT 'planned',
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, date, micro_step_id)
);

-- Indexes for performance
CREATE INDEX idx_roles_user_id ON roles(user_id);
CREATE INDEX idx_outcomes_role_id ON outcomes(role_id);
CREATE INDEX idx_milestones_outcome_id ON milestones(outcome_id);
CREATE INDEX idx_micro_steps_milestone_id ON micro_steps(milestone_id);
CREATE INDEX idx_daily_checkins_user_date ON daily_checkins(user_id, date);
CREATE INDEX idx_daily_checkins_date ON daily_checkins(date);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outcomes_updated_at BEFORE UPDATE ON outcomes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_micro_steps_updated_at BEFORE UPDATE ON micro_steps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_checkins_updated_at BEFORE UPDATE ON daily_checkins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();