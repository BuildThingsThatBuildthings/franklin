-- Optional: Seed data for development/testing
-- This file can be used to insert sample data

-- Example seed data (commented out by default)
/*
-- Insert a test user (you'd need to create this user through Supabase Auth first)
-- INSERT INTO auth.users (id, email) VALUES 
--   ('123e4567-e89b-12d3-a456-426614174000', 'test@example.com');

-- Insert sample roles
INSERT INTO roles (user_id, name, color, "order") VALUES
  ('123e4567-e89b-12d3-a456-426614174000', 'Father', 'blue', 1),
  ('123e4567-e89b-12d3-a456-426614174000', 'Professional', 'green', 2),
  ('123e4567-e89b-12d3-a456-426614174000', 'Health Enthusiast', 'red', 3);

-- Insert sample outcomes
INSERT INTO outcomes (role_id, title, target_date) VALUES
  ((SELECT id FROM roles WHERE name = 'Father' LIMIT 1), 'Be present and engaged with family', CURRENT_DATE + INTERVAL '12 weeks'),
  ((SELECT id FROM roles WHERE name = 'Professional' LIMIT 1), 'Launch new product feature', CURRENT_DATE + INTERVAL '12 weeks'),
  ((SELECT id FROM roles WHERE name = 'Health Enthusiast' LIMIT 1), 'Complete first marathon', CURRENT_DATE + INTERVAL '12 weeks');
*/