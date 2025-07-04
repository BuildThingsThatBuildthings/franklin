import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface MicroStep {
  id: string;
  milestone_id: string;
  description: string;
  type: 'do' | 'avoid' | 'numeric';
  integration?: any;
  order: number;
  status: 'planned' | 'done' | 'skipped';
  roleName?: string;
  date?: string;
}

interface MicroStepStore {
  microSteps: MicroStep[];
  dailyCheckins: any[];
  loading: boolean;
  fetchMicroSteps: () => Promise<void>;
  getTodaySteps: () => MicroStep[];
  updateStepStatus: (stepId: string, status: string) => Promise<void>;
  addReflection: (date: string, reflection: string) => Promise<void>;
}

export const useMicroStepStore = create<MicroStepStore>((set, get) => ({
  microSteps: [],
  dailyCheckins: [],
  loading: false,

  fetchMicroSteps: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = format(new Date(), 'yyyy-MM-dd');

      // Fetch all micro steps with their milestones and roles
      const { data: steps, error: stepsError } = await supabase
        .from('micro_steps')
        .select(`
          *,
          milestones!inner (
            *,
            outcomes!inner (
              *,
              roles!inner (
                name
              )
            )
          )
        `)
        .eq('milestones.outcomes.roles.user_id', user.id)
        .order('order');

      if (stepsError) throw stepsError;

      // Fetch today's checkins
      const { data: checkins, error: checkinsError } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today);

      if (checkinsError) throw checkinsError;

      // Merge steps with checkin status
      const stepsWithStatus = steps?.map(step => {
        const checkin = checkins?.find(c => c.micro_step_id === step.id);
        return {
          ...step,
          status: checkin?.status || 'planned',
          roleName: step.milestones.outcomes.roles.name,
        };
      }) || [];

      set({ microSteps: stepsWithStatus, dailyCheckins: checkins || [] });
    } catch (error) {
      console.error('Error fetching micro steps:', error);
    } finally {
      set({ loading: false });
    }
  },

  getTodaySteps: () => {
    const { microSteps } = get();
    return microSteps;
  },

  updateStepStatus: async (stepId: string, status: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = format(new Date(), 'yyyy-MM-dd');
      const { dailyCheckins } = get();
      const existingCheckin = dailyCheckins.find(
        c => c.micro_step_id === stepId && c.date === today
      );

      if (existingCheckin) {
        // Update existing checkin
        const { error } = await supabase
          .from('daily_checkins')
          .update({ status })
          .eq('id', existingCheckin.id);

        if (error) throw error;
      } else {
        // Create new checkin
        const { error } = await supabase
          .from('daily_checkins')
          .insert({
            user_id: user.id,
            date: today,
            micro_step_id: stepId,
            status,
          });

        if (error) throw error;
      }

      // Update local state
      const { microSteps } = get();
      set({
        microSteps: microSteps.map(step =>
          step.id === stepId ? { ...step, status } : step
        ),
      });
    } catch (error) {
      console.error('Error updating step status:', error);
    }
  },

  addReflection: async (date: string, reflection: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, we'll store reflections in a note field on checkins
      // In a real app, you might want a separate reflections table
      const { dailyCheckins } = get();
      const todayCheckins = dailyCheckins.filter(c => c.date === date);

      if (todayCheckins.length > 0) {
        // Update the first checkin with the reflection
        const { error } = await supabase
          .from('daily_checkins')
          .update({ note: reflection })
          .eq('id', todayCheckins[0].id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error adding reflection:', error);
    }
  },
}));