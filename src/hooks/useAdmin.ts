import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Prize {
  id: number;
  name: string;
  description: string | null;
  price_arena: number;
  stock: number | null;
  category: string | null;
  image_url: string | null;
  active: boolean | null;
  sku: string;
  usd_value: number | null;
}

interface Redemption {
  id: string;
  user_id: string;
  prize_id: number;
  prize_name: string;
  price_paid: number;
  status: string;
  delivery_info: unknown;
  notes: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    display_name: string | null;
    username: string | null;
  };
}

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  arena_balance: number;
  current_level: number;
  current_xp: number;
  total_predictions: number;
  total_wins: number;
  created_at: string;
  roles?: string[];
}

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
}

interface AuditLog {
  id: string;
  admin_id: string;
  action_type: string;
  target_type: string;
  target_id: string | null;
  details: unknown;
  created_at: string;
  admin_profile?: {
    display_name: string | null;
    username: string | null;
  };
}

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [newAuditCount, setNewAuditCount] = useState(0);

  // Check if user is admin
  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data === true);
      }
      setLoading(false);
    }

    checkAdmin();
  }, [user]);

  // Fetch all prizes (including inactive)
  async function fetchPrizes() {
    const { data, error } = await supabase
      .from('arena_prizes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prizes:', error);
    } else {
      setPrizes(data || []);
    }
  }

  // Fetch all redemptions with user info
  async function fetchRedemptions() {
    const { data, error } = await supabase
      .from('prize_redemptions')
      .select(`
        *,
        profile:profiles!prize_redemptions_user_id_fkey(display_name, username)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching redemptions:', error);
    } else {
      setRedemptions(data || []);
    }
  }

  // Fetch all users
  async function fetchUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      // Fetch roles for all users
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('*');

      const rolesMap = new Map<string, string[]>();
      (rolesData || []).forEach((r: UserRole) => {
        const existing = rolesMap.get(r.user_id) || [];
        existing.push(r.role);
        rolesMap.set(r.user_id, existing);
      });

      const usersWithRoles = (data || []).map(u => ({
        ...u,
        roles: rolesMap.get(u.user_id) || []
      }));

      setUsers(usersWithRoles);
      setUserRoles(rolesData || []);
    }
  }

  // Fetch user roles
  async function fetchUserRoles() {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*');

    if (error) {
      console.error('Error fetching user roles:', error);
    } else {
      setUserRoles(data || []);
    }
  }

  // Add role to user
  async function addUserRole(userId: string, role: 'admin' | 'moderator' | 'user') {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role });

    if (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Cet utilisateur a déjà ce rôle');
      }
      throw error;
    }
    await logAuditAction('add_role', 'user', userId, { role });
    await fetchUsers();
  }

  // Remove role from user
  async function removeUserRole(userId: string, role: 'admin' | 'moderator' | 'user') {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) throw error;
    await logAuditAction('remove_role', 'user', userId, { role });
    await fetchUsers();
  }

  // Log audit action
  async function logAuditAction(
    actionType: string, 
    targetType: string, 
    targetId?: string, 
    details?: Record<string, unknown>
  ) {
    if (!user) return;
    
    await supabase
      .from('admin_audit_logs' as any)
      .insert({
        admin_id: user.id,
        action_type: actionType,
        target_type: targetType,
        target_id: targetId || null,
        details: details || null,
      } as any);
  }

  // Fetch audit logs
  async function fetchAuditLogs() {
    const { data, error } = await supabase
      .from('admin_audit_logs' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching audit logs:', error);
    } else {
      // Fetch admin profiles for display
      const adminIds = [...new Set((data || []).map((log: any) => log.admin_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name, username')
        .in('user_id', adminIds);

      const profilesMap = new Map(
        (profiles || []).map(p => [p.user_id, { display_name: p.display_name, username: p.username }])
      );

      const logsWithProfiles = (data || []).map((log: any) => ({
        ...log,
        admin_profile: profilesMap.get(log.admin_id)
      }));

      setAuditLogs(logsWithProfiles as AuditLog[]);
    }
  }

  // Create a new prize
  async function createPrize(prize: Omit<Prize, 'id'>) {
    const { data, error } = await supabase
      .from('arena_prizes')
      .insert(prize)
      .select()
      .single();

    if (error) throw error;
    await logAuditAction('create_prize', 'prize', data.id.toString(), { name: prize.name, price: prize.price_arena });
    await fetchPrizes();
    return data;
  }

  // Update a prize
  async function updatePrize(id: number, updates: Partial<Prize>) {
    const { error } = await supabase
      .from('arena_prizes')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await logAuditAction('update_prize', 'prize', id.toString(), updates);
    await fetchPrizes();
  }

  // Delete a prize
  async function deletePrize(id: number) {
    const { error } = await supabase
      .from('arena_prizes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await logAuditAction('delete_prize', 'prize', id.toString());
    await fetchPrizes();
  }

  // Update redemption status
  async function updateRedemptionStatus(id: string, status: string, notes?: string) {
    const updates: { status: string; notes?: string } = { status };
    if (notes) updates.notes = notes;

    const { error } = await supabase
      .from('prize_redemptions')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await logAuditAction('update_redemption', 'redemption', id, { status, notes });
    await fetchRedemptions();
  }

  // Update user balance
  async function updateUserBalance(userId: string, newBalance: number) {
    const { error } = await supabase
      .from('profiles')
      .update({ arena_balance: newBalance })
      .eq('user_id', userId);

    if (error) throw error;
    await fetchUsers();
  }

  // Give Arena Points to a user (with ledger entry)
  async function giveArenaPoints(userId: string, amount: number, description: string) {
    // Get current balance
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('arena_balance')
      .eq('user_id', userId)
      .single();

    if (!userProfile) throw new Error('Utilisateur non trouvé');

    const newBalance = (userProfile.arena_balance || 0) + amount;

    // Update balance
    const { error: balanceError } = await supabase
      .from('profiles')
      .update({ arena_balance: newBalance })
      .eq('user_id', userId);

    if (balanceError) throw balanceError;

    // Add ledger entry
    const { error: ledgerError } = await supabase
      .from('arena_ledger')
      .insert({
        user_id: userId,
        amount: amount,
        source: 'manual' as const,
        description: description || 'Crédit admin',
      });

    if (ledgerError) throw ledgerError;

    // Create notification for user
    const { error: notifError } = await supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        type: 'arena_points',
        title: amount > 0 ? '🎉 Arena Points reçus !' : '⚠️ Arena Points débités',
        message: amount > 0 
          ? `Vous avez reçu ${amount} Arena Points. ${description || ''}`
          : `${Math.abs(amount)} Arena Points ont été débités. ${description || ''}`,
        value: amount.toString(),
      });

    await logAuditAction('give_arena_points', 'user', userId, { amount, description });
    await fetchUsers();
  }

  // Load data when admin status is confirmed
  useEffect(() => {
    if (isAdmin) {
      fetchPrizes();
      fetchRedemptions();
      fetchUsers();
    }
  }, [isAdmin]);

  // Subscribe to realtime audit log updates
  useEffect(() => {
    if (!isAdmin || !user) return;

    const channel = supabase
      .channel('admin-audit-logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_audit_logs'
        },
        async (payload) => {
          const newLog = payload.new as any;
          
          // Don't notify for own actions
          if (newLog.admin_id === user.id) return;

          // Fetch admin profile for display
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, username')
            .eq('user_id', newLog.admin_id)
            .single();

          const logWithProfile = {
            ...newLog,
            admin_profile: profile
          };

          // Add to state and increment new count
          setAuditLogs(prev => [logWithProfile as AuditLog, ...prev]);
          setNewAuditCount(prev => prev + 1);

          // Show toast notification
          const actionText: Record<string, string> = {
            give_arena_points: 'Attribution d\'Arena Points',
            add_role: 'Ajout de rôle',
            remove_role: 'Retrait de rôle',
            create_prize: 'Création de prix',
            update_prize: 'Modification de prix',
            delete_prize: 'Suppression de prix',
            update_redemption: 'Mise à jour d\'échange',
          };

          toast.info(`🔔 ${profile?.display_name || 'Admin'}: ${actionText[newLog.action_type] || newLog.action_type}`, {
            description: `Sur ${newLog.target_type}`,
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, user]);

  // Clear new audit count (when user views the tab)
  const clearNewAuditCount = () => {
    setNewAuditCount(0);
  };

  return {
    isAdmin,
    loading,
    prizes,
    redemptions,
    users,
    userRoles,
    auditLogs,
    newAuditCount,
    fetchPrizes,
    fetchRedemptions,
    fetchUsers,
    fetchUserRoles,
    fetchAuditLogs,
    clearNewAuditCount,
    createPrize,
    updatePrize,
    deletePrize,
    updateRedemptionStatus,
    updateUserBalance,
    giveArenaPoints,
    addUserRole,
    removeUserRole,
    logAuditAction,
  };
}
