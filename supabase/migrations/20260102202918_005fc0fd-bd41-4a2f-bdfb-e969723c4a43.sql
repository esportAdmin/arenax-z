-- Create table for tracking prize redemptions
CREATE TABLE public.prize_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  prize_id INTEGER NOT NULL REFERENCES public.arena_prizes(id) ON DELETE CASCADE,
  prize_name TEXT NOT NULL,
  price_paid INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  delivery_info JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prize_redemptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own redemptions
CREATE POLICY "Users can view their own redemptions"
ON public.prize_redemptions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own redemptions
CREATE POLICY "Users can create their own redemptions"
ON public.prize_redemptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to redeem a prize
CREATE OR REPLACE FUNCTION public.redeem_prize(p_prize_id INTEGER, p_delivery_info JSONB DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_prize RECORD;
  v_user_balance BIGINT;
  v_redemption_id UUID;
BEGIN
  -- Get prize details
  SELECT * INTO v_prize FROM arena_prizes WHERE id = p_prize_id AND active = true;
  
  IF v_prize IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Prix non trouvé ou indisponible');
  END IF;
  
  -- Check stock
  IF v_prize.stock = 0 THEN
    RETURN json_build_object('success', false, 'error', 'Ce prix est en rupture de stock');
  END IF;
  
  -- Get user balance
  SELECT arena_balance INTO v_user_balance FROM profiles WHERE user_id = v_user_id;
  
  IF v_user_balance IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Profil non trouvé');
  END IF;
  
  -- Check balance
  IF v_user_balance < v_prize.price_arena THEN
    RETURN json_build_object('success', false, 'error', 'Solde insuffisant. Vous avez ' || v_user_balance || ' AP mais ce prix coûte ' || v_prize.price_arena || ' AP');
  END IF;
  
  -- Deduct balance
  UPDATE profiles 
  SET arena_balance = arena_balance - v_prize.price_arena 
  WHERE user_id = v_user_id;
  
  -- Reduce stock if not unlimited (-1)
  IF v_prize.stock > 0 THEN
    UPDATE arena_prizes SET stock = stock - 1 WHERE id = p_prize_id;
  END IF;
  
  -- Create redemption record
  INSERT INTO prize_redemptions (user_id, prize_id, prize_name, price_paid, delivery_info)
  VALUES (v_user_id, p_prize_id, v_prize.name, v_prize.price_arena, p_delivery_info)
  RETURNING id INTO v_redemption_id;
  
  -- Add ledger entry
  INSERT INTO arena_ledger (user_id, amount, source, description, reference_id)
  VALUES (v_user_id, -v_prize.price_arena, 'prize', 'Échange: ' || v_prize.name, v_redemption_id::text);
  
  -- Create notification
  INSERT INTO user_notifications (user_id, type, title, message, value)
  VALUES (v_user_id, 'prize_redeemed', '🎁 Prix échangé !', 'Vous avez échangé ' || v_prize.price_arena || ' AP contre ' || v_prize.name, v_redemption_id::text);
  
  RETURN json_build_object(
    'success', true, 
    'redemption_id', v_redemption_id,
    'prize_name', v_prize.name,
    'price_paid', v_prize.price_arena,
    'new_balance', v_user_balance - v_prize.price_arena
  );
END;
$$;

-- Insert sample prizes
INSERT INTO arena_prizes (sku, name, description, price_arena, usd_value, stock, category, image_url) VALUES
  ('skin-awp-dragon', 'AWP | Dragon Lore (Field-Tested)', 'Le skin légendaire AWP Dragon Lore en condition Field-Tested', 50000, 1500, 2, 'CS2 Skins', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400'),
  ('skin-ak47-fire', 'AK-47 | Fire Serpent (MW)', 'AK-47 Fire Serpent en Minimal Wear, un classique intemporel', 25000, 650, 5, 'CS2 Skins', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400'),
  ('skin-knife-karambit', 'Karambit | Fade (FN)', 'Karambit Fade Factory New avec gradient parfait', 35000, 900, 3, 'CS2 Skins', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400'),
  ('skin-m4a1-howl', 'M4A1-S | Hyper Beast (FN)', 'M4A1-S Hyper Beast Factory New, design unique', 8000, 200, 10, 'CS2 Skins', 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400'),
  ('gc-steam-50', 'Steam Gift Card 50€', 'Carte cadeau Steam d''une valeur de 50€', 5000, 50, -1, 'Gift Cards', 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=400'),
  ('gc-steam-20', 'Steam Gift Card 20€', 'Carte cadeau Steam d''une valeur de 20€', 2000, 20, -1, 'Gift Cards', 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=400'),
  ('gc-amazon-50', 'Amazon Gift Card 50€', 'Carte cadeau Amazon d''une valeur de 50€', 5500, 50, -1, 'Gift Cards', 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400'),
  ('merch-tshirt', 'T-Shirt Arena Esports', 'T-shirt officiel Arena Esports, 100% coton', 1500, 25, 50, 'Merch', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
  ('merch-hoodie', 'Hoodie Arena Esports', 'Hoodie premium Arena Esports, confort ultime', 3000, 55, 30, 'Merch', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'),
  ('merch-mousepad', 'Mousepad XL Arena', 'Mousepad gaming XL avec logo Arena brodé', 800, 15, 100, 'Merch', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400');

-- Create trigger for updated_at
CREATE TRIGGER update_prize_redemptions_updated_at
BEFORE UPDATE ON public.prize_redemptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();