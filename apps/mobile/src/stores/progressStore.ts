import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { subDays, format } from '../utils/date';

interface ProgressStore {
  weeklyData: { labels: string[]; data: number[] };
  streaks: { roleId: string; roleName: string; days: number }[];
  identityScore: number;
  loading: boolean;
  fetchProgress: () => Promise<void>;
  getWeeklyProgress: () => { labels: string[]; data: number[] };
  getStreaks: () => { roleId: string; roleName: string; days: number }[];
  getIdentityScore: () => number;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  weeklyData: { labels: [], data: [] },
  streaks: [],
  identityScore: 0,
  loading: false,

  fetchProgress: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch last 7 days of checkins
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return format(date, 'yyyy-MM-dd');
      });

      const { data: checkins, error } = await supabase
        .from('daily_checkins')
        .select(`
          *,
          micro_steps!inner (
            *,
            milestones!inner (
              *,
              outcomes!inner (
                *,
                roles!inner (
                  id,
                  name
                )
              )
            )
          )
        `)
        .eq('user_id', user.id)
        .in('date', dates);

      if (error) throw error;

      // Calculate weekly completion rates
      const weeklyData = dates.map(date => {
        const dayCheckins = checkins?.filter(c => c.date === date) || [];
        const completed = dayCheckins.filter(c => c.status === 'done').length;
        const total = dayCheckins.length;
        return {
          label: format(new Date(date), 'EEE'),
          rate: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      });

      // Calculate streaks by role
      const roleStreaks: { [key: string]: { name: string; streak: number } } = {};
      const roleLastCompleted: { [key: string]: string } = {};

      // Process checkins in reverse chronological order
      const sortedCheckins = (checkins || []).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      sortedCheckins.forEach(checkin => {
        const roleId = checkin.micro_steps.milestones.outcomes.roles.id;
        const roleName = checkin.micro_steps.milestones.outcomes.roles.name;

        if (!roleStreaks[roleId]) {
          roleStreaks[roleId] = { name: roleName, streak: 0 };
        }

        if (checkin.status === 'done') {
          const lastDate = roleLastCompleted[roleId];
          if (!lastDate || 
              new Date(lastDate).getTime() - new Date(checkin.date).getTime() === 86400000) {
            roleStreaks[roleId].streak += 1;
            roleLastCompleted[roleId] = checkin.date;
          }
        }
      });

      // Calculate identity score (average completion rate over last 7 days)
      const totalCompleted = weeklyData.reduce((sum, day) => sum + day.rate, 0);
      const identityScore = Math.round(totalCompleted / 7);

      set({
        weeklyData: {
          labels: weeklyData.map(d => d.label),
          data: weeklyData.map(d => d.rate),
        },
        streaks: Object.entries(roleStreaks).map(([roleId, data]) => ({
          roleId,
          roleName: data.name,
          days: data.streak,
        })),
        identityScore,
      });
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      set({ loading: false });
    }
  },

  getWeeklyProgress: () => get().weeklyData,
  getStreaks: () => get().streaks,
  getIdentityScore: () => get().identityScore,
}));