-- =====================================================
-- ESPORT ARENA - COMPLETE DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. ENUMS
-- =====================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TYPE public.arena_source AS ENUM (
  'purchase',
  'contest_refill',
  'refund',
  'prize',
  'manual',
  'prediction_win',
  'prediction_loss',
  'staking_reward'
);

CREATE TYPE public.badge_category AS ENUM (
  'prediction',
  'streak',
  'engagement',
  'achievement',
  'special'
);

CREATE TYPE public.badge_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');

-- =====================================================
-- 2. TABLES
-- =====================================================

-- Profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  username text,
  display_name text,
  avatar_url text,
  current_level integer NOT NULL DEFAULT 1,
  current_xp integer NOT NULL DEFAULT 0,
  arena_balance bigint NOT NULL DEFAULT 0,
  arena_score integer NOT NULL DEFAULT 0,
  total_predictions integer NOT NULL DEFAULT 0,
  total_wins integer NOT NULL DEFAULT 0,
  prediction_accuracy numeric DEFAULT 0,
  active_streak integer NOT NULL DEFAULT 0,
  onboarding_completed boolean NOT NULL DEFAULT false,
  onboarding_completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- User roles table
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id, role)
);

-- Badges table
CREATE TABLE public.badges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category public.badge_category NOT NULL,
  rarity public.badge_rarity NOT NULL DEFAULT 'common',
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL DEFAULT 1,
  arena_points_reward integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- User badges table
CREATE TABLE public.user_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL REFERENCES public.badges(id),
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id, badge_id)
);

-- Daily challenges table
CREATE TABLE public.daily_challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  challenge_type text NOT NULL,
  icon text NOT NULL DEFAULT 'target',
  xp_reward integer NOT NULL DEFAULT 25,
  requirement_value integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- User daily challenges table
CREATE TABLE public.user_daily_challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  challenge_id uuid NOT NULL REFERENCES public.daily_challenges(id),
  challenge_date date NOT NULL DEFAULT CURRENT_DATE,
  progress integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  xp_claimed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id, challenge_id, challenge_date)
);

-- Level rewards table
CREATE TABLE public.level_rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  level_required integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  reward_type text NOT NULL,
  reward_value text NOT NULL,
  icon text NOT NULL DEFAULT 'gift',
  rarity text NOT NULL DEFAULT 'common',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- User level rewards table
CREATE TABLE public.user_level_rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reward_id uuid NOT NULL REFERENCES public.level_rewards(id),
  claimed_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id, reward_id)
);

-- Predictions table
CREATE TABLE public.predictions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  match_id text NOT NULL,
  selected_team text NOT NULL,
  odds numeric NOT NULL,
  stake_amount integer NOT NULL,
  potential_winnings integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  resolved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Arena ledger table
CREATE TABLE public.arena_ledger (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(user_id),
  amount bigint NOT NULL,
  source public.arena_source NOT NULL,
  description text,
  reference_id varchar,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Arena prizes table
CREATE TABLE public.arena_prizes (
  id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  sku varchar NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  image_url text,
  category varchar,
  price_arena integer NOT NULL,
  usd_value numeric,
  stock integer DEFAULT -1,
  active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Prize redemptions table
CREATE TABLE public.prize_redemptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(user_id),
  prize_id integer NOT NULL REFERENCES public.arena_prizes(id),
  prize_name text NOT NULL,
  price_paid integer NOT NULL,
  delivery_info jsonb,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- User notifications table
CREATE TABLE public.user_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  value text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Support inquiries table
CREATE TABLE public.support_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'pending',
  resolved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Admin audit logs table
CREATE TABLE public.admin_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action_type text NOT NULL,
  target_type text NOT NULL,
  target_id text,
  details jsonb,
  ip_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Weekly rankings table
CREATE TABLE public.weekly_rankings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  week_start date NOT NULL,
  week_end date NOT NULL,
  arena_score integer NOT NULL DEFAULT 0,
  predictions_count integer NOT NULL DEFAULT 0,
  accuracy numeric NOT NULL DEFAULT 0,
  final_rank integer,
  rewards_claimed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id, week_start, week_end)
);

-- Weekly rewards table
CREATE TABLE public.weekly_rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rank_from integer NOT NULL,
  rank_to integer NOT NULL,
  arena_points integer NOT NULL,
  badge_id uuid REFERENCES public.badges(id),
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Clubs table
CREATE TABLE public.clubs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  logo_url text,
  banner_url text,
  is_public boolean NOT NULL DEFAULT true,
  member_count integer NOT NULL DEFAULT 1,
  max_members integer NOT NULL DEFAULT 50,
  total_xp bigint NOT NULL DEFAULT 0,
  total_predictions integer NOT NULL DEFAULT 0,
  total_wins integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Club members table
CREATE TABLE public.club_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id),
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  xp_contributed bigint NOT NULL DEFAULT 0,
  predictions_count integer NOT NULL DEFAULT 0,
  wins_count integer NOT NULL DEFAULT 0,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (club_id, user_id)
);

-- Club messages table
CREATE TABLE public.club_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id),
  user_id uuid NOT NULL,
  content text NOT NULL,
  message_type text NOT NULL DEFAULT 'text',
  file_url text,
  file_name text,
  file_type text,
  reply_to_id uuid REFERENCES public.club_messages(id),
  is_pinned boolean NOT NULL DEFAULT false,
  pinned_by uuid,
  pinned_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Club message reactions table
CREATE TABLE public.club_message_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.club_messages(id),
  user_id uuid NOT NULL,
  emoji text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (message_id, user_id, emoji)
);

-- Club join requests table
CREATE TABLE public.club_join_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id),
  user_id uuid NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending',
  responded_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (club_id, user_id)
);

-- Club activities table
CREATE TABLE public.club_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id),
  user_id uuid,
  activity_type text NOT NULL,
  title text NOT NULL,
  description text,
  xp_amount integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Club muted members table
CREATE TABLE public.club_muted_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id),
  user_id uuid NOT NULL,
  muted_by uuid NOT NULL,
  reason text,
  muted_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (club_id, user_id)
);

-- Club banned members table
CREATE TABLE public.club_banned_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id),
  user_id uuid NOT NULL,
  banned_by uuid NOT NULL,
  reason text,
  banned_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (club_id, user_id)
);

-- Club ban appeals table
CREATE TABLE public.club_ban_appeals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id),
  user_id uuid NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_response text,
  responded_by uuid,
  responded_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Club moderation logs table
CREATE TABLE public.club_moderation_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id),
  moderator_id uuid NOT NULL,
  action_type text NOT NULL,
  target_user_id uuid,
  target_message_id uuid,
  message_content text,
  message_author_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Club polls table
CREATE TABLE public.club_polls (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id),
  creator_id uuid NOT NULL,
  message_id uuid REFERENCES public.club_messages(id),
  question text NOT NULL,
  is_multiple_choice boolean NOT NULL DEFAULT false,
  is_anonymous boolean NOT NULL DEFAULT false,
  is_closed boolean NOT NULL DEFAULT false,
  ends_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Club poll options table
CREATE TABLE public.club_poll_options (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES public.club_polls(id),
  option_text text NOT NULL,
  option_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Club poll votes table
CREATE TABLE public.club_poll_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES public.club_polls(id),
  option_id uuid NOT NULL REFERENCES public.club_poll_options(id),
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (poll_id, user_id, option_id)
);

-- Club challenge templates table
CREATE TABLE public.club_challenge_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  challenge_type text NOT NULL,
  target_value integer NOT NULL,
  duration_days integer NOT NULL DEFAULT 7,
  xp_reward integer NOT NULL DEFAULT 100,
  arena_points_reward integer NOT NULL DEFAULT 50,
  icon text NOT NULL DEFAULT 'target',
  difficulty text NOT NULL DEFAULT 'normal',
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Club challenges table
CREATE TABLE public.club_challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id),
  template_id uuid NOT NULL REFERENCES public.club_challenge_templates(id),
  target_value integer NOT NULL,
  current_value integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone NOT NULL,
  completed_at timestamp with time zone,
  rewards_claimed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Club challenge contributions table
CREATE TABLE public.club_challenge_contributions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES public.club_challenges(id),
  user_id uuid NOT NULL,
  contribution_value integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (challenge_id, user_id)
);

-- Club weekly rankings table
CREATE TABLE public.club_weekly_rankings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id),
  week_start date NOT NULL,
  week_end date NOT NULL,
  total_xp bigint NOT NULL DEFAULT 0,
  total_predictions integer NOT NULL DEFAULT 0,
  total_wins integer NOT NULL DEFAULT 0,
  accuracy numeric NOT NULL DEFAULT 0,
  final_rank integer,
  rewards_claimed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (club_id, week_start, week_end)
);

-- Club rewards table
CREATE TABLE public.club_rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rank_from integer NOT NULL,
  rank_to integer NOT NULL,
  xp_bonus integer NOT NULL DEFAULT 0,
  arena_points integer NOT NULL DEFAULT 0,
  badge_name text,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Club wars table
CREATE TABLE public.club_wars (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  challenger_id uuid NOT NULL REFERENCES public.clubs(id),
  defender_id uuid NOT NULL REFERENCES public.clubs(id),
  winner_id uuid REFERENCES public.clubs(id),
  status text NOT NULL DEFAULT 'pending',
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  challenger_xp integer NOT NULL DEFAULT 0,
  defender_xp integer NOT NULL DEFAULT 0,
  challenger_predictions integer NOT NULL DEFAULT 0,
  defender_predictions integer NOT NULL DEFAULT 0,
  challenger_wins integer NOT NULL DEFAULT 0,
  defender_wins integer NOT NULL DEFAULT 0,
  xp_reward integer NOT NULL DEFAULT 200,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- =====================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_level_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prize_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_muted_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_banned_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_ban_appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_challenge_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_challenge_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_weekly_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_wars ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. HELPER FUNCTIONS
-- =====================================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Calculate XP needed for a level
CREATE OR REPLACE FUNCTION public.xp_for_level(level_num integer)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT FLOOR(100 * POWER(1.5, level_num - 1))::integer;
$$;

-- Check if user is muted in a club
CREATE OR REPLACE FUNCTION public.is_user_muted(p_club_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM club_muted_members
    WHERE club_id = p_club_id
    AND user_id = p_user_id
    AND expires_at > now()
  )
$$;

-- Check if user is banned from a club
CREATE OR REPLACE FUNCTION public.is_user_banned(p_club_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM club_banned_members
    WHERE club_id = p_club_id
    AND user_id = p_user_id
  )
$$;

-- =====================================================
-- 5. RLS POLICIES
-- =====================================================

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Badges policies
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);

-- User badges policies
CREATE POLICY "Anyone can view user badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily challenges policies
CREATE POLICY "Anyone can view active challenges" ON public.daily_challenges FOR SELECT USING (active = true);

-- User daily challenges policies
CREATE POLICY "Users can view their own challenge progress" ON public.user_daily_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own challenge progress" ON public.user_daily_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own challenge progress" ON public.user_daily_challenges FOR UPDATE USING (auth.uid() = user_id);

-- Level rewards policies
CREATE POLICY "Anyone can view level rewards" ON public.level_rewards FOR SELECT USING (true);

-- User level rewards policies
CREATE POLICY "Users can view their claimed rewards" ON public.user_level_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can claim rewards" ON public.user_level_rewards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Predictions policies
CREATE POLICY "Users can view their own predictions" ON public.predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own predictions" ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pending predictions" ON public.predictions FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Arena ledger policies
CREATE POLICY "Users can view their own ledger" ON public.arena_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert ledger entries" ON public.arena_ledger FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Arena prizes policies
CREATE POLICY "Anyone can view active prizes" ON public.arena_prizes FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage prizes" ON public.arena_prizes FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Prize redemptions policies
CREATE POLICY "Users can view their own redemptions" ON public.prize_redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all redemptions" ON public.prize_redemptions FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create their own redemptions" ON public.prize_redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update redemptions" ON public.prize_redemptions FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- User notifications policies
CREATE POLICY "Users can view their own notifications" ON public.user_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.user_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.user_notifications FOR INSERT WITH CHECK (true);

