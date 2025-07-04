export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Role {
  id: string;
  user_id: string;
  name: string;
  color?: string;
  order: number;
  created_at: string;
  updated_at: string;
  outcomes: Outcome[];
}

export interface Outcome {
  id: string;
  role_id: string;
  title: string;
  target_date: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  outcome_id: string;
  title: string;
  due_date?: string;
  order: number;
  created_at: string;
  updated_at: string;
  micro_steps: MicroStep[];
}

export interface MicroStep {
  id: string;
  milestone_id: string;
  description: string;
  type: 'do' | 'avoid' | 'numeric';
  integration?: any;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  date: string;
  micro_step_id: string;
  status: 'planned' | 'done' | 'skipped';
  note?: string;
  created_at: string;
  updated_at: string;
}