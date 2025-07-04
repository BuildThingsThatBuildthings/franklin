-- Function to calculate identity score based on completion rates
CREATE OR REPLACE FUNCTION calculate_identity_score(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER;
  v_total_steps INTEGER;
  v_completed_steps INTEGER;
  v_days_considered INTEGER := 7;
BEGIN
  -- Count total steps and completed steps in the last 7 days
  SELECT 
    COUNT(*) FILTER (WHERE dc.status IS NOT NULL),
    COUNT(*) FILTER (WHERE dc.status = 'done')
  INTO v_total_steps, v_completed_steps
  FROM daily_checkins dc
  WHERE dc.user_id = p_user_id
    AND dc.date >= CURRENT_DATE - INTERVAL '7 days';

  -- Calculate score as percentage
  IF v_total_steps > 0 THEN
    v_score := ROUND((v_completed_steps::NUMERIC / v_total_steps) * 100);
  ELSE
    v_score := 0;
  END IF;

  RETURN v_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;