-- Support inquiries policies
CREATE POLICY "Anyone can create inquiries" ON public.support_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own inquiries" ON public.support_inquiries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all inquiries" ON public.support_inquiries FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update inquiries" ON public.support_inquiries FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- Admin audit logs policies
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert audit logs" ON public.admin_audit_logs FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

-- Weekly rankings policies
CREATE POLICY "Anyone can view rankings" ON public.weekly_rankings FOR SELECT USING (true);

-- Weekly rewards policies
CREATE POLICY "Anyone can view weekly rewards" ON public.weekly_rewards FOR SELECT USING (active = true);

-- Clubs policies
CREATE POLICY "Anyone can view public clubs" ON public.clubs FOR SELECT USING (is_public = true);
CREATE POLICY "Members can view their private clubs" ON public.clubs FOR SELECT USING (is_public = false AND EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = clubs.id AND club_members.user_id = auth.uid()));
CREATE POLICY "Users can create clubs" ON public.clubs FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners and admins can update clubs" ON public.clubs FOR UPDATE USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = clubs.id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));
CREATE POLICY "Only owners can delete clubs" ON public.clubs FOR DELETE USING (auth.uid() = owner_id);

-- Club members policies
CREATE POLICY "Anyone can view club members" ON public.club_members FOR SELECT USING (true);
CREATE POLICY "Users can join public clubs" ON public.club_members FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM clubs WHERE clubs.id = club_members.club_id AND clubs.is_public = true));
CREATE POLICY "Admins can add members" ON public.club_members FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM club_members cm WHERE cm.club_id = club_members.club_id AND cm.user_id = auth.uid() AND cm.role IN ('owner', 'admin')));
CREATE POLICY "Members can leave clubs" ON public.club_members FOR DELETE USING (auth.uid() = user_id AND role != 'owner');
CREATE POLICY "Admins can remove members" ON public.club_members FOR DELETE USING (EXISTS (SELECT 1 FROM club_members cm WHERE cm.club_id = club_members.club_id AND cm.user_id = auth.uid() AND cm.role IN ('owner', 'admin')) AND role != 'owner');
CREATE POLICY "Admins can update member roles" ON public.club_members FOR UPDATE USING (EXISTS (SELECT 1 FROM club_members cm WHERE cm.club_id = club_members.club_id AND cm.user_id = auth.uid() AND cm.role IN ('owner', 'admin')));

-- Club messages policies
CREATE POLICY "Club members can view messages" ON public.club_messages FOR SELECT USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_messages.club_id AND club_members.user_id = auth.uid()));
CREATE POLICY "Club members can send messages" ON public.club_messages FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_messages.club_id AND club_members.user_id = auth.uid()));
CREATE POLICY "Users can delete their own messages" ON public.club_messages FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Club admins can delete messages" ON public.club_messages FOR DELETE USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_messages.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin', 'moderator')));
CREATE POLICY "Club admins can pin messages" ON public.club_messages FOR UPDATE USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_messages.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));

-- Club message reactions policies
CREATE POLICY "Club members can view reactions" ON public.club_message_reactions FOR SELECT USING (EXISTS (SELECT 1 FROM club_messages cm JOIN club_members cmem ON cmem.club_id = cm.club_id WHERE cm.id = club_message_reactions.message_id AND cmem.user_id = auth.uid()));
CREATE POLICY "Club members can add reactions" ON public.club_message_reactions FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM club_messages cm JOIN club_members cmem ON cmem.club_id = cm.club_id WHERE cm.id = club_message_reactions.message_id AND cmem.user_id = auth.uid()));
CREATE POLICY "Users can remove their own reactions" ON public.club_message_reactions FOR DELETE USING (auth.uid() = user_id);

-- Club join requests policies
CREATE POLICY "Users can create join requests" ON public.club_join_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own requests" ON public.club_join_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Club admins can view requests" ON public.club_join_requests FOR SELECT USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_join_requests.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));
CREATE POLICY "Admins can update join requests" ON public.club_join_requests FOR UPDATE USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_join_requests.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));

-- Club activities policies
CREATE POLICY "Club members can view activities" ON public.club_activities FOR SELECT USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_activities.club_id AND club_members.user_id = auth.uid()));
CREATE POLICY "System can insert activities" ON public.club_activities FOR INSERT WITH CHECK (true);

-- Club muted members policies
CREATE POLICY "Club members can view mutes" ON public.club_muted_members FOR SELECT USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_muted_members.club_id AND club_members.user_id = auth.uid()));
CREATE POLICY "Club admins can mute members" ON public.club_muted_members FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_muted_members.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin', 'moderator')));
CREATE POLICY "Club admins can update mutes" ON public.club_muted_members FOR UPDATE USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_muted_members.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin', 'moderator')));
CREATE POLICY "Club admins can unmute members" ON public.club_muted_members FOR DELETE USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_muted_members.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin', 'moderator')));

-- Club banned members policies
CREATE POLICY "Club admins can view bans" ON public.club_banned_members FOR SELECT USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_banned_members.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));
CREATE POLICY "Club admins can ban members" ON public.club_banned_members FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_banned_members.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));
CREATE POLICY "Club admins can unban members" ON public.club_banned_members FOR DELETE USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_banned_members.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));

-- Club ban appeals policies
CREATE POLICY "Banned users can create appeals" ON public.club_ban_appeals FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM club_banned_members WHERE club_banned_members.club_id = club_ban_appeals.club_id AND club_banned_members.user_id = auth.uid()) AND NOT EXISTS (SELECT 1 FROM club_ban_appeals existing WHERE existing.club_id = club_ban_appeals.club_id AND existing.user_id = auth.uid() AND existing.status = 'pending'));
CREATE POLICY "Users can view their own appeals" ON public.club_ban_appeals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Club admins can view appeals" ON public.club_ban_appeals FOR SELECT USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_ban_appeals.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));
CREATE POLICY "Club admins can update appeals" ON public.club_ban_appeals FOR UPDATE USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_ban_appeals.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));

-- Club moderation logs policies
CREATE POLICY "Club admins can view moderation logs" ON public.club_moderation_logs FOR SELECT USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_moderation_logs.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));
CREATE POLICY "System can insert moderation logs" ON public.club_moderation_logs FOR INSERT WITH CHECK (true);

-- Club polls policies
CREATE POLICY "Club members can view polls" ON public.club_polls FOR SELECT USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_polls.club_id AND club_members.user_id = auth.uid()));
CREATE POLICY "Club members can create polls" ON public.club_polls FOR INSERT WITH CHECK (auth.uid() = creator_id AND EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_polls.club_id AND club_members.user_id = auth.uid()));
CREATE POLICY "Poll creators and admins can update polls" ON public.club_polls FOR UPDATE USING (auth.uid() = creator_id OR EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_polls.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));

-- Club poll options policies
CREATE POLICY "Club members can view poll options" ON public.club_poll_options FOR SELECT USING (EXISTS (SELECT 1 FROM club_polls p JOIN club_members cm ON cm.club_id = p.club_id WHERE p.id = club_poll_options.poll_id AND cm.user_id = auth.uid()));
CREATE POLICY "Poll creators can add options" ON public.club_poll_options FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM club_polls p WHERE p.id = club_poll_options.poll_id AND p.creator_id = auth.uid()));

-- Club poll votes policies
CREATE POLICY "Club members can view votes" ON public.club_poll_votes FOR SELECT USING (EXISTS (SELECT 1 FROM club_polls p JOIN club_members cm ON cm.club_id = p.club_id WHERE p.id = club_poll_votes.poll_id AND cm.user_id = auth.uid()));
CREATE POLICY "Club members can vote" ON public.club_poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM club_polls p JOIN club_members cm ON cm.club_id = p.club_id WHERE p.id = club_poll_votes.poll_id AND cm.user_id = auth.uid() AND p.is_closed = false));
CREATE POLICY "Users can remove their votes" ON public.club_poll_votes FOR DELETE USING (auth.uid() = user_id);

-- Club challenge templates policies
CREATE POLICY "Anyone can view active templates" ON public.club_challenge_templates FOR SELECT USING (active = true);

-- Club challenges policies
CREATE POLICY "Club members can view their challenges" ON public.club_challenges FOR SELECT USING (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_challenges.club_id AND club_members.user_id = auth.uid()));
CREATE POLICY "Club admins can create challenges" ON public.club_challenges FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_challenges.club_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));
CREATE POLICY "System can update challenges" ON public.club_challenges FOR UPDATE USING (true);

-- Club challenge contributions policies
CREATE POLICY "Members can view contributions" ON public.club_challenge_contributions FOR SELECT USING (EXISTS (SELECT 1 FROM club_challenges cc JOIN club_members cm ON cm.club_id = cc.club_id WHERE cc.id = club_challenge_contributions.challenge_id AND cm.user_id = auth.uid()));
CREATE POLICY "System can manage contributions" ON public.club_challenge_contributions FOR ALL USING (true);

-- Club weekly rankings policies
CREATE POLICY "Anyone can view club rankings" ON public.club_weekly_rankings FOR SELECT USING (true);
CREATE POLICY "System can insert rankings" ON public.club_weekly_rankings FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update rankings" ON public.club_weekly_rankings FOR UPDATE USING (true);

-- Club rewards policies
CREATE POLICY "Anyone can view club rewards" ON public.club_rewards FOR SELECT USING (active = true);

-- Club wars policies
CREATE POLICY "Anyone can view club wars" ON public.club_wars FOR SELECT USING (true);
CREATE POLICY "Club admins can create wars" ON public.club_wars FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM club_members WHERE club_members.club_id = club_wars.challenger_id AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));
CREATE POLICY "Involved club admins can update wars" ON public.club_wars FOR UPDATE USING (EXISTS (SELECT 1 FROM club_members WHERE (club_members.club_id = club_wars.challenger_id OR club_members.club_id = club_wars.defender_id) AND club_members.user_id = auth.uid() AND club_members.role IN ('owner', 'admin')));

