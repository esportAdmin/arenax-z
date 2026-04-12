import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  arena_balance: number;
  total_live_calls: number;
  total_predictions: number;
  total_wins: number;
}

interface LiveCallRecord {
  id: string;
  match_id: string;
  selected_team: string;
  activityCommitment: number;
  projectedImpact: number;
  signalWeight: number;
  status: string;
  created_at: string;
}

type LegacyLiveCallRow = {
  id: string;
  match_id: string;
  selected_team: string;
  stake_amount: number;
  potential_winnings: number;
  odds: number;
  status: string;
  created_at: string;
};

const USE_STATIC_LIVE_CALLS = process.env.NODE_ENV !== "production";
const LEGACY_LIVE_CALL_TABLE = "predictions";

const FALLBACK_PROFILE: Profile = {
  arena_balance: 1450,
  total_live_calls: 128,
  total_predictions: 128,
  total_wins: 84,
};

const FALLBACK_LIVE_CALLS: LiveCallRecord[] = [
  {
    id: "live-call-1",
    match_id: "fallback-match-1",
    selected_team: "Shadow Legion",
    activityCommitment: 150,
    projectedImpact: 258,
    signalWeight: 1.72,
    status: "won",
    created_at: new Date().toISOString(),
  },
  {
    id: "live-call-2",
    match_id: "fallback-match-2",
    selected_team: "Titan Force",
    activityCommitment: 100,
    projectedImpact: 194,
    signalWeight: 1.94,
    status: "pending",
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

function mapLegacyLiveCall(row: LegacyLiveCallRow): LiveCallRecord {
  return {
    id: row.id,
    match_id: row.match_id,
    selected_team: row.selected_team,
    activityCommitment: row.stake_amount,
    projectedImpact: row.potential_winnings,
    signalWeight: row.odds,
    status: row.status,
    created_at: row.created_at,
  };
}

export const useLiveCalls = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [liveCalls, setLiveCalls] = useState<LiveCallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const previousLiveCallsRef = useRef<Map<string, string>>(new Map());

  const playNotificationSound = useCallback((type: "win" | "lose") => {
    try {
      const audioContext = new (
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === "win") {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.4,
        );
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      } else {
        oscillator.frequency.setValueAtTime(392, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime + 0.15);
        oscillator.frequency.setValueAtTime(293.66, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5,
        );
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch {
      return;
    }
  }, []);

  const showLiveCallNotification = useCallback(
    (liveCall: LiveCallRecord, previousStatus: string) => {
      if (previousStatus === "pending" && liveCall.status === "won") {
        toast({
          title: "Live call won",
          description: `${liveCall.selected_team} hit. +${liveCall.projectedImpact} ARENA added.`,
          duration: 8000,
        });

        playNotificationSound("win");
      } else if (
        previousStatus === "pending" &&
        liveCall.status === "lost"
      ) {
        toast({
          title: "Live call missed",
          description: `${liveCall.selected_team} did not convert. -${liveCall.activityCommitment} ARENA.`,
          variant: "destructive",
          duration: 6000,
        });

        playNotificationSound("lose");
      }
    },
    [playNotificationSound, toast],
  );

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    if (USE_STATIC_LIVE_CALLS) {
      setProfile(FALLBACK_PROFILE);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("arena_balance, total_predictions, total_wins")
      .eq("id", user.id)
      .maybeSingle();

    if (!error && data) {
      setProfile({
        ...data,
        total_live_calls: data.total_predictions ?? 0,
      });
    } else if (!data) {
      setProfile(null);
    }
    setLoading(false);
  }, [user]);

  const fetchLiveCalls = useCallback(async () => {
    if (!user) {
      setLiveCalls([]);
      return;
    }

    if (USE_STATIC_LIVE_CALLS) {
      FALLBACK_LIVE_CALLS.forEach((liveCall) => {
        if (!previousLiveCallsRef.current.has(liveCall.id)) {
          previousLiveCallsRef.current.set(liveCall.id, liveCall.status);
        }
      });
      setLiveCalls(FALLBACK_LIVE_CALLS);
      return;
    }

    const { data, error } = await supabase
      .from(LEGACY_LIVE_CALL_TABLE)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const mappedLiveCalls = (data as LegacyLiveCallRow[]).map(mapLegacyLiveCall);

      mappedLiveCalls.forEach((liveCall) => {
        if (!previousLiveCallsRef.current.has(liveCall.id)) {
          previousLiveCallsRef.current.set(liveCall.id, liveCall.status);
        }
      });

      setLiveCalls(mappedLiveCalls);
      return;
    }

    setLiveCalls([]);
  }, [user]);

  useEffect(() => {
    if (user) {
      void fetchProfile();
      void fetchLiveCalls();

      if (USE_STATIC_LIVE_CALLS) {
        return;
      }

      const channel = supabase
        .channel("live-calls-realtime")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: LEGACY_LIVE_CALL_TABLE,
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const updatedLiveCall = mapLegacyLiveCall(
              payload.new as LegacyLiveCallRow,
            );
            const previousStatus = previousLiveCallsRef.current.get(
              updatedLiveCall.id,
            );

            if (previousStatus && previousStatus !== updatedLiveCall.status) {
              showLiveCallNotification(updatedLiveCall, previousStatus);
            }

            previousLiveCallsRef.current.set(
              updatedLiveCall.id,
              updatedLiveCall.status,
            );

            void fetchLiveCalls();
          },
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: LEGACY_LIVE_CALL_TABLE,
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newLiveCall = mapLegacyLiveCall(payload.new as LegacyLiveCallRow);
            previousLiveCallsRef.current.set(
              newLiveCall.id,
              newLiveCall.status,
            );
            void fetchLiveCalls();
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${user.id}`,
          },
          () => {
            void fetchProfile();
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    setLoading(false);
  }, [fetchLiveCalls, fetchProfile, showLiveCallNotification, user]);

  const submitLiveCall = async (
    matchId: string,
    selectedTeam: string,
    activityCommitment: number,
    signalWeight: number,
  ) => {
    if (!user) {
      toast({
        title: "Sign-in required",
        description: "Sign in to submit a live call.",
        variant: "destructive",
      });
      return false;
    }

    if (!profile) {
      toast({
        title: "Profile unavailable",
        description: "We could not load your account profile.",
        variant: "destructive",
      });
      return false;
    }

    if (activityCommitment < 50) {
      toast({
        title: "Minimum activity not met",
        description: "The minimum commitment is 50 ARENA.",
        variant: "destructive",
      });
      return false;
    }

    if (activityCommitment > profile.arena_balance) {
      toast({
        title: "Insufficient balance",
        description: `You currently have ${profile.arena_balance} ARENA available.`,
        variant: "destructive",
      });
      return false;
    }

    setPlacing(true);

    try {
      const projectedImpact = Math.floor(activityCommitment * signalWeight);

      if (USE_STATIC_LIVE_CALLS) {
        const localLiveCall: LiveCallRecord = {
          id: `local-${Date.now()}`,
          match_id: matchId,
          selected_team: selectedTeam,
          activityCommitment,
          projectedImpact,
          signalWeight,
          status: "pending",
          created_at: new Date().toISOString(),
        };

        setLiveCalls((previous) => [localLiveCall, ...previous]);
        setProfile((previous) =>
          previous
            ? {
                ...previous,
                arena_balance: Math.max(
                  0,
                  previous.arena_balance - activityCommitment,
                ),
                total_live_calls: previous.total_live_calls + 1,
                total_predictions: previous.total_predictions + 1,
              }
            : previous,
        );

        toast({
          title: "Live call submitted",
          description: `${activityCommitment} ARENA committed to ${selectedTeam}.`,
        });

        return true;
      }

      const { error: liveCallInsertError } = await supabase
        .from(LEGACY_LIVE_CALL_TABLE)
        .insert({
          user_id: user.id,
          match_id: matchId,
          selected_team: selectedTeam,
          stake_amount: activityCommitment,
          potential_winnings: projectedImpact,
          odds: signalWeight,
          status: "pending",
        });

      if (liveCallInsertError) throw liveCallInsertError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          arena_balance: profile.arena_balance - activityCommitment,
          total_predictions: profile.total_predictions + 1,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      const { error: ledgerError } = await supabase
        .from("arena_ledger")
        .insert({
          user_id: user.id,
          amount: -activityCommitment,
          source: "prediction_loss",
          description: `Live call on ${selectedTeam}`,
          reference_id: matchId,
        });

      if (ledgerError) throw ledgerError;

      toast({
        title: "Live call submitted",
        description: `${activityCommitment} ARENA committed to ${selectedTeam}.`,
      });

      await fetchProfile();
      await fetchLiveCalls();
      return true;
    } catch {
      toast({
        title: "Live call failed",
        description: "We could not submit your live call right now.",
        variant: "destructive",
      });
      return false;
    } finally {
      setPlacing(false);
    }
  };

  return {
    profile,
    liveCalls,
    loading,
    placing,
    submitLiveCall,
    refetch: fetchProfile,
  };
};
