import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Milestone {
  id: string;
  outcome_id: string;
  title: string;
  due_date?: string;
  order: number;
}

interface MilestoneStore {
  milestones: Milestone[];
  loading: boolean;
  fetchMilestones: () => Promise<void>;
  addMilestone: (outcomeId: string, title: string, dueDate?: Date) => Promise<void>;
  updateMilestone: (id: string, updates: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
  reorderMilestones: (outcomeId: string, milestoneIds: string[]) => Promise<void>;
}

export const useMilestoneStore = create<MilestoneStore>((set, get) => ({
  milestones: [],
  loading: false,

  fetchMilestones: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('milestones')
        .select(`
          *,
          outcomes!inner (
            id,
            roles!inner (
              user_id
            )
          )
        `)
        .eq('outcomes.roles.user_id', user.id)
        .order('order');

      if (error) throw error;
      set({ milestones: data || [] });
    } catch (error) {
      console.error('Error fetching milestones:', error);
    } finally {
      set({ loading: false });
    }
  },

  addMilestone: async (outcomeId: string, title: string, dueDate?: Date) => {
    try {
      const { milestones } = get();
      const outcomeMilestones = milestones.filter(m => m.outcome_id === outcomeId);
      const maxOrder = Math.max(...outcomeMilestones.map(m => m.order), 0);

      const { data, error } = await supabase
        .from('milestones')
        .insert({
          outcome_id: outcomeId,
          title,
          due_date: dueDate?.toISOString().split('T')[0],
          order: maxOrder + 1,
        })
        .select()
        .single();

      if (error) throw error;
      set({ milestones: [...milestones, data] });
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  },

  updateMilestone: async (id: string, updates: Partial<Milestone>) => {
    try {
      const { error } = await supabase
        .from('milestones')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      const { milestones } = get();
      set({
        milestones: milestones.map(milestone =>
          milestone.id === id ? { ...milestone, ...updates } : milestone
        ),
      });
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  },

  deleteMilestone: async (id: string) => {
    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { milestones } = get();
      set({ milestones: milestones.filter(milestone => milestone.id !== id) });
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  },

  reorderMilestones: async (outcomeId: string, milestoneIds: string[]) => {
    try {
      const updates = milestoneIds.map((id, index) => ({
        id,
        order: index + 1,
      }));

      for (const update of updates) {
        await supabase
          .from('milestones')
          .update({ order: update.order })
          .eq('id', update.id);
      }

      await get().fetchMilestones();
    } catch (error) {
      console.error('Error reordering milestones:', error);
    }
  },
}));