-- =====================================================
-- 6. AUTO-CREATE PROFILE ON USER SIGNUP
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN new;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 7. ADD XP FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.add_xp(p_user_id uuid, p_xp_amount integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_current_xp integer;
  v_current_level integer;
  v_xp_needed integer;
  v_new_xp integer;
  v_new_level integer;
  v_leveled_up boolean := false;
BEGIN
  SELECT current_xp, current_level INTO v_current_xp, v_current_level
  FROM profiles WHERE user_id = p_user_id;
  
  v_new_xp := v_current_xp + p_xp_amount;
  v_new_level := v_current_level;
  
  LOOP
    v_xp_needed := xp_for_level(v_new_level);
    EXIT WHEN v_new_xp < v_xp_needed;
    v_new_xp := v_new_xp - v_xp_needed;
    v_new_level := v_new_level + 1;
    v_leveled_up := true;
  END LOOP;
  
  UPDATE profiles 
  SET current_xp = v_new_xp, current_level = v_new_level
  WHERE user_id = p_user_id;
  
  RETURN json_build_object(
    'new_xp', v_new_xp,
    'new_level', v_new_level,
    'leveled_up', v_leveled_up,
    'xp_for_next_level', xp_for_level(v_new_level)
  );
END;
$$;

-- =====================================================
-- 8. SEED DATA
-- =====================================================

-- Badges (with fixed IDs for referencing in user_badges)
INSERT INTO public.badges (id, name, description, icon, category, rarity, requirement_type, requirement_value, arena_points_reward) VALUES
-- Prediction badges
('b0000001-0001-0001-0001-000000000001', 'Première Prédiction', 'Faire sa première prédiction', 'target', 'prediction', 'common', 'predictions_count', 1, 10),
('b0000001-0001-0001-0001-000000000002', 'Prédicteur Novice', 'Faire 10 prédictions', 'target', 'prediction', 'common', 'predictions_count', 10, 25),
('b0000001-0001-0001-0001-000000000003', 'Prédicteur Confirmé', 'Faire 50 prédictions', 'target', 'prediction', 'rare', 'predictions_count', 50, 50),
('b0000001-0001-0001-0001-000000000004', 'Prédicteur Expert', 'Faire 100 prédictions', 'award', 'prediction', 'epic', 'predictions_count', 100, 100),
('b0000001-0001-0001-0001-000000000005', 'Prédicteur Légendaire', 'Faire 500 prédictions', 'crown', 'prediction', 'legendary', 'predictions_count', 500, 250),
-- Win badges
('b0000002-0002-0002-0002-000000000001', 'Premier Succès', 'Gagner sa première prédiction', 'trophy', 'achievement', 'common', 'wins_count', 1, 15),
('b0000002-0002-0002-0002-000000000002', 'Gagnant en Série', 'Gagner 10 prédictions', 'trophy', 'achievement', 'common', 'wins_count', 10, 30),
('b0000002-0002-0002-0002-000000000003', 'Pro des Pronostics', 'Gagner 50 prédictions', 'trophy', 'achievement', 'rare', 'wins_count', 50, 75),
('b0000002-0002-0002-0002-000000000004', 'Maître des Victoires', 'Gagner 100 prédictions', 'medal', 'achievement', 'epic', 'wins_count', 100, 150),
('b0000002-0002-0002-0002-000000000005', 'Invincible', 'Gagner 250 prédictions', 'star', 'achievement', 'legendary', 'wins_count', 250, 500),
-- Streak badges
('b0000003-0003-0003-0003-000000000001', 'Série de 3', 'Maintenir une série de 3 jours', 'flame', 'streak', 'common', 'streak', 3, 20),
('b0000003-0003-0003-0003-000000000002', 'Série de 7', 'Maintenir une série de 7 jours', 'flame', 'streak', 'rare', 'streak', 7, 50),
('b0000003-0003-0003-0003-000000000003', 'Série de 14', 'Maintenir une série de 14 jours', 'flame', 'streak', 'epic', 'streak', 14, 100),
('b0000003-0003-0003-0003-000000000004', 'Série de 30', 'Maintenir une série de 30 jours', 'zap', 'streak', 'legendary', 'streak', 30, 300),
-- Accuracy badges
('b0000004-0004-0004-0004-000000000001', 'Précision 60%', 'Atteindre 60% de précision (min 20 prédictions)', 'percent', 'achievement', 'common', 'accuracy', 60, 25),
('b0000004-0004-0004-0004-000000000002', 'Précision 70%', 'Atteindre 70% de précision (min 50 prédictions)', 'percent', 'achievement', 'rare', 'accuracy', 70, 75),
('b0000004-0004-0004-0004-000000000003', 'Précision 80%', 'Atteindre 80% de précision (min 100 prédictions)', 'percent', 'achievement', 'epic', 'accuracy', 80, 200),
('b0000004-0004-0004-0004-000000000004', 'Précision 90%', 'Atteindre 90% de précision (min 200 prédictions)', 'percent', 'achievement', 'legendary', 'accuracy', 90, 500),
-- Engagement badges
('b0000005-0005-0005-0005-000000000001', 'Profil Complété', 'Compléter son profil', 'user', 'engagement', 'common', 'profile_complete', 1, 15),
('b0000005-0005-0005-0005-000000000002', 'Membre d''un Club', 'Rejoindre un club', 'users', 'engagement', 'common', 'club_member', 1, 20),
('b0000005-0005-0005-0005-000000000003', 'Créateur de Club', 'Créer un club', 'shield', 'engagement', 'rare', 'club_created', 1, 50),
('b0000005-0005-0005-0005-000000000004', 'Social Butterfly', 'Envoyer 100 messages dans les clubs', 'message-circle', 'engagement', 'rare', 'messages_sent', 100, 40),
-- Level badges
('b0000006-0006-0006-0006-000000000001', 'Niveau 5', 'Atteindre le niveau 5', 'star', 'achievement', 'common', 'level', 5, 25),
('b0000006-0006-0006-0006-000000000002', 'Niveau 10', 'Atteindre le niveau 10', 'star', 'achievement', 'rare', 'level', 10, 50),
('b0000006-0006-0006-0006-000000000003', 'Niveau 25', 'Atteindre le niveau 25', 'crown', 'achievement', 'epic', 'level', 25, 150),
('b0000006-0006-0006-0006-000000000004', 'Niveau 50', 'Atteindre le niveau 50', 'crown', 'achievement', 'legendary', 'level', 50, 500),
-- Special badges
('b0000007-0007-0007-0007-000000000001', 'Early Adopter', 'Faire partie des premiers utilisateurs', 'sparkles', 'special', 'epic', 'special', 1, 100),
('b0000007-0007-0007-0007-000000000002', 'Bêta Testeur', 'Avoir participé à la bêta', 'flask', 'special', 'legendary', 'special', 1, 200),
('b0000007-0007-0007-0007-000000000003', 'Top 10 Hebdo', 'Finir dans le top 10 hebdomadaire', 'medal', 'special', 'epic', 'weekly_top', 10, 150),
('b0000007-0007-0007-0007-000000000004', 'Top 3 Hebdo', 'Finir sur le podium hebdomadaire', 'trophy', 'special', 'legendary', 'weekly_top', 3, 300);

-- Daily challenges
INSERT INTO public.daily_challenges (title, description, challenge_type, icon, xp_reward, requirement_value, active) VALUES
('Première Prédiction', 'Faire au moins 1 prédiction aujourd''hui', 'predictions', 'target', 25, 1, true),
('Prédicteur Actif', 'Faire 3 prédictions aujourd''hui', 'predictions', 'target', 50, 3, true),
('Machine à Prédictions', 'Faire 5 prédictions aujourd''hui', 'predictions', 'zap', 100, 5, true),
('Gagnant du Jour', 'Gagner au moins 1 prédiction', 'wins', 'trophy', 35, 1, true),
('En Forme', 'Gagner 3 prédictions', 'wins', 'trophy', 75, 3, true),
('Invincible', 'Gagner 5 prédictions', 'wins', 'flame', 150, 5, true),
('Explorateur', 'Visiter la page des prédictions', 'visit_predictions', 'compass', 10, 1, true),
('Curieux', 'Consulter le classement', 'visit_leaderboard', 'bar-chart-2', 10, 1, true),
('Social', 'Envoyer un message dans un club', 'club_message', 'message-circle', 20, 1, true),
('Communicant', 'Envoyer 5 messages dans un club', 'club_message', 'message-circle', 50, 5, true);

-- Level rewards
INSERT INTO public.level_rewards (level_required, title, description, reward_type, reward_value, icon, rarity) VALUES
(2, 'Bonus de Bienvenue', 'Félicitations pour le niveau 2 !', 'arena_points', '50', 'gift', 'common'),
(3, 'Pack Débutant', 'Un petit boost pour bien commencer', 'arena_points', '75', 'package', 'common'),
(5, 'Récompense Niveau 5', 'Vous progressez bien !', 'arena_points', '100', 'star', 'common'),
(7, 'Bonus XP', 'Un boost d''XP pour accélérer', 'xp_bonus', '150', 'zap', 'rare'),
(10, 'Pack Niveau 10', 'Première grande étape atteinte !', 'arena_points', '200', 'award', 'rare'),
(15, 'Récompense Premium', 'Vous êtes sur la bonne voie', 'arena_points', '300', 'crown', 'rare'),
(20, 'Pack Niveau 20', 'Un joueur expérimenté', 'arena_points', '500', 'trophy', 'epic'),
(25, 'Récompense Expert', 'Niveau expert atteint !', 'arena_points', '750', 'medal', 'epic'),
(30, 'Pack Vétéran', 'Un vrai vétéran de la plateforme', 'arena_points', '1000', 'shield', 'epic'),
(40, 'Récompense Élite', 'Vous faites partie de l''élite', 'arena_points', '1500', 'star', 'legendary'),
(50, 'Pack Légendaire', 'Niveau légendaire atteint !', 'arena_points', '2500', 'crown', 'legendary');

-- Weekly rewards
INSERT INTO public.weekly_rewards (rank_from, rank_to, arena_points, description, active) VALUES
(1, 1, 1000, 'Champion de la semaine - 1ère place', true),
(2, 2, 750, 'Vice-champion - 2ème place', true),
(3, 3, 500, 'Podium - 3ème place', true),
(4, 5, 300, 'Top 5 de la semaine', true),
(6, 10, 200, 'Top 10 de la semaine', true),
(11, 20, 100, 'Top 20 de la semaine', true),
(21, 50, 50, 'Top 50 de la semaine', true),
(51, 100, 25, 'Top 100 de la semaine', true);

-- Club rewards
INSERT INTO public.club_rewards (rank_from, rank_to, xp_bonus, arena_points, description, active) VALUES
(1, 1, 1000, 500, 'Champion des clubs - 1ère place', true),
(2, 2, 750, 350, 'Vice-champion des clubs - 2ème place', true),
(3, 3, 500, 250, 'Podium des clubs - 3ème place', true),
(4, 5, 300, 150, 'Top 5 des clubs', true),
(6, 10, 200, 100, 'Top 10 des clubs', true),
(11, 20, 100, 50, 'Top 20 des clubs', true);

-- Club challenge templates
INSERT INTO public.club_challenge_templates (title, description, challenge_type, target_value, duration_days, xp_reward, arena_points_reward, icon, difficulty, active) VALUES
('Prédictions Collectives', 'Faire 50 prédictions en équipe', 'predictions', 50, 7, 200, 100, 'target', 'easy', true),
('Avalanche de Prédictions', 'Faire 100 prédictions en équipe', 'predictions', 100, 7, 400, 200, 'target', 'normal', true),
('Marathon de Prédictions', 'Faire 250 prédictions en équipe', 'predictions', 250, 7, 750, 400, 'zap', 'hard', true),
('Victoires d''Équipe', 'Gagner 25 prédictions ensemble', 'wins', 25, 7, 300, 150, 'trophy', 'normal', true),
('Maîtres des Victoires', 'Gagner 50 prédictions ensemble', 'wins', 50, 7, 600, 300, 'trophy', 'hard', true),
('Chat Actif', 'Envoyer 100 messages dans le chat', 'messages', 100, 7, 150, 75, 'message-circle', 'easy', true),
('Communication Intense', 'Envoyer 500 messages dans le chat', 'messages', 500, 7, 350, 175, 'message-circle', 'normal', true),
('XP Rush', 'Gagner 5000 XP collectivement', 'xp', 5000, 7, 500, 250, 'star', 'normal', true),
('XP Master', 'Gagner 15000 XP collectivement', 'xp', 15000, 7, 1000, 500, 'crown', 'hard', true),
('Recrutement', 'Recruter 5 nouveaux membres', 'members', 5, 14, 400, 200, 'users', 'normal', true);

-- Arena prizes
INSERT INTO public.arena_prizes (sku, name, description, category, price_arena, usd_value, stock, active) VALUES
('SKIN_PROFILE_GOLD', 'Skin Profil Doré', 'Un cadre doré exclusif pour votre profil', 'cosmetic', 500, 5.00, -1, true),
('SKIN_PROFILE_DIAMOND', 'Skin Profil Diamant', 'Un cadre diamant ultra rare pour votre profil', 'cosmetic', 1500, 15.00, -1, true),
('XP_BOOST_2X_24H', 'Boost XP 2x (24h)', 'Doublez vos gains d''XP pendant 24 heures', 'boost', 300, 3.00, -1, true),
('XP_BOOST_3X_24H', 'Boost XP 3x (24h)', 'Triplez vos gains d''XP pendant 24 heures', 'boost', 750, 7.50, -1, true),
('ARENA_REFILL_100', 'Recharge 100 AP', 'Obtenez 100 Arena Points bonus', 'currency', 800, 8.00, -1, true),
('ARENA_REFILL_500', 'Recharge 500 AP', 'Obtenez 500 Arena Points bonus', 'currency', 3500, 35.00, -1, true),
('BADGE_EXCLUSIVE_VIP', 'Badge VIP Exclusif', 'Un badge VIP à afficher sur votre profil', 'badge', 2000, 20.00, 100, true),
('GIFT_CARD_5', 'Carte Cadeau 5€', 'Une carte cadeau de 5€ à échanger', 'gift', 1000, 5.00, 50, true),
('GIFT_CARD_10', 'Carte Cadeau 10€', 'Une carte cadeau de 10€ à échanger', 'gift', 1800, 10.00, 30, true),
('GIFT_CARD_25', 'Carte Cadeau 25€', 'Une carte cadeau de 25€ à échanger', 'gift', 4000, 25.00, 20, true),
('MERCH_TSHIRT', 'T-Shirt Esport Arena', 'T-shirt officiel Esport Arena', 'merchandise', 2500, 25.00, 50, true),
('MERCH_CAP', 'Casquette Esport Arena', 'Casquette officielle Esport Arena', 'merchandise', 1500, 15.00, 30, true);

-- =====================================================
-- DEMO DATA (Clubs & Members)
-- NOTE: These use fixed UUIDs. Replace with real user_ids after signup.
-- =====================================================

-- Demo profiles (will be linked to real auth.users after signup)
-- You can update the user_id to match real authenticated users
INSERT INTO public.profiles (user_id, username, display_name, current_level, current_xp, arena_balance, arena_score, total_predictions, total_wins, prediction_accuracy, active_streak) VALUES
('11111111-1111-1111-1111-111111111111', 'shadow_hunter', 'ShadowHunter', 15, 450, 2500, 1850, 125, 78, 62.4, 7),
('22222222-2222-2222-2222-222222222222', 'neon_blade', 'NeonBlade', 22, 890, 4200, 3200, 245, 162, 66.1, 12),
('33333333-3333-3333-3333-333333333333', 'cyber_wolf', 'CyberWolf', 8, 220, 800, 650, 45, 25, 55.5, 3),
('44444444-4444-4444-4444-444444444444', 'storm_rider', 'StormRider', 18, 670, 3100, 2400, 180, 115, 63.8, 9),
('55555555-5555-5555-5555-555555555555', 'frost_queen', 'FrostQueen', 25, 1200, 5500, 4100, 320, 224, 70.0, 15),
('66666666-6666-6666-6666-666666666666', 'blaze_master', 'BlazeMaster', 12, 380, 1800, 1200, 95, 55, 57.8, 5),
('77777777-7777-7777-7777-777777777777', 'dark_phoenix', 'DarkPhoenix', 30, 1500, 7500, 5800, 450, 315, 70.0, 21),
('88888888-8888-8888-8888-888888888888', 'iron_titan', 'IronTitan', 10, 280, 1200, 900, 68, 38, 55.8, 4),
('99999999-9999-9999-9999-999999999999', 'mystic_sage', 'MysticSage', 20, 800, 3800, 2900, 210, 140, 66.6, 11),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'thunder_lord', 'ThunderLord', 28, 1350, 6200, 4800, 380, 266, 70.0, 18);

