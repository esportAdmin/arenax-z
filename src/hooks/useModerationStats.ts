import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ModerationStats {
  totalMessagesDeleted: number;
  totalPins: number;
  totalUnpins: number;
  totalMutes: number;
  totalUnmutes: number;
  totalPolls: number;
  activePolls: number;
  activeMutes: number;
  recentActions: {
    date: string;
    count: number;
  }[];
  topModerators: {
    moderator_id: string;
    display_name: string;
    avatar_url: string | null;
    action_count: number;
  }[];
}

export const useModerationStats = (clubId: string | null) => {
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!clubId) return;
    setLoading(true);

    try {
      // Fetch moderation logs
      const { data: logs } = await supabase
        .from('club_moderation_logs')
        .select('*')
        .eq('club_id', clubId);

      // Fetch muted members (active)
      const { data: activeMutes } = await supabase
        .from('club_muted_members')
        .select('*')
        .eq('club_id', clubId)
        .gt('expires_at', new Date().toISOString());

      // Fetch polls
      const { data: polls } = await supabase
        .from('club_polls')
        .select('*')
        .eq('club_id', clubId);

      // Calculate stats from logs
      const messagesDeleted = logs?.filter(l => l.action_type === 'delete').length || 0;
      const pins = logs?.filter(l => l.action_type === 'pin').length || 0;
      const unpins = logs?.filter(l => l.action_type === 'unpin').length || 0;
      const mutes = logs?.filter(l => l.action_type === 'mute').length || 0;
      const unmutes = logs?.filter(l => l.action_type === 'unmute').length || 0;

      // Calculate recent actions (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const recentActions = last7Days.map(date => ({
        date,
        count: logs?.filter(l => l.created_at.startsWith(date)).length || 0
      }));

      // Calculate top moderators
      const moderatorCounts: Record<string, number> = {};
      logs?.forEach(log => {
        moderatorCounts[log.moderator_id] = (moderatorCounts[log.moderator_id] || 0) + 1;
      });

      const moderatorIds = Object.keys(moderatorCounts);
      let topModerators: ModerationStats['topModerators'] = [];

      if (moderatorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name, avatar_url')
          .in('user_id', moderatorIds);

        topModerators = moderatorIds
          .map(id => {
            const profile = profiles?.find(p => p.user_id === id);
            return {
              moderator_id: id,
              display_name: profile?.display_name || 'Inconnu',
              avatar_url: profile?.avatar_url || null,
              action_count: moderatorCounts[id]
            };
          })
          .sort((a, b) => b.action_count - a.action_count)
          .slice(0, 5);
      }

      setStats({
        totalMessagesDeleted: messagesDeleted,
        totalPins: pins,
        totalUnpins: unpins,
        totalMutes: mutes,
        totalUnmutes: unmutes,
        totalPolls: polls?.length || 0,
        activePolls: polls?.filter(p => !p.is_closed).length || 0,
        activeMutes: activeMutes?.length || 0,
        recentActions,
        topModerators
      });
    } catch (error) {
      console.error('Error fetching moderation stats:', error);
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refresh: fetchStats };
};
