import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Role {
  id: string;
  name: string;
  color?: string;
  order: number;
  outcomes: any[];
  milestones: any[];
}

interface RoleStore {
  roles: Role[];
  loading: boolean;
  fetchRoles: () => Promise<void>;
  addRole: (name: string) => Promise<void>;
  updateRole: (id: string, updates: Partial<Role>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
}

export const useRoleStore = create<RoleStore>((set, get) => ({
  roles: [],
  loading: false,

  fetchRoles: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('roles')
        .select(`
          *,
          outcomes (*,
            milestones (*)
          )
        `)
        .eq('user_id', user.id)
        .order('order');

      if (error) throw error;
      set({ roles: data || [] });
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      set({ loading: false });
    }
  },

  addRole: async (name: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { roles } = get();
      const maxOrder = Math.max(...roles.map(r => r.order), 0);

      const { data, error } = await supabase
        .from('roles')
        .insert({
          user_id: user.id,
          name,
          order: maxOrder + 1,
        })
        .select()
        .single();

      if (error) throw error;
      set({ roles: [...roles, { ...data, outcomes: [], milestones: [] }] });
    } catch (error) {
      console.error('Error adding role:', error);
    }
  },

  updateRole: async (id: string, updates: Partial<Role>) => {
    try {
      const { error } = await supabase
        .from('roles')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      const { roles } = get();
      set({
        roles: roles.map(role =>
          role.id === id ? { ...role, ...updates } : role
        ),
      });
    } catch (error) {
      console.error('Error updating role:', error);
    }
  },

  deleteRole: async (id: string) => {
    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const { roles } = get();
      set({ roles: roles.filter(role => role.id !== id) });
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  },
}));