import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Prize {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  price_arena: number;
  usd_value: number | null;
  stock: number | null;
  category: string | null;
  image_url: string | null;
  active: boolean | null;
}

export interface Redemption {
  id: string;
  prize_id: number;
  prize_name: string;
  price_paid: number;
  status: string;
  created_at: string;
}

export function useRewardsStore() {
  const { user } = useAuth();
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchPrizes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('arena_prizes')
        .select('*')
        .eq('active', true)
        .order('price_arena', { ascending: true });

      if (error) throw error;
      setPrizes(data || []);
    } catch (error) {
      console.error('Error fetching prizes:', error);
    }
  }, []);

  const fetchRedemptions = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('prize_redemptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRedemptions(data || []);
    } catch (error) {
      console.error('Error fetching redemptions:', error);
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPrizes(), fetchRedemptions()]);
      setLoading(false);
    };
    loadData();
  }, [fetchPrizes, fetchRedemptions]);

  const redeemPrize = async (prizeId: number, deliveryInfo?: Record<string, unknown>) => {
    if (!user) {
      toast.error('Vous devez être connecté pour échanger un prix');
      return { success: false };
    }

    setRedeeming(true);
    try {
      const { data, error } = await supabase.rpc('redeem_prize', {
        p_prize_id: prizeId,
        p_delivery_info: deliveryInfo ? JSON.parse(JSON.stringify(deliveryInfo)) : null,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; prize_name?: string; price_paid?: number; new_balance?: number };

      if (!result.success) {
        toast.error(result.error || 'Erreur lors de l\'échange');
        return { success: false };
      }

      toast.success(`🎁 ${result.prize_name} échangé avec succès !`);
      
      // Refresh data
      await Promise.all([fetchPrizes(), fetchRedemptions()]);
      
      return { success: true, newBalance: result.new_balance };
    } catch (error) {
      console.error('Error redeeming prize:', error);
      toast.error('Erreur lors de l\'échange');
      return { success: false };
    } finally {
      setRedeeming(false);
    }
  };

  const categories = [...new Set(prizes.map(p => p.category).filter(Boolean))] as string[];

  const filteredPrizes = selectedCategory
    ? prizes.filter(p => p.category === selectedCategory)
    : prizes;

  return {
    prizes: filteredPrizes,
    allPrizes: prizes,
    redemptions,
    loading,
    redeeming,
    categories,
    selectedCategory,
    setSelectedCategory,
    redeemPrize,
    refetch: () => Promise.all([fetchPrizes(), fetchRedemptions()]),
  };
}
