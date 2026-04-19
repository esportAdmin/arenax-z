import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useOnboarding() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkOnboardingStatus = useCallback(async () => {
    if (!user) {
      setShowOnboarding(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking onboarding status:', error);
        setLoading(false);
        return;
      }

      setShowOnboarding(!data || !data.onboarding_completed);
    } catch (err) {
      console.error('Error checking onboarding:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      void checkOnboardingStatus();
    } else {
      setLoading(false);
    }
  }, [user, checkOnboardingStatus]);

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString()
        })
        .eq('id', user.id);

      setShowOnboarding(false);
    } catch (err) {
      console.error('Error completing onboarding:', err);
      // Still close the modal even if update fails
      setShowOnboarding(false);
    }
  };

  return {
    showOnboarding,
    loading,
    completeOnboarding,
  };
}
