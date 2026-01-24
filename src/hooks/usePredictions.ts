import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  arena_balance: number;
  total_predictions: number;
  total_wins: number;
}

interface Prediction {
  id: string;
  match_id: string;
  selected_team: string;
  stake_amount: number;
  potential_winnings: number;
  odds: number;
  status: string;
  created_at: string;
}

export const usePredictions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  
  // Track previous predictions to detect status changes
  const previousPredictionsRef = useRef<Map<string, string>>(new Map());

  const showPredictionNotification = (prediction: Prediction, previousStatus: string) => {
    if (previousStatus === 'pending' && prediction.status === 'won') {
      toast({
        title: "🎉 Pronostic Gagné !",
        description: `Votre pari sur ${prediction.selected_team} a gagné ! +${prediction.potential_winnings} Arena Points`,
        duration: 8000,
      });
      
      // Play win sound effect
      playNotificationSound('win');
    } else if (previousStatus === 'pending' && prediction.status === 'lost') {
      toast({
        title: "😔 Pronostic Perdu",
        description: `Votre pari sur ${prediction.selected_team} n'a pas abouti. -${prediction.stake_amount} Arena Points`,
        variant: "destructive",
        duration: 6000,
      });
      
      playNotificationSound('lose');
    }
  };

  const playNotificationSound = (type: 'win' | 'lose') => {
    // Create audio context for notification sounds
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'win') {
        // Happy ascending tone
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      } else {
        // Sad descending tone
        oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
        oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime + 0.15); // F4
        oscillator.frequency.setValueAtTime(293.66, audioContext.currentTime + 0.3); // D4
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch (error) {
      console.log('Audio notification not supported');
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPredictions();
      
      // Subscribe to realtime updates with notification handling
      const channel = supabase
        .channel('predictions-realtime')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'predictions',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const updatedPrediction = payload.new as Prediction;
            const previousStatus = previousPredictionsRef.current.get(updatedPrediction.id);
            
            // Show notification if status changed
            if (previousStatus && previousStatus !== updatedPrediction.status) {
              showPredictionNotification(updatedPrediction, previousStatus);
            }
            
            // Update the ref
            previousPredictionsRef.current.set(updatedPrediction.id, updatedPrediction.status);
            
            fetchPredictions();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'predictions',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const newPrediction = payload.new as Prediction;
            previousPredictionsRef.current.set(newPrediction.id, newPrediction.status);
            fetchPredictions();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchProfile();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('arena_balance, total_predictions, total_wins')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
    } else if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchPredictions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      // Update the tracking map with current statuses
      data.forEach(prediction => {
        if (!previousPredictionsRef.current.has(prediction.id)) {
          previousPredictionsRef.current.set(prediction.id, prediction.status);
        }
      });
    }

    if (error) {
      console.error('Error fetching predictions:', error);
    } else {
      setPredictions(data || []);
    }
  };

  const placePrediction = async (
    matchId: string,
    selectedTeam: string,
    stakeAmount: number,
    odds: number
  ) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour placer un pronostic",
        variant: "destructive"
      });
      return false;
    }

    if (!profile) {
      toast({
        title: "Erreur",
        description: "Profil non trouvé",
        variant: "destructive"
      });
      return false;
    }

    if (stakeAmount < 50) {
      toast({
        title: "Mise minimum",
        description: "La mise minimum est de 50 Arena Points",
        variant: "destructive"
      });
      return false;
    }

    if (stakeAmount > profile.arena_balance) {
      toast({
        title: "Solde insuffisant",
        description: `Vous avez ${profile.arena_balance} Arena Points`,
        variant: "destructive"
      });
      return false;
    }

    setPlacing(true);

    try {
      const potentialWinnings = Math.floor(stakeAmount * odds);

      // Insert prediction
      const { error: predictionError } = await supabase
        .from('predictions')
        .insert({
          user_id: user.id,
          match_id: matchId,
          selected_team: selectedTeam,
          stake_amount: stakeAmount,
          potential_winnings: potentialWinnings,
          odds: odds,
          status: 'pending'
        });

      if (predictionError) throw predictionError;

      // Deduct from balance
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          arena_balance: profile.arena_balance - stakeAmount,
          total_predictions: profile.total_predictions + 1
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Record in ledger
      const { error: ledgerError } = await supabase
        .from('arena_ledger')
        .insert({
          user_id: user.id,
          amount: -stakeAmount,
          source: 'prediction_loss',
          description: `Pronostic sur ${selectedTeam}`,
          reference_id: matchId
        });

      if (ledgerError) throw ledgerError;

      toast({
        title: "Pronostic placé !",
        description: `${stakeAmount} Arena Points misés sur ${selectedTeam}`,
      });

      await fetchProfile();
      await fetchPredictions();
      return true;
    } catch (error) {
      console.error('Error placing prediction:', error);
      toast({
        title: "Erreur",
        description: "Impossible de placer le pronostic",
        variant: "destructive"
      });
      return false;
    } finally {
      setPlacing(false);
    }
  };

  return {
    profile,
    predictions,
    loading,
    placing,
    placePrediction,
    refetch: fetchProfile
  };
};
