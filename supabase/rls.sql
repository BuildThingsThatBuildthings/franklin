-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;

-- Roles policies
CREATE POLICY "Users can view their own roles" ON roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own roles" ON roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roles" ON roles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roles" ON roles
  FOR DELETE USING (auth.uid() = user_id);

-- Outcomes policies
CREATE POLICY "Users can view their own outcomes" ON outcomes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM roles
      WHERE roles.id = outcomes.role_id
      AND roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create outcomes for their roles" ON outcomes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM roles
      WHERE roles.id = outcomes.role_id
      AND roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own outcomes" ON outcomes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM roles
      WHERE roles.id = outcomes.role_id
      AND roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own outcomes" ON outcomes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM roles
      WHERE roles.id = outcomes.role_id
      AND roles.user_id = auth.uid()
    )
  );

-- Milestones policies
CREATE POLICY "Users can view their own milestones" ON milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM outcomes
      JOIN roles ON roles.id = outcomes.role_id
      WHERE outcomes.id = milestones.outcome_id
      AND roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create milestones for their outcomes" ON milestones
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM outcomes
      JOIN roles ON roles.id = outcomes.role_id
      WHERE outcomes.id = milestones.outcome_id
      AND roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own milestones" ON milestones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM outcomes
      JOIN roles ON roles.id = outcomes.role_id
      WHERE outcomes.id = milestones.outcome_id
      AND roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own milestones" ON milestones
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM outcomes
      JOIN roles ON roles.id = outcomes.role_id
      WHERE outcomes.id = milestones.outcome_id
      AND roles.user_id = auth.uid()
    )
  );

-- Micro-steps policies
CREATE POLICY "Users can view their own micro-steps" ON micro_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM milestones
      JOIN outcomes ON outcomes.id = milestones.outcome_id
      JOIN roles ON roles.id = outcomes.role_id
      WHERE milestones.id = micro_steps.milestone_id
      AND roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create micro-steps for their milestones" ON micro_steps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM milestones
      JOIN outcomes ON outcomes.id = milestones.outcome_id
      JOIN roles ON roles.id = outcomes.role_id
      WHERE milestones.id = micro_steps.milestone_id
      AND roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own micro-steps" ON micro_steps
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM milestones
      JOIN outcomes ON outcomes.id = milestones.outcome_id
      JOIN roles ON roles.id = outcomes.role_id
      WHERE milestones.id = micro_steps.milestone_id
      AND roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own micro-steps" ON micro_steps
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM milestones
      JOIN outcomes ON outcomes.id = milestones.outcome_id
      JOIN roles ON roles.id = outcomes.role_id
      WHERE milestones.id = micro_steps.milestone_id
      AND roles.user_id = auth.uid()
    )
  );

-- Daily check-ins policies
CREATE POLICY "Users can view their own check-ins" ON daily_checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own check-ins" ON daily_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins" ON daily_checkins
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own check-ins" ON daily_checkins
  FOR DELETE USING (auth.uid() = user_id);