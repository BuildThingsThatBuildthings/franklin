import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Outcome {
  id: string;
  role_id: string;
  title: string;
  target_date: string;
  archived: boolean;
  milestones?: any[];
}

interface OutcomeStore {
  outcomes: Outcome[];
  loading: boolean;
  fetchOutcomes: () => Promise<void>;
  addOutcome: (roleId: string, title: string, targetDate: Date) => Promise<void>;
  updateOutcome: (id: string, updates: Partial<Outcome>) => Promise<void>;
  deleteOutcome: (id: string) => Promise<void>;
  archiveOutcome: (id: string) => Promise<void>;
}

export const useOutcomeStore = create<OutcomeStore>((set, get) => ({
  outcomes: [],
  loading: false,

  fetchOutcomes: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('outcomes')
        .select(`
          *,
          milestones (*),
          roles!inner (
            user_id
          )
        `)
        .eq('roles.user_id', user.id)
        .order('target_date');

      if (error) throw error;
      set({ outcomes: data || [] });
    } catch (error) {
      console.error('Error fetching outcomes:', error);
    } finally {
      set({ loading: false });
    }
  },

  addOutcome: async (roleId: string, title: string, targetDate: Date) => {
    try {
      const { data, error } = await supabase
        .from('outcomes')
        .insert({
          role_id: roleId,
          title,
          target_date: targetDate.toISOString().split('T')[0],
          archived: false,
        })
        .select()
        .single();

      if (error) throw error;
      
      const { outcomes } = get();
      set({ outcomes: [...outcomes, { ...data, milestones: [] }] });
    } catch (error) {
      console.error('Error adding outcome:', error);
    }
  },

  updateOutcome: async (id: string, updates: Partial<Outcome>) => {
    try {
      const { error } = await supabase
        .from('outcomes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      const { outcomes } = get();
      set({
        outcomes: outcomes.map(outcome =>
          outcome.id === id ? { ...outcome, ...updates } : outcome
        ),
      });
    } catch (error) {
      console.error('Error updating outcome:', error);
    }
  },

  deleteOutcome: async (id: string) => {
    try {
      const { error } = await supabase
        .from('outcomes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { outcomes } = get();
      set({ outcomes: outcomes.filter(outcome => outcome.id !== id) });
    } catch (error) {
      console.error('Error deleting outcome:', error);
    }
  },

  archiveOutcome: async (id: string) => {
    await get().updateOutcome(id, { archived: true });
  },
}));