-- Demo clubs
INSERT INTO public.clubs (id, owner_id, name, slug, description, is_public, member_count, total_xp, total_predictions, total_wins) VALUES
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Shadow Legion', 'shadow-legion', 'Élite des prédicteurs esport. Rejoignez les ombres et dominez le classement.', true, 5, 15200, 620, 402),
('c2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Frost Warriors', 'frost-warriors', 'La puissance du froid. Précision glaciale dans chaque prédiction.', true, 4, 12800, 510, 340),
('c3333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'Phoenix Rising', 'phoenix-rising', 'Comme le phénix, nous renaissons de chaque défaite. Top 3 garanti.', true, 6, 22500, 890, 623),
('c4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Neon Knights', 'neon-knights', 'Club compétitif pour joueurs sérieux. Ambiance fun garantie.', true, 3, 8500, 380, 235),
('c5555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Thunder Strike', 'thunder-strike', 'Frappez comme l''éclair ! Club actif avec défis quotidiens.', false, 4, 18000, 720, 490);

-- Club members
INSERT INTO public.club_members (club_id, user_id, role, xp_contributed, predictions_count, wins_count) VALUES
-- Shadow Legion members
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'owner', 4500, 125, 78),
('c1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'admin', 1800, 45, 25),
('c1111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'moderator', 3200, 95, 55),
('c1111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888888', 'member', 2400, 68, 38),
('c1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'member', 3300, 180, 115),
-- Frost Warriors members
('c2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'owner', 5800, 320, 224),
('c2222222-2222-2222-2222-222222222222', '99999999-9999-9999-9999-999999999999', 'admin', 4100, 210, 140),
('c2222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888888', 'member', 1200, 68, 38),
('c2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'member', 1700, 45, 25),
-- Phoenix Rising members
('c3333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'owner', 8500, 450, 315),
('c3333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin', 6200, 380, 266),
('c3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'moderator', 4800, 245, 162),
('c3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'member', 3000, 180, 115),
('c3333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 'member', 2200, 95, 55),
('c3333333-3333-3333-3333-333333333333', '99999999-9999-9999-9999-999999999999', 'member', 3800, 210, 140),
-- Neon Knights members
('c4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'owner', 4500, 245, 162),
('c4444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666', 'admin', 2200, 95, 55),
('c4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'member', 1800, 45, 25),
-- Thunder Strike members
('c5555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'owner', 7000, 380, 266),
('c5555555-5555-5555-5555-555555555555', '77777777-7777-7777-7777-777777777777', 'admin', 6500, 450, 315),
('c5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'moderator', 4800, 320, 224),
('c5555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'member', 3500, 180, 115);

-- Club activities (recent activities for demo)
INSERT INTO public.club_activities (club_id, user_id, activity_type, title, description, xp_amount) VALUES
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'challenge_completed', 'Défi complété', 'Prédictions Collectives terminé', 200),
('c1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'member_joined', 'Nouveau membre', 'A rejoint le club', 0),
('c2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'war_won', 'Guerre gagnée', 'Victoire contre un club rival', 500),
('c3333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'reward_claimed', 'Récompense hebdomadaire', 'Top 3 de la semaine', 750),
('c3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'prediction_milestone', 'Jalon atteint', '200 prédictions du club', 100),
('c4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'challenge_started', 'Défi lancé', 'Avalanche de Prédictions', 0),
('c5555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'member_promoted', 'Promotion', 'Un membre promu admin', 0);

-- Demo club messages
INSERT INTO public.club_messages (club_id, user_id, content, message_type) VALUES
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Bienvenue dans Shadow Legion ! 🎮', 'text'),
('c1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Merci ! Content d''être ici', 'text'),
('c1111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'GG pour les prédictions d''hier !', 'text'),
('c2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Nouveau défi cette semaine les gars 🔥', 'text'),
('c2222222-2222-2222-2222-222222222222', '99999999-9999-9999-9999-999999999999', 'Let''s go ! On vise le top 3', 'text'),
('c3333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'Félicitations à tous pour le classement !', 'text'),
('c3333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'On continue sur cette lancée 💪', 'text'),
('c3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Quelqu''un regarde le match ce soir ?', 'text'),
('c4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Welcome to Neon Knights! ⚔️', 'text'),
('c5555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Thunder Strike rules! ⚡', 'text');

-- User badges (assign badges to demo profiles based on their stats)
INSERT INTO public.user_badges (user_id, badge_id, earned_at) VALUES
-- ShadowHunter (level 15, 125 predictions, 78 wins, 7 streak)
('11111111-1111-1111-1111-111111111111', 'b0000001-0001-0001-0001-000000000001', now() - interval '60 days'), -- Première Prédiction
('11111111-1111-1111-1111-111111111111', 'b0000001-0001-0001-0001-000000000002', now() - interval '55 days'), -- Prédicteur Novice
('11111111-1111-1111-1111-111111111111', 'b0000001-0001-0001-0001-000000000003', now() - interval '30 days'), -- Prédicteur Confirmé
('11111111-1111-1111-1111-111111111111', 'b0000001-0001-0001-0001-000000000004', now() - interval '10 days'), -- Prédicteur Expert
('11111111-1111-1111-1111-111111111111', 'b0000002-0002-0002-0002-000000000001', now() - interval '59 days'), -- Premier Succès
('11111111-1111-1111-1111-111111111111', 'b0000002-0002-0002-0002-000000000002', now() - interval '50 days'), -- Gagnant en Série
('11111111-1111-1111-1111-111111111111', 'b0000002-0002-0002-0002-000000000003', now() - interval '20 days'), -- Pro des Pronostics
('11111111-1111-1111-1111-111111111111', 'b0000003-0003-0003-0003-000000000001', now() - interval '45 days'), -- Série de 3
('11111111-1111-1111-1111-111111111111', 'b0000003-0003-0003-0003-000000000002', now() - interval '7 days'),  -- Série de 7
('11111111-1111-1111-1111-111111111111', 'b0000004-0004-0004-0004-000000000001', now() - interval '25 days'), -- Précision 60%
('11111111-1111-1111-1111-111111111111', 'b0000005-0005-0005-0005-000000000001', now() - interval '58 days'), -- Profil Complété
('11111111-1111-1111-1111-111111111111', 'b0000005-0005-0005-0005-000000000002', now() - interval '57 days'), -- Membre d'un Club
('11111111-1111-1111-1111-111111111111', 'b0000005-0005-0005-0005-000000000003', now() - interval '56 days'), -- Créateur de Club
('11111111-1111-1111-1111-111111111111', 'b0000006-0006-0006-0006-000000000001', now() - interval '40 days'), -- Niveau 5
('11111111-1111-1111-1111-111111111111', 'b0000006-0006-0006-0006-000000000002', now() - interval '15 days'), -- Niveau 10

-- NeonBlade (level 22, 245 predictions, 162 wins, 12 streak)
('22222222-2222-2222-2222-222222222222', 'b0000001-0001-0001-0001-000000000001', now() - interval '90 days'),
('22222222-2222-2222-2222-222222222222', 'b0000001-0001-0001-0001-000000000002', now() - interval '85 days'),
('22222222-2222-2222-2222-222222222222', 'b0000001-0001-0001-0001-000000000003', now() - interval '60 days'),
('22222222-2222-2222-2222-222222222222', 'b0000001-0001-0001-0001-000000000004', now() - interval '30 days'),
('22222222-2222-2222-2222-222222222222', 'b0000002-0002-0002-0002-000000000001', now() - interval '89 days'),
('22222222-2222-2222-2222-222222222222', 'b0000002-0002-0002-0002-000000000002', now() - interval '80 days'),
('22222222-2222-2222-2222-222222222222', 'b0000002-0002-0002-0002-000000000003', now() - interval '50 days'),
('22222222-2222-2222-2222-222222222222', 'b0000002-0002-0002-0002-000000000004', now() - interval '20 days'),
('22222222-2222-2222-2222-222222222222', 'b0000003-0003-0003-0003-000000000001', now() - interval '75 days'),
('22222222-2222-2222-2222-222222222222', 'b0000003-0003-0003-0003-000000000002', now() - interval '50 days'),
('22222222-2222-2222-2222-222222222222', 'b0000003-0003-0003-0003-000000000003', now() - interval '12 days'),
('22222222-2222-2222-2222-222222222222', 'b0000004-0004-0004-0004-000000000001', now() - interval '55 days'),
('22222222-2222-2222-2222-222222222222', 'b0000004-0004-0004-0004-000000000002', now() - interval '35 days'),
('22222222-2222-2222-2222-222222222222', 'b0000005-0005-0005-0005-000000000001', now() - interval '88 days'),
('22222222-2222-2222-2222-222222222222', 'b0000005-0005-0005-0005-000000000002', now() - interval '87 days'),
('22222222-2222-2222-2222-222222222222', 'b0000005-0005-0005-0005-000000000003', now() - interval '70 days'),
('22222222-2222-2222-2222-222222222222', 'b0000006-0006-0006-0006-000000000001', now() - interval '70 days'),
('22222222-2222-2222-2222-222222222222', 'b0000006-0006-0006-0006-000000000002', now() - interval '40 days'),
('22222222-2222-2222-2222-222222222222', 'b0000007-0007-0007-0007-000000000003', now() - interval '25 days'), -- Top 10 Hebdo

-- FrostQueen (level 25, 320 predictions, 224 wins, 15 streak, 70% accuracy)
('55555555-5555-5555-5555-555555555555', 'b0000001-0001-0001-0001-000000000001', now() - interval '120 days'),
('55555555-5555-5555-5555-555555555555', 'b0000001-0001-0001-0001-000000000002', now() - interval '115 days'),
('55555555-5555-5555-5555-555555555555', 'b0000001-0001-0001-0001-000000000003', now() - interval '90 days'),
('55555555-5555-5555-5555-555555555555', 'b0000001-0001-0001-0001-000000000004', now() - interval '60 days'),
('55555555-5555-5555-5555-555555555555', 'b0000002-0002-0002-0002-000000000001', now() - interval '119 days'),
('55555555-5555-5555-5555-555555555555', 'b0000002-0002-0002-0002-000000000002', now() - interval '110 days'),
('55555555-5555-5555-5555-555555555555', 'b0000002-0002-0002-0002-000000000003', now() - interval '80 days'),
('55555555-5555-5555-5555-555555555555', 'b0000002-0002-0002-0002-000000000004', now() - interval '45 days'),
('55555555-5555-5555-5555-555555555555', 'b0000002-0002-0002-0002-000000000005', now() - interval '10 days'), -- Invincible (250 wins)
('55555555-5555-5555-5555-555555555555', 'b0000003-0003-0003-0003-000000000001', now() - interval '100 days'),
('55555555-5555-5555-5555-555555555555', 'b0000003-0003-0003-0003-000000000002', now() - interval '80 days'),
('55555555-5555-5555-5555-555555555555', 'b0000003-0003-0003-0003-000000000003', now() - interval '50 days'),
('55555555-5555-5555-5555-555555555555', 'b0000004-0004-0004-0004-000000000001', now() - interval '85 days'),
('55555555-5555-5555-5555-555555555555', 'b0000004-0004-0004-0004-000000000002', now() - interval '55 days'),
('55555555-5555-5555-5555-555555555555', 'b0000005-0005-0005-0005-000000000001', now() - interval '118 days'),
('55555555-5555-5555-5555-555555555555', 'b0000005-0005-0005-0005-000000000002', now() - interval '117 days'),
('55555555-5555-5555-5555-555555555555', 'b0000005-0005-0005-0005-000000000003', now() - interval '100 days'),
('55555555-5555-5555-5555-555555555555', 'b0000006-0006-0006-0006-000000000001', now() - interval '95 days'),
('55555555-5555-5555-5555-555555555555', 'b0000006-0006-0006-0006-000000000002', now() - interval '65 days'),
('55555555-5555-5555-5555-555555555555', 'b0000006-0006-0006-0006-000000000003', now() - interval '20 days'), -- Niveau 25
('55555555-5555-5555-5555-555555555555', 'b0000007-0007-0007-0007-000000000001', now() - interval '90 days'), -- Early Adopter
('55555555-5555-5555-5555-555555555555', 'b0000007-0007-0007-0007-000000000003', now() - interval '40 days'), -- Top 10 Hebdo
('55555555-5555-5555-5555-555555555555', 'b0000007-0007-0007-0007-000000000004', now() - interval '15 days'), -- Top 3 Hebdo

-- DarkPhoenix (level 30, 450 predictions, 315 wins, 21 streak, 70% accuracy) - TOP PLAYER
('77777777-7777-7777-7777-777777777777', 'b0000001-0001-0001-0001-000000000001', now() - interval '150 days'),
('77777777-7777-7777-7777-777777777777', 'b0000001-0001-0001-0001-000000000002', now() - interval '145 days'),
('77777777-7777-7777-7777-777777777777', 'b0000001-0001-0001-0001-000000000003', now() - interval '120 days'),
('77777777-7777-7777-7777-777777777777', 'b0000001-0001-0001-0001-000000000004', now() - interval '90 days'),
('77777777-7777-7777-7777-777777777777', 'b0000002-0002-0002-0002-000000000001', now() - interval '149 days'),
('77777777-7777-7777-7777-777777777777', 'b0000002-0002-0002-0002-000000000002', now() - interval '140 days'),
('77777777-7777-7777-7777-777777777777', 'b0000002-0002-0002-0002-000000000003', now() - interval '110 days'),
('77777777-7777-7777-7777-777777777777', 'b0000002-0002-0002-0002-000000000004', now() - interval '70 days'),
('77777777-7777-7777-7777-777777777777', 'b0000002-0002-0002-0002-000000000005', now() - interval '30 days'), -- Invincible
('77777777-7777-7777-7777-777777777777', 'b0000003-0003-0003-0003-000000000001', now() - interval '130 days'),
('77777777-7777-7777-7777-777777777777', 'b0000003-0003-0003-0003-000000000002', now() - interval '100 days'),
('77777777-7777-7777-7777-777777777777', 'b0000003-0003-0003-0003-000000000003', now() - interval '70 days'),
('77777777-7777-7777-7777-777777777777', 'b0000003-0003-0003-0003-000000000004', now() - interval '21 days'), -- Série de 30
('77777777-7777-7777-7777-777777777777', 'b0000004-0004-0004-0004-000000000001', now() - interval '115 days'),
('77777777-7777-7777-7777-777777777777', 'b0000004-0004-0004-0004-000000000002', now() - interval '85 days'),
('77777777-7777-7777-7777-777777777777', 'b0000005-0005-0005-0005-000000000001', now() - interval '148 days'),
('77777777-7777-7777-7777-777777777777', 'b0000005-0005-0005-0005-000000000002', now() - interval '147 days'),
('77777777-7777-7777-7777-777777777777', 'b0000005-0005-0005-0005-000000000003', now() - interval '130 days'),
('77777777-7777-7777-7777-777777777777', 'b0000005-0005-0005-0005-000000000004', now() - interval '60 days'), -- Social Butterfly
('77777777-7777-7777-7777-777777777777', 'b0000006-0006-0006-0006-000000000001', now() - interval '125 days'),
('77777777-7777-7777-7777-777777777777', 'b0000006-0006-0006-0006-000000000002', now() - interval '95 days'),
('77777777-7777-7777-7777-777777777777', 'b0000006-0006-0006-0006-000000000003', now() - interval '45 days'),
('77777777-7777-7777-7777-777777777777', 'b0000007-0007-0007-0007-000000000001', now() - interval '140 days'), -- Early Adopter
('77777777-7777-7777-7777-777777777777', 'b0000007-0007-0007-0007-000000000002', now() - interval '145 days'), -- Bêta Testeur
('77777777-7777-7777-7777-777777777777', 'b0000007-0007-0007-0007-000000000003', now() - interval '60 days'),
('77777777-7777-7777-7777-777777777777', 'b0000007-0007-0007-0007-000000000004', now() - interval '25 days'),

-- ThunderLord (level 28, 380 predictions, 266 wins, 18 streak)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000001-0001-0001-0001-000000000001', now() - interval '130 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000001-0001-0001-0001-000000000002', now() - interval '125 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000001-0001-0001-0001-000000000003', now() - interval '100 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000001-0001-0001-0001-000000000004', now() - interval '70 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000002-0002-0002-0002-000000000001', now() - interval '129 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000002-0002-0002-0002-000000000002', now() - interval '120 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000002-0002-0002-0002-000000000003', now() - interval '90 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000002-0002-0002-0002-000000000004', now() - interval '50 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000002-0002-0002-0002-000000000005', now() - interval '15 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000003-0003-0003-0003-000000000001', now() - interval '110 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000003-0003-0003-0003-000000000002', now() - interval '85 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000003-0003-0003-0003-000000000003', now() - interval '55 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000004-0004-0004-0004-000000000001', now() - interval '95 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000004-0004-0004-0004-000000000002', now() - interval '65 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000005-0005-0005-0005-000000000001', now() - interval '128 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000005-0005-0005-0005-000000000002', now() - interval '127 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000005-0005-0005-0005-000000000003', now() - interval '110 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000006-0006-0006-0006-000000000001', now() - interval '105 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000006-0006-0006-0006-000000000002', now() - interval '75 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000006-0006-0006-0006-000000000003', now() - interval '30 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000007-0007-0007-0007-000000000001', now() - interval '120 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000007-0007-0007-0007-000000000003', now() - interval '45 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b0000007-0007-0007-0007-000000000004', now() - interval '20 days'),

-- CyberWolf (level 8, 45 predictions, 25 wins, 3 streak) - Beginner
('33333333-3333-3333-3333-333333333333', 'b0000001-0001-0001-0001-000000000001', now() - interval '20 days'),
('33333333-3333-3333-3333-333333333333', 'b0000001-0001-0001-0001-000000000002', now() - interval '10 days'),
('33333333-3333-3333-3333-333333333333', 'b0000002-0002-0002-0002-000000000001', now() - interval '18 days'),
('33333333-3333-3333-3333-333333333333', 'b0000002-0002-0002-0002-000000000002', now() - interval '8 days'),
('33333333-3333-3333-3333-333333333333', 'b0000003-0003-0003-0003-000000000001', now() - interval '3 days'),
('33333333-3333-3333-3333-333333333333', 'b0000005-0005-0005-0005-000000000001', now() - interval '19 days'),
('33333333-3333-3333-3333-333333333333', 'b0000005-0005-0005-0005-000000000002', now() - interval '17 days'),
('33333333-3333-3333-3333-333333333333', 'b0000006-0006-0006-0006-000000000001', now() - interval '5 days'),

-- StormRider (level 18, 180 predictions, 115 wins, 9 streak)
('44444444-4444-4444-4444-444444444444', 'b0000001-0001-0001-0001-000000000001', now() - interval '80 days'),
('44444444-4444-4444-4444-444444444444', 'b0000001-0001-0001-0001-000000000002', now() - interval '75 days'),
('44444444-4444-4444-4444-444444444444', 'b0000001-0001-0001-0001-000000000003', now() - interval '50 days'),
('44444444-4444-4444-4444-444444444444', 'b0000001-0001-0001-0001-000000000004', now() - interval '20 days'),
('44444444-4444-4444-4444-444444444444', 'b0000002-0002-0002-0002-000000000001', now() - interval '79 days'),
('44444444-4444-4444-4444-444444444444', 'b0000002-0002-0002-0002-000000000002', now() - interval '70 days'),
('44444444-4444-4444-4444-444444444444', 'b0000002-0002-0002-0002-000000000003', now() - interval '40 days'),
('44444444-4444-4444-4444-444444444444', 'b0000002-0002-0002-0002-000000000004', now() - interval '10 days'),
('44444444-4444-4444-4444-444444444444', 'b0000003-0003-0003-0003-000000000001', now() - interval '65 days'),
('44444444-4444-4444-4444-444444444444', 'b0000003-0003-0003-0003-000000000002', now() - interval '40 days'),
('44444444-4444-4444-4444-444444444444', 'b0000004-0004-0004-0004-000000000001', now() - interval '45 days'),
('44444444-4444-4444-4444-444444444444', 'b0000005-0005-0005-0005-000000000001', now() - interval '78 days'),
('44444444-4444-4444-4444-444444444444', 'b0000005-0005-0005-0005-000000000002', now() - interval '77 days'),
('44444444-4444-4444-4444-444444444444', 'b0000006-0006-0006-0006-000000000001', now() - interval '60 days'),
('44444444-4444-4444-4444-444444444444', 'b0000006-0006-0006-0006-000000000002', now() - interval '30 days'),

-- MysticSage (level 20, 210 predictions, 140 wins, 11 streak)
('99999999-9999-9999-9999-999999999999', 'b0000001-0001-0001-0001-000000000001', now() - interval '85 days'),
('99999999-9999-9999-9999-999999999999', 'b0000001-0001-0001-0001-000000000002', now() - interval '80 days'),
('99999999-9999-9999-9999-999999999999', 'b0000001-0001-0001-0001-000000000003', now() - interval '55 days'),
('99999999-9999-9999-9999-999999999999', 'b0000001-0001-0001-0001-000000000004', now() - interval '25 days'),
('99999999-9999-9999-9999-999999999999', 'b0000002-0002-0002-0002-000000000001', now() - interval '84 days'),
('99999999-9999-9999-9999-999999999999', 'b0000002-0002-0002-0002-000000000002', now() - interval '75 days'),
('99999999-9999-9999-9999-999999999999', 'b0000002-0002-0002-0002-000000000003', now() - interval '45 days'),
('99999999-9999-9999-9999-999999999999', 'b0000002-0002-0002-0002-000000000004', now() - interval '15 days'),
('99999999-9999-9999-9999-999999999999', 'b0000003-0003-0003-0003-000000000001', now() - interval '70 days'),
('99999999-9999-9999-9999-999999999999', 'b0000003-0003-0003-0003-000000000002', now() - interval '45 days'),
('99999999-9999-9999-9999-999999999999', 'b0000003-0003-0003-0003-000000000003', now() - interval '11 days'),
('99999999-9999-9999-9999-999999999999', 'b0000004-0004-0004-0004-000000000001', now() - interval '50 days'),
('99999999-9999-9999-9999-999999999999', 'b0000004-0004-0004-0004-000000000002', now() - interval '30 days'),
('99999999-9999-9999-9999-999999999999', 'b0000005-0005-0005-0005-000000000001', now() - interval '83 days'),
('99999999-9999-9999-9999-999999999999', 'b0000005-0005-0005-0005-000000000002', now() - interval '82 days'),
('99999999-9999-9999-9999-999999999999', 'b0000006-0006-0006-0006-000000000001', now() - interval '65 days'),
('99999999-9999-9999-9999-999999999999', 'b0000006-0006-0006-0006-000000000002', now() - interval '35 days'),
('99999999-9999-9999-9999-999999999999', 'b0000007-0007-0007-0007-000000000003', now() - interval '20 days');

-- Weekly rankings (historical data for the last 8 weeks)
-- Week 1 (8 weeks ago)
INSERT INTO public.weekly_rankings (user_id, week_start, week_end, arena_score, predictions_count, accuracy, final_rank, rewards_claimed) VALUES
('77777777-7777-7777-7777-777777777777', (CURRENT_DATE - interval '8 weeks')::date, (CURRENT_DATE - interval '7 weeks')::date, 580, 45, 71.1, 1, true),
('55555555-5555-5555-5555-555555555555', (CURRENT_DATE - interval '8 weeks')::date, (CURRENT_DATE - interval '7 weeks')::date, 520, 40, 70.0, 2, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (CURRENT_DATE - interval '8 weeks')::date, (CURRENT_DATE - interval '7 weeks')::date, 480, 38, 68.4, 3, true),
('22222222-2222-2222-2222-222222222222', (CURRENT_DATE - interval '8 weeks')::date, (CURRENT_DATE - interval '7 weeks')::date, 420, 35, 65.7, 4, true),
('99999999-9999-9999-9999-999999999999', (CURRENT_DATE - interval '8 weeks')::date, (CURRENT_DATE - interval '7 weeks')::date, 380, 30, 66.6, 5, true),
('44444444-4444-4444-4444-444444444444', (CURRENT_DATE - interval '8 weeks')::date, (CURRENT_DATE - interval '7 weeks')::date, 320, 28, 64.2, 6, true),
('11111111-1111-1111-1111-111111111111', (CURRENT_DATE - interval '8 weeks')::date, (CURRENT_DATE - interval '7 weeks')::date, 280, 22, 63.6, 7, true),
('66666666-6666-6666-6666-666666666666', (CURRENT_DATE - interval '8 weeks')::date, (CURRENT_DATE - interval '7 weeks')::date, 220, 18, 61.1, 8, true),
('88888888-8888-8888-8888-888888888888', (CURRENT_DATE - interval '8 weeks')::date, (CURRENT_DATE - interval '7 weeks')::date, 150, 12, 58.3, 9, true),
('33333333-3333-3333-3333-333333333333', (CURRENT_DATE - interval '8 weeks')::date, (CURRENT_DATE - interval '7 weeks')::date, 80, 8, 50.0, 10, true),

-- Week 2 (7 weeks ago)
('77777777-7777-7777-7777-777777777777', (CURRENT_DATE - interval '7 weeks')::date, (CURRENT_DATE - interval '6 weeks')::date, 620, 48, 72.9, 1, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (CURRENT_DATE - interval '7 weeks')::date, (CURRENT_DATE - interval '6 weeks')::date, 550, 42, 69.0, 2, true),
('55555555-5555-5555-5555-555555555555', (CURRENT_DATE - interval '7 weeks')::date, (CURRENT_DATE - interval '6 weeks')::date, 510, 39, 69.2, 3, true),
('22222222-2222-2222-2222-222222222222', (CURRENT_DATE - interval '7 weeks')::date, (CURRENT_DATE - interval '6 weeks')::date, 450, 37, 67.5, 4, true),
('44444444-4444-4444-4444-444444444444', (CURRENT_DATE - interval '7 weeks')::date, (CURRENT_DATE - interval '6 weeks')::date, 380, 32, 65.6, 5, true),
('99999999-9999-9999-9999-999999999999', (CURRENT_DATE - interval '7 weeks')::date, (CURRENT_DATE - interval '6 weeks')::date, 350, 28, 64.2, 6, true),
('11111111-1111-1111-1111-111111111111', (CURRENT_DATE - interval '7 weeks')::date, (CURRENT_DATE - interval '6 weeks')::date, 300, 25, 64.0, 7, true),
('66666666-6666-6666-6666-666666666666', (CURRENT_DATE - interval '7 weeks')::date, (CURRENT_DATE - interval '6 weeks')::date, 240, 20, 60.0, 8, true),
('88888888-8888-8888-8888-888888888888', (CURRENT_DATE - interval '7 weeks')::date, (CURRENT_DATE - interval '6 weeks')::date, 180, 15, 60.0, 9, true),
('33333333-3333-3333-3333-333333333333', (CURRENT_DATE - interval '7 weeks')::date, (CURRENT_DATE - interval '6 weeks')::date, 100, 10, 50.0, 10, true),

-- Week 3 (6 weeks ago)
('55555555-5555-5555-5555-555555555555', (CURRENT_DATE - interval '6 weeks')::date, (CURRENT_DATE - interval '5 weeks')::date, 600, 46, 71.7, 1, true),
('77777777-7777-7777-7777-777777777777', (CURRENT_DATE - interval '6 weeks')::date, (CURRENT_DATE - interval '5 weeks')::date, 580, 44, 70.4, 2, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (CURRENT_DATE - interval '6 weeks')::date, (CURRENT_DATE - interval '5 weeks')::date, 520, 40, 70.0, 3, true),
('99999999-9999-9999-9999-999999999999', (CURRENT_DATE - interval '6 weeks')::date, (CURRENT_DATE - interval '5 weeks')::date, 420, 34, 67.6, 4, true),
('22222222-2222-2222-2222-222222222222', (CURRENT_DATE - interval '6 weeks')::date, (CURRENT_DATE - interval '5 weeks')::date, 400, 33, 66.6, 5, true),
('11111111-1111-1111-1111-111111111111', (CURRENT_DATE - interval '6 weeks')::date, (CURRENT_DATE - interval '5 weeks')::date, 350, 30, 63.3, 6, true),
('44444444-4444-4444-4444-444444444444', (CURRENT_DATE - interval '6 weeks')::date, (CURRENT_DATE - interval '5 weeks')::date, 320, 27, 62.9, 7, true),
('66666666-6666-6666-6666-666666666666', (CURRENT_DATE - interval '6 weeks')::date, (CURRENT_DATE - interval '5 weeks')::date, 260, 22, 59.0, 8, true),
('88888888-8888-8888-8888-888888888888', (CURRENT_DATE - interval '6 weeks')::date, (CURRENT_DATE - interval '5 weeks')::date, 200, 18, 55.5, 9, true),
('33333333-3333-3333-3333-333333333333', (CURRENT_DATE - interval '6 weeks')::date, (CURRENT_DATE - interval '5 weeks')::date, 120, 12, 50.0, 10, true),

-- Week 4 (5 weeks ago)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (CURRENT_DATE - interval '5 weeks')::date, (CURRENT_DATE - interval '4 weeks')::date, 640, 50, 72.0, 1, true),
('77777777-7777-7777-7777-777777777777', (CURRENT_DATE - interval '5 weeks')::date, (CURRENT_DATE - interval '4 weeks')::date, 600, 46, 71.7, 2, true),
('55555555-5555-5555-5555-555555555555', (CURRENT_DATE - interval '5 weeks')::date, (CURRENT_DATE - interval '4 weeks')::date, 560, 43, 69.7, 3, true),
('22222222-2222-2222-2222-222222222222', (CURRENT_DATE - interval '5 weeks')::date, (CURRENT_DATE - interval '4 weeks')::date, 480, 40, 67.5, 4, true),
('99999999-9999-9999-9999-999999999999', (CURRENT_DATE - interval '5 weeks')::date, (CURRENT_DATE - interval '4 weeks')::date, 440, 36, 66.6, 5, true),
('44444444-4444-4444-4444-444444444444', (CURRENT_DATE - interval '5 weeks')::date, (CURRENT_DATE - interval '4 weeks')::date, 380, 32, 65.6, 6, true),
('11111111-1111-1111-1111-111111111111', (CURRENT_DATE - interval '5 weeks')::date, (CURRENT_DATE - interval '4 weeks')::date, 320, 27, 62.9, 7, true),
('66666666-6666-6666-6666-666666666666', (CURRENT_DATE - interval '5 weeks')::date, (CURRENT_DATE - interval '4 weeks')::date, 280, 24, 58.3, 8, true),
('88888888-8888-8888-8888-888888888888', (CURRENT_DATE - interval '5 weeks')::date, (CURRENT_DATE - interval '4 weeks')::date, 220, 20, 55.0, 9, true),
('33333333-3333-3333-3333-333333333333', (CURRENT_DATE - interval '5 weeks')::date, (CURRENT_DATE - interval '4 weeks')::date, 140, 14, 50.0, 10, true),

-- Week 5 (4 weeks ago)
('77777777-7777-7777-7777-777777777777', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 680, 52, 73.0, 1, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 620, 48, 70.8, 2, true),
('55555555-5555-5555-5555-555555555555', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 580, 45, 71.1, 3, true),
('22222222-2222-2222-2222-222222222222', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 500, 42, 66.6, 4, true),
('44444444-4444-4444-4444-444444444444', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 420, 35, 65.7, 5, true),
('99999999-9999-9999-9999-999999999999', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 400, 34, 67.6, 6, true),
('11111111-1111-1111-1111-111111111111', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 340, 28, 64.2, 7, true),
('66666666-6666-6666-6666-666666666666', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 300, 26, 57.6, 8, true),
('88888888-8888-8888-8888-888888888888', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 240, 22, 54.5, 9, true),
('33333333-3333-3333-3333-333333333333', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 160, 16, 50.0, 10, true),

-- Week 6 (3 weeks ago)
('55555555-5555-5555-5555-555555555555', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 700, 54, 72.2, 1, true),
('77777777-7777-7777-7777-777777777777', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 660, 50, 72.0, 2, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 600, 46, 69.5, 3, true),
('99999999-9999-9999-9999-999999999999', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 480, 40, 67.5, 4, true),
('22222222-2222-2222-2222-222222222222', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 460, 38, 65.7, 5, true),
('11111111-1111-1111-1111-111111111111', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 380, 32, 62.5, 6, true),
('44444444-4444-4444-4444-444444444444', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 360, 30, 63.3, 7, true),
('66666666-6666-6666-6666-666666666666', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 320, 28, 57.1, 8, true),
('88888888-8888-8888-8888-888888888888', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 260, 24, 54.1, 9, true),
('33333333-3333-3333-3333-333333333333', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 180, 18, 50.0, 10, true),

-- Week 7 (2 weeks ago)
('77777777-7777-7777-7777-777777777777', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 720, 55, 72.7, 1, true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 680, 52, 71.1, 2, true),
('55555555-5555-5555-5555-555555555555', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 640, 49, 71.4, 3, true),
('22222222-2222-2222-2222-222222222222', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 520, 44, 65.9, 4, true),
('99999999-9999-9999-9999-999999999999', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 500, 42, 66.6, 5, true),
('44444444-4444-4444-4444-444444444444', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 440, 38, 63.1, 6, true),
('11111111-1111-1111-1111-111111111111', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 400, 34, 64.7, 7, true),
('66666666-6666-6666-6666-666666666666', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 340, 30, 56.6, 8, true),
('88888888-8888-8888-8888-888888888888', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 280, 26, 53.8, 9, true),
('33333333-3333-3333-3333-333333333333', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 200, 20, 50.0, 10, true),

-- Week 8 (current week - ongoing, not yet finalized)
('77777777-7777-7777-7777-777777777777', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 450, 35, 74.2, NULL, false),
('55555555-5555-5555-5555-555555555555', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 420, 32, 71.8, NULL, false),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 400, 30, 70.0, NULL, false),
('22222222-2222-2222-2222-222222222222', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 340, 28, 67.8, NULL, false),
('99999999-9999-9999-9999-999999999999', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 320, 26, 65.3, NULL, false),
('44444444-4444-4444-4444-444444444444', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 280, 24, 62.5, NULL, false),
('11111111-1111-1111-1111-111111111111', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 250, 22, 63.6, NULL, false),
('66666666-6666-6666-6666-666666666666', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 200, 18, 55.5, NULL, false),
('88888888-8888-8888-8888-888888888888', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 160, 15, 53.3, NULL, false),
('33333333-3333-3333-3333-333333333333', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 100, 10, 50.0, NULL, false);

-- Club weekly rankings (historical data for the last 4 weeks)
INSERT INTO public.club_weekly_rankings (club_id, week_start, week_end, total_xp, total_predictions, total_wins, accuracy, final_rank, rewards_claimed) VALUES
-- 4 weeks ago
('c3333333-3333-3333-3333-333333333333', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 4500, 180, 126, 70.0, 1, true),
('c5555555-5555-5555-5555-555555555555', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 3800, 150, 102, 68.0, 2, true),
('c1111111-1111-1111-1111-111111111111', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 3200, 130, 84, 64.6, 3, true),
('c2222222-2222-2222-2222-222222222222', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 2800, 110, 70, 63.6, 4, true),
('c4444444-4444-4444-4444-444444444444', (CURRENT_DATE - interval '4 weeks')::date, (CURRENT_DATE - interval '3 weeks')::date, 1800, 75, 45, 60.0, 5, true),

-- 3 weeks ago
('c3333333-3333-3333-3333-333333333333', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 5200, 200, 144, 72.0, 1, true),
('c1111111-1111-1111-1111-111111111111', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 4100, 165, 110, 66.6, 2, true),
('c5555555-5555-5555-5555-555555555555', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 3900, 155, 105, 67.7, 3, true),
('c2222222-2222-2222-2222-222222222222', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 3100, 125, 82, 65.6, 4, true),
('c4444444-4444-4444-4444-444444444444', (CURRENT_DATE - interval '3 weeks')::date, (CURRENT_DATE - interval '2 weeks')::date, 2100, 88, 55, 62.5, 5, true),

-- 2 weeks ago
('c5555555-5555-5555-5555-555555555555', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 4800, 190, 133, 70.0, 1, true),
('c3333333-3333-3333-3333-333333333333', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 4600, 185, 127, 68.6, 2, true),
('c1111111-1111-1111-1111-111111111111', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 3800, 155, 100, 64.5, 3, true),
('c2222222-2222-2222-2222-222222222222', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 3400, 140, 92, 65.7, 4, true),
('c4444444-4444-4444-4444-444444444444', (CURRENT_DATE - interval '2 weeks')::date, (CURRENT_DATE - interval '1 week')::date, 2400, 100, 62, 62.0, 5, true),

-- Current week (ongoing)
('c3333333-3333-3333-3333-333333333333', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 2800, 110, 78, 70.9, NULL, false),
('c5555555-5555-5555-5555-555555555555', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 2500, 98, 68, 69.3, NULL, false),
('c1111111-1111-1111-1111-111111111111', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 2100, 85, 55, 64.7, NULL, false),
('c2222222-2222-2222-2222-222222222222', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 1900, 78, 50, 64.1, NULL, false),
('c4444444-4444-4444-4444-444444444444', (CURRENT_DATE - interval '1 week')::date, CURRENT_DATE, 1200, 50, 30, 60.0, NULL, false);

-- Predictions (historical demo predictions)
-- Using realistic esport match IDs and team names
INSERT INTO public.predictions (user_id, match_id, selected_team, odds, stake_amount, potential_winnings, status, created_at, resolved_at) VALUES
-- DarkPhoenix predictions (top player - 70% win rate)
('77777777-7777-7777-7777-777777777777', 'lol-worlds-2025-001', 'T1', 1.85, 100, 185, 'won', now() - interval '30 days', now() - interval '29 days'),
('77777777-7777-7777-7777-777777777777', 'lol-worlds-2025-002', 'Gen.G', 2.10, 150, 315, 'won', now() - interval '28 days', now() - interval '27 days'),
('77777777-7777-7777-7777-777777777777', 'cs2-major-paris-001', 'FaZe Clan', 1.75, 200, 350, 'won', now() - interval '26 days', now() - interval '25 days'),
('77777777-7777-7777-7777-777777777777', 'cs2-major-paris-002', 'Vitality', 2.20, 100, 220, 'lost', now() - interval '24 days', now() - interval '23 days'),
('77777777-7777-7777-7777-777777777777', 'valorant-masters-001', 'Sentinels', 1.90, 150, 285, 'won', now() - interval '22 days', now() - interval '21 days'),
('77777777-7777-7777-7777-777777777777', 'lol-lec-spring-001', 'G2 Esports', 1.65, 200, 330, 'won', now() - interval '20 days', now() - interval '19 days'),
('77777777-7777-7777-7777-777777777777', 'dota2-ti-2025-001', 'Team Spirit', 2.30, 100, 230, 'won', now() - interval '18 days', now() - interval '17 days'),
('77777777-7777-7777-7777-777777777777', 'cs2-blast-001', 'NAVI', 1.80, 150, 270, 'lost', now() - interval '16 days', now() - interval '15 days'),
('77777777-7777-7777-7777-777777777777', 'lol-lck-spring-001', 'DRX', 2.50, 100, 250, 'won', now() - interval '14 days', now() - interval '13 days'),
('77777777-7777-7777-7777-777777777777', 'valorant-vct-001', 'LOUD', 1.95, 200, 390, 'won', now() - interval '12 days', now() - interval '11 days'),
('77777777-7777-7777-7777-777777777777', 'cs2-iem-001', 'Heroic', 2.15, 150, 322, 'won', now() - interval '10 days', now() - interval '9 days'),
('77777777-7777-7777-7777-777777777777', 'lol-worlds-qf-001', 'JDG', 1.70, 200, 340, 'won', now() - interval '8 days', now() - interval '7 days'),
('77777777-7777-7777-7777-777777777777', 'cs2-major-sf-001', 'Cloud9', 2.40, 100, 240, 'lost', now() - interval '6 days', now() - interval '5 days'),
('77777777-7777-7777-7777-777777777777', 'valorant-champs-001', 'Paper Rex', 2.00, 150, 300, 'won', now() - interval '4 days', now() - interval '3 days'),
('77777777-7777-7777-7777-777777777777', 'lol-msi-2025-001', 'BLG', 1.85, 200, 370, 'pending', now() - interval '1 day', NULL),

-- FrostQueen predictions (high performer - 70% win rate)
('55555555-5555-5555-5555-555555555555', 'lol-worlds-2025-001', 'T1', 1.85, 150, 277, 'won', now() - interval '30 days', now() - interval '29 days'),
('55555555-5555-5555-5555-555555555555', 'cs2-major-paris-003', 'Astralis', 2.30, 100, 230, 'lost', now() - interval '28 days', now() - interval '27 days'),
('55555555-5555-5555-5555-555555555555', 'valorant-masters-002', 'DRX', 1.75, 200, 350, 'won', now() - interval '26 days', now() - interval '25 days'),
('55555555-5555-5555-5555-555555555555', 'lol-lec-spring-002', 'Fnatic', 2.10, 150, 315, 'won', now() - interval '24 days', now() - interval '23 days'),
('55555555-5555-5555-5555-555555555555', 'dota2-ti-2025-002', 'OG', 1.90, 100, 190, 'won', now() - interval '22 days', now() - interval '21 days'),
('55555555-5555-5555-5555-555555555555', 'cs2-blast-002', 'Virtus.pro', 2.20, 200, 440, 'lost', now() - interval '20 days', now() - interval '19 days'),
('55555555-5555-5555-5555-555555555555', 'lol-lck-spring-002', 'T1', 1.55, 150, 232, 'won', now() - interval '18 days', now() - interval '17 days'),
('55555555-5555-5555-5555-555555555555', 'valorant-vct-002', 'Fnatic', 1.85, 200, 370, 'won', now() - interval '16 days', now() - interval '15 days'),
('55555555-5555-5555-5555-555555555555', 'cs2-iem-002', 'MOUZ', 2.40, 100, 240, 'won', now() - interval '14 days', now() - interval '13 days'),
('55555555-5555-5555-5555-555555555555', 'lol-worlds-qf-002', 'Weibo', 1.80, 150, 270, 'lost', now() - interval '12 days', now() - interval '11 days'),
('55555555-5555-5555-5555-555555555555', 'cs2-major-sf-002', 'G2', 1.95, 200, 390, 'won', now() - interval '10 days', now() - interval '9 days'),
('55555555-5555-5555-5555-555555555555', 'valorant-champs-002', 'Evil Geniuses', 2.10, 100, 210, 'won', now() - interval '8 days', now() - interval '7 days'),
('55555555-5555-5555-5555-555555555555', 'lol-msi-qf-001', 'Gen.G', 1.70, 150, 255, 'pending', now() - interval '2 days', NULL),

-- ThunderLord predictions (70% win rate)
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'lol-worlds-2025-003', 'Hanwha Life', 2.50, 100, 250, 'won', now() - interval '29 days', now() - interval '28 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cs2-major-paris-004', 'ENCE', 2.80, 150, 420, 'lost', now() - interval '27 days', now() - interval '26 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'valorant-masters-003', 'NRG', 1.90, 200, 380, 'won', now() - interval '25 days', now() - interval '24 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'lol-lec-spring-003', 'MAD Lions', 2.20, 100, 220, 'won', now() - interval '23 days', now() - interval '22 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dota2-major-001', 'Team Liquid', 1.75, 150, 262, 'won', now() - interval '21 days', now() - interval '20 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cs2-epl-001', 'Complexity', 3.00, 100, 300, 'lost', now() - interval '19 days', now() - interval '18 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'lol-lck-spring-003', 'KT Rolster', 2.40, 200, 480, 'won', now() - interval '17 days', now() - interval '16 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'valorant-vct-003', 'Cloud9', 1.85, 150, 277, 'won', now() - interval '15 days', now() - interval '14 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cs2-iem-003', 'Eternal Fire', 2.10, 100, 210, 'won', now() - interval '13 days', now() - interval '12 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'lol-worlds-sf-001', 'T1', 1.60, 200, 320, 'won', now() - interval '11 days', now() - interval '10 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'valorant-champs-003', 'LOUD', 1.95, 150, 292, 'lost', now() - interval '9 days', now() - interval '8 days'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cs2-major-final-001', 'FaZe Clan', 1.80, 100, 180, 'pending', now() - interval '1 day', NULL),

-- NeonBlade predictions (66% win rate)
('22222222-2222-2222-2222-222222222222', 'lol-lec-spring-004', 'Rogue', 2.30, 100, 230, 'won', now() - interval '28 days', now() - interval '27 days'),
('22222222-2222-2222-2222-222222222222', 'cs2-blast-003', 'BIG', 2.50, 150, 375, 'lost', now() - interval '26 days', now() - interval '25 days'),
('22222222-2222-2222-2222-222222222222', 'valorant-masters-004', 'KRU', 3.20, 100, 320, 'lost', now() - interval '24 days', now() - interval '23 days'),
('22222222-2222-2222-2222-222222222222', 'lol-lck-spring-004', 'Dplus KIA', 1.70, 200, 340, 'won', now() - interval '22 days', now() - interval '21 days'),
('22222222-2222-2222-2222-222222222222', 'cs2-epl-002', 'paiN', 2.80, 100, 280, 'won', now() - interval '20 days', now() - interval '19 days'),
('22222222-2222-2222-2222-222222222222', 'dota2-major-002', 'Tundra', 1.90, 150, 285, 'won', now() - interval '18 days', now() - interval '17 days'),
('22222222-2222-2222-2222-222222222222', 'valorant-vct-004', '100 Thieves', 2.10, 200, 420, 'won', now() - interval '16 days', now() - interval '15 days'),
('22222222-2222-2222-2222-222222222222', 'lol-worlds-group-001', 'LNG', 2.40, 100, 240, 'lost', now() - interval '14 days', now() - interval '13 days'),
('22222222-2222-2222-2222-222222222222', 'cs2-iem-004', 'Spirit', 1.75, 150, 262, 'won', now() - interval '12 days', now() - interval '11 days'),
('22222222-2222-2222-2222-222222222222', 'valorant-champs-004', 'Leviatán', 2.20, 100, 220, 'won', now() - interval '10 days', now() - interval '9 days'),
('22222222-2222-2222-2222-222222222222', 'lol-msi-group-001', 'PSG Talon', 2.60, 150, 390, 'pending', now() - interval '2 days', NULL),

-- MysticSage predictions (66% win rate)
('99999999-9999-9999-9999-999999999999', 'cs2-major-paris-005', 'Liquid', 1.95, 100, 195, 'won', now() - interval '27 days', now() - interval '26 days'),
('99999999-9999-9999-9999-999999999999', 'lol-lec-spring-005', 'SK Gaming', 2.80, 150, 420, 'lost', now() - interval '25 days', now() - interval '24 days'),
('99999999-9999-9999-9999-999999999999', 'valorant-masters-005', 'XSET', 2.30, 100, 230, 'won', now() - interval '23 days', now() - interval '22 days'),
('99999999-9999-9999-9999-999999999999', 'dota2-ti-2025-003', 'Gaimin Gladiators', 2.10, 200, 420, 'won', now() - interval '21 days', now() - interval '20 days'),
('99999999-9999-9999-9999-999999999999', 'cs2-blast-004', 'Apeks', 2.60, 100, 260, 'lost', now() - interval '19 days', now() - interval '18 days'),
('99999999-9999-9999-9999-999999999999', 'lol-lck-spring-005', 'Kwangdong Freecs', 2.40, 150, 360, 'won', now() - interval '17 days', now() - interval '16 days'),
('99999999-9999-9999-9999-999999999999', 'valorant-vct-005', 'FURIA', 1.85, 200, 370, 'won', now() - interval '15 days', now() - interval '14 days'),
('99999999-9999-9999-9999-999999999999', 'cs2-epl-003', 'Falcons', 2.20, 100, 220, 'won', now() - interval '13 days', now() - interval '12 days'),
('99999999-9999-9999-9999-999999999999', 'lol-worlds-group-002', 'GAM', 3.50, 150, 525, 'lost', now() - interval '11 days', now() - interval '10 days'),
('99999999-9999-9999-9999-999999999999', 'valorant-champs-005', 'Karmine Corp', 1.90, 100, 190, 'pending', now() - interval '1 day', NULL),

-- StormRider predictions (64% win rate)
('44444444-4444-4444-4444-444444444444', 'lol-lec-spring-006', 'Astralis', 2.70, 100, 270, 'lost', now() - interval '26 days', now() - interval '25 days'),
('44444444-4444-4444-4444-444444444444', 'cs2-major-paris-006', 'Imperial', 3.20, 150, 480, 'lost', now() - interval '24 days', now() - interval '23 days'),
('44444444-4444-4444-4444-444444444444', 'valorant-masters-006', 'OpTic', 1.80, 200, 360, 'won', now() - interval '22 days', now() - interval '21 days'),
('44444444-4444-4444-4444-444444444444', 'dota2-major-003', 'PSG.LGD', 1.65, 100, 165, 'won', now() - interval '20 days', now() - interval '19 days'),
('44444444-4444-4444-4444-444444444444', 'cs2-blast-005', 'Monte', 2.90, 150, 435, 'won', now() - interval '18 days', now() - interval '17 days'),
('44444444-4444-4444-4444-444444444444', 'lol-lck-spring-006', 'Liiv SANDBOX', 2.50, 100, 250, 'lost', now() - interval '16 days', now() - interval '15 days'),
('44444444-4444-4444-4444-444444444444', 'valorant-vct-006', 'MIBR', 2.10, 200, 420, 'won', now() - interval '14 days', now() - interval '13 days'),
('44444444-4444-4444-4444-444444444444', 'cs2-iem-005', '9INE', 2.30, 150, 345, 'won', now() - interval '12 days', now() - interval '11 days'),
('44444444-4444-4444-4444-444444444444', 'lol-worlds-group-003', 'Team BDS', 2.80, 100, 280, 'won', now() - interval '10 days', now() - interval '9 days'),
('44444444-4444-4444-4444-444444444444', 'valorant-champs-006', 'Giants', 2.40, 150, 360, 'pending', now() - interval '2 days', NULL),

-- ShadowHunter predictions (62% win rate)
('11111111-1111-1111-1111-111111111111', 'cs2-major-paris-007', 'SAW', 3.50, 100, 350, 'lost', now() - interval '25 days', now() - interval '24 days'),
('11111111-1111-1111-1111-111111111111', 'lol-lec-spring-007', 'Team Heretics', 2.20, 150, 330, 'won', now() - interval '23 days', now() - interval '22 days'),
('11111111-1111-1111-1111-111111111111', 'valorant-masters-007', 'Team Liquid', 1.75, 200, 350, 'won', now() - interval '21 days', now() - interval '20 days'),
('11111111-1111-1111-1111-111111111111', 'dota2-ti-2025-004', 'Azure Ray', 2.60, 100, 260, 'lost', now() - interval '19 days', now() - interval '18 days'),
('11111111-1111-1111-1111-111111111111', 'cs2-epl-004', 'Falcons', 2.00, 150, 300, 'won', now() - interval '17 days', now() - interval '16 days'),
('11111111-1111-1111-1111-111111111111', 'lol-lck-spring-007', 'NS RedForce', 2.40, 100, 240, 'won', now() - interval '15 days', now() - interval '14 days'),
('11111111-1111-1111-1111-111111111111', 'valorant-vct-007', 'EDward Gaming', 1.90, 200, 380, 'won', now() - interval '13 days', now() - interval '12 days'),
('11111111-1111-1111-1111-111111111111', 'cs2-blast-006', 'Aurora', 2.70, 150, 405, 'lost', now() - interval '11 days', now() - interval '10 days'),
('11111111-1111-1111-1111-111111111111', 'lol-msi-group-002', 'FlyQuest', 2.10, 100, 210, 'pending', now() - interval '1 day', NULL),

-- BlazeMaster predictions (58% win rate)
('66666666-6666-6666-6666-666666666666', 'lol-lec-spring-008', 'Excel', 2.90, 100, 290, 'lost', now() - interval '24 days', now() - interval '23 days'),
('66666666-6666-6666-6666-666666666666', 'cs2-major-paris-008', 'GamerLegion', 2.50, 150, 375, 'won', now() - interval '22 days', now() - interval '21 days'),
('66666666-6666-6666-6666-666666666666', 'valorant-masters-008', 'Talon', 2.80, 100, 280, 'lost', now() - interval '20 days', now() - interval '19 days'),
('66666666-6666-6666-6666-666666666666', 'dota2-major-004', 'BetBoom', 2.10, 200, 420, 'won', now() - interval '18 days', now() - interval '17 days'),
('66666666-6666-6666-6666-666666666666', 'cs2-iem-006', 'Lynn Vision', 3.20, 100, 320, 'lost', now() - interval '16 days', now() - interval '15 days'),
('66666666-6666-6666-6666-666666666666', 'lol-lck-spring-008', 'Hanwha Life', 1.80, 150, 270, 'won', now() - interval '14 days', now() - interval '13 days'),
('66666666-6666-6666-6666-666666666666', 'valorant-vct-008', 'DetonatioN', 2.60, 100, 260, 'won', now() - interval '12 days', now() - interval '11 days'),
('66666666-6666-6666-6666-666666666666', 'cs2-epl-005', 'TheMongolz', 2.30, 150, 345, 'lost', now() - interval '10 days', now() - interval '9 days'),
('66666666-6666-6666-6666-666666666666', 'lol-worlds-group-004', 'Team Vitality', 2.00, 100, 200, 'pending', now() - interval '2 days', NULL),

-- IronTitan predictions (56% win rate)
('88888888-8888-8888-8888-888888888888', 'cs2-blast-007', 'Nemiga', 3.00, 100, 300, 'lost', now() - interval '23 days', now() - interval '22 days'),
('88888888-8888-8888-8888-888888888888', 'lol-lec-spring-009', 'GIANTX', 2.70, 150, 405, 'lost', now() - interval '21 days', now() - interval '20 days'),
('88888888-8888-8888-8888-888888888888', 'valorant-masters-009', 'Zeta Division', 2.40, 100, 240, 'won', now() - interval '19 days', now() - interval '18 days'),
('88888888-8888-8888-8888-888888888888', 'dota2-ti-2025-005', 'Entity', 2.80, 200, 560, 'won', now() - interval '17 days', now() - interval '16 days'),
('88888888-8888-8888-8888-888888888888', 'cs2-major-paris-009', 'Wildcard', 3.50, 100, 350, 'lost', now() - interval '15 days', now() - interval '14 days'),
('88888888-8888-8888-8888-888888888888', 'lol-lck-spring-009', 'BNK FearX', 2.60, 150, 390, 'won', now() - interval '13 days', now() - interval '12 days'),
('88888888-8888-8888-8888-888888888888', 'valorant-vct-009', 'Rex Regum', 2.90, 100, 290, 'lost', now() - interval '11 days', now() - interval '10 days'),
('88888888-8888-8888-8888-888888888888', 'cs2-iem-007', 'Rare Atom', 2.20, 150, 330, 'pending', now() - interval '1 day', NULL),

-- CyberWolf predictions (55% win rate - beginner)
('33333333-3333-3333-3333-333333333333', 'lol-lec-spring-010', 'Team BDS', 2.50, 50, 125, 'won', now() - interval '20 days', now() - interval '19 days'),
('33333333-3333-3333-3333-333333333333', 'cs2-blast-008', 'Passion UA', 4.00, 100, 400, 'lost', now() - interval '18 days', now() - interval '17 days'),
('33333333-3333-3333-3333-333333333333', 'valorant-masters-010', 'Global Esports', 2.80, 75, 210, 'lost', now() - interval '16 days', now() - interval '15 days'),
('33333333-3333-3333-3333-333333333333', 'dota2-major-005', 'Xtreme Gaming', 2.30, 100, 230, 'won', now() - interval '14 days', now() - interval '13 days'),
('33333333-3333-3333-3333-333333333333', 'cs2-epl-006', 'FURIA', 1.90, 50, 95, 'won', now() - interval '12 days', now() - interval '11 days'),
('33333333-3333-3333-3333-333333333333', 'lol-lck-spring-010', 'OKSavingsBank', 3.00, 75, 225, 'lost', now() - interval '10 days', now() - interval '9 days'),
('33333333-3333-3333-3333-333333333333', 'valorant-vct-010', 'PRX', 1.70, 100, 170, 'pending', now() - interval '2 days', NULL);

-- =====================================================
-- 9. ENABLE REALTIME (optional - uncomment if needed)
-- =====================================================

-- ALTER PUBLICATION supabase_realtime ADD TABLE public.club_messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notifications;

-- =====================================================
-- DONE! Your database is ready with seed data.
-- =====================================================
