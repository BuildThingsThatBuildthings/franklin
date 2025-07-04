import { useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useRoleStore } from '../stores/roleStore';
import { useOutcomeStore } from '../stores/outcomeStore';
import { useMilestoneStore } from '../stores/milestoneStore';
import { useMicroStepStore } from '../stores/microStepStore';
import { useProgressStore } from '../stores/progressStore';

export function useInitializeStores() {
  const { user } = useAuth();
  const fetchRoles = useRoleStore((state) => state.fetchRoles);
  const fetchOutcomes = useOutcomeStore((state) => state.fetchOutcomes);
  const fetchMilestones = useMilestoneStore((state) => state.fetchMilestones);
  const fetchMicroSteps = useMicroStepStore((state) => state.fetchMicroSteps);
  const fetchProgress = useProgressStore((state) => state.fetchProgress);

  useEffect(() => {
    if (user) {
      // Initialize all stores when user logs in
      Promise.all([
        fetchRoles(),
        fetchOutcomes(),
        fetchMilestones(),
        fetchMicroSteps(),
        fetchProgress(),
      ]).catch(console.error);
    }
  }, [user]);
}