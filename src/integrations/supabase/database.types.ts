export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action_type: string;
          admin_id: string;
          created_at: string;
          details: Json | null;
          id: string;
          ip_address: string | null;
          target_id: string | null;
          target_type: string;
        };
        Insert: {
          action_type: string;
          admin_id: string;
          created_at?: string;
          details?: Json | null;
          id?: string;
          ip_address?: string | null;
          target_id?: string | null;
          target_type: string;
        };
        Update: {
          action_type?: string;
          admin_id?: string;
          created_at?: string;
          details?: Json | null;
          id?: string;
          ip_address?: string | null;
          target_id?: string | null;
          target_type?: string;
        };
        Relationships: [];
      };
      arena_ledger: {
        Row: {
          amount: number;
          created_at: string;
          description: string | null;
          id: number;
          reference_id: string | null;
          source: Database["public"]["Enums"]["arena_source"];
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          description?: string | null;
          id?: number;
          reference_id?: string | null;
          source: Database["public"]["Enums"]["arena_source"];
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          description?: string | null;
          id?: number;
          reference_id?: string | null;
          source?: Database["public"]["Enums"]["arena_source"];
          user_id?: string;
        };
        Relationships: [];
      };
      arena_prizes: {
        Row: {
          active: boolean | null;
          category: string | null;
          created_at: string;
          description: string | null;
          id: number;
          image_url: string | null;
          name: string;
          price_arena: number;
          sku: string;
          stock: number | null;
          updated_at: string;
          usd_value: number | null;
        };
        Insert: {
          active?: boolean | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          name: string;
          price_arena: number;
          sku: string;
          stock?: number | null;
          updated_at?: string;
          usd_value?: number | null;
        };
        Update: {
          active?: boolean | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          name?: string;
          price_arena?: number;
          sku?: string;
          stock?: number | null;
          updated_at?: string;
          usd_value?: number | null;
        };
        Relationships: [];
      };
      arena_transactions: {
        Row: {
          amount: number;
          balance_after: number;
          balance_before: number;
          created_at: string | null;
          id: string;
          ip_address: unknown;
          metadata: Json | null;
          reference_id: string | null;
          transaction_type: string;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          balance_after: number;
          balance_before: number;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown;
          metadata?: Json | null;
          reference_id?: string | null;
          transaction_type: string;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          balance_after?: number;
          balance_before?: number;
          created_at?: string | null;
          id?: string;
          ip_address?: unknown;
          metadata?: Json | null;
          reference_id?: string | null;
          transaction_type?: string;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      badges: {
        Row: {
          arena_points_reward: number;
          category: Database["public"]["Enums"]["badge_category"];
          created_at: string;
          description: string;
          icon: string;
          id: string;
          name: string;
          rarity: Database["public"]["Enums"]["badge_rarity"];
          requirement_type: string;
          requirement_value: number;
        };
        Insert: {
          arena_points_reward?: number;
          category: Database["public"]["Enums"]["badge_category"];
          created_at?: string;
          description: string;
          icon: string;
          id?: string;
          name: string;
          rarity?: Database["public"]["Enums"]["badge_rarity"];
          requirement_type: string;
          requirement_value?: number;
        };
        Update: {
          arena_points_reward?: number;
          category?: Database["public"]["Enums"]["badge_category"];
          created_at?: string;
          description?: string;
          icon?: string;
          id?: string;
          name?: string;
          rarity?: Database["public"]["Enums"]["badge_rarity"];
          requirement_type?: string;
          requirement_value?: number;
        };
        Relationships: [];
      };
      boss_damage: {
        Row: {
          boss_id: string | null;
          club_id: string | null;
          created_at: string | null;
          damage: number | null;
          id: string;
        };
        Insert: {
          boss_id?: string | null;
          club_id?: string | null;
          created_at?: string | null;
          damage?: number | null;
          id?: string;
        };
        Update: {
          boss_id?: string | null;
          club_id?: string | null;
          created_at?: string | null;
          damage?: number | null;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "boss_damage_boss_id_fkey";
            columns: ["boss_id"];
            isOneToOne: false;
            referencedRelation: "world_boss";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "boss_damage_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "boss_damage_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "boss_damage_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "boss_damage_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "boss_damage_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "boss_damage_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_activities: {
        Row: {
          activity_type: string;
          club_id: string;
          created_at: string;
          description: string | null;
          id: string;
          title: string;
          user_id: string | null;
          xp_amount: number | null;
        };
        Insert: {
          activity_type: string;
          club_id: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          title: string;
          user_id?: string | null;
          xp_amount?: number | null;
        };
        Update: {
          activity_type?: string;
          club_id?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          title?: string;
          user_id?: string | null;
          xp_amount?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "club_activities_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_activities_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_activities_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_activities_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_activities_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_activities_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_ban_appeals: {
        Row: {
          admin_response: string | null;
          club_id: string;
          created_at: string;
          id: string;
          reason: string;
          responded_at: string | null;
          responded_by: string | null;
          status: string;
          user_id: string;
        };
        Insert: {
          admin_response?: string | null;
          club_id: string;
          created_at?: string;
          id?: string;
          reason: string;
          responded_at?: string | null;
          responded_by?: string | null;
          status?: string;
          user_id: string;
        };
        Update: {
          admin_response?: string | null;
          club_id?: string;
          created_at?: string;
          id?: string;
          reason?: string;
          responded_at?: string | null;
          responded_by?: string | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_ban_appeals_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_ban_appeals_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_ban_appeals_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_ban_appeals_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_ban_appeals_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_ban_appeals_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_banned_members: {
        Row: {
          banned_at: string;
          banned_by: string;
          club_id: string;
          created_at: string;
          id: string;
          reason: string | null;
          user_id: string;
        };
        Insert: {
          banned_at?: string;
          banned_by: string;
          club_id: string;
          created_at?: string;
          id?: string;
          reason?: string | null;
          user_id: string;
        };
        Update: {
          banned_at?: string;
          banned_by?: string;
          club_id?: string;
          created_at?: string;
          id?: string;
          reason?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_banned_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_banned_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_banned_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_banned_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_banned_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_banned_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_challenge_contributions: {
        Row: {
          challenge_id: string;
          contribution_value: number;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          challenge_id: string;
          contribution_value?: number;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          challenge_id?: string;
          contribution_value?: number;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_challenge_contributions_challenge_id_fkey";
            columns: ["challenge_id"];
            isOneToOne: false;
            referencedRelation: "club_challenges";
            referencedColumns: ["id"];
          },
        ];
      };
      club_challenge_templates: {
        Row: {
          active: boolean;
          arena_points_reward: number;
          challenge_type: string;
          created_at: string;
          description: string;
          difficulty: string;
          duration_days: number;
          icon: string;
          id: string;
          target_value: number;
          title: string;
          xp_reward: number;
        };
        Insert: {
          active?: boolean;
          arena_points_reward?: number;
          challenge_type: string;
          created_at?: string;
          description: string;
          difficulty?: string;
          duration_days?: number;
          icon?: string;
          id?: string;
          target_value: number;
          title: string;
          xp_reward?: number;
        };
        Update: {
          active?: boolean;
          arena_points_reward?: number;
          challenge_type?: string;
          created_at?: string;
          description?: string;
          difficulty?: string;
          duration_days?: number;
          icon?: string;
          id?: string;
          target_value?: number;
          title?: string;
          xp_reward?: number;
        };
        Relationships: [];
      };
      club_challenges: {
        Row: {
          club_id: string;
          completed_at: string | null;
          created_at: string;
          current_value: number;
          end_date: string;
          id: string;
          rewards_claimed: boolean;
          start_date: string;
          status: string;
          target_value: number;
          template_id: string;
        };
        Insert: {
          club_id: string;
          completed_at?: string | null;
          created_at?: string;
          current_value?: number;
          end_date: string;
          id?: string;
          rewards_claimed?: boolean;
          start_date?: string;
          status?: string;
          target_value: number;
          template_id: string;
        };
        Update: {
          club_id?: string;
          completed_at?: string | null;
          created_at?: string;
          current_value?: number;
          end_date?: string;
          id?: string;
          rewards_claimed?: boolean;
          start_date?: string;
          status?: string;
          target_value?: number;
          template_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_challenges_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_challenges_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_challenges_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_challenges_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_challenges_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_challenges_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_challenges_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "club_challenge_templates";
            referencedColumns: ["id"];
          },
        ];
      };
      club_join_requests: {
        Row: {
          club_id: string;
          created_at: string;
          id: string;
          message: string | null;
          responded_at: string | null;
          status: string;
          user_id: string;
        };
        Insert: {
          club_id: string;
          created_at?: string;
          id?: string;
          message?: string | null;
          responded_at?: string | null;
          status?: string;
          user_id: string;
        };
        Update: {
          club_id?: string;
          created_at?: string;
          id?: string;
          message?: string | null;
          responded_at?: string | null;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_join_requests_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_join_requests_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_join_requests_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_join_requests_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_join_requests_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_join_requests_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_members: {
        Row: {
          club_id: string;
          id: string;
          joined_at: string;
          predictions_count: number;
          role: string;
          user_id: string;
          wins_count: number;
          xp_contributed: number;
        };
        Insert: {
          club_id: string;
          id?: string;
          joined_at?: string;
          predictions_count?: number;
          role?: string;
          user_id: string;
          wins_count?: number;
          xp_contributed?: number;
        };
        Update: {
          club_id?: string;
          id?: string;
          joined_at?: string;
          predictions_count?: number;
          role?: string;
          user_id?: string;
          wins_count?: number;
          xp_contributed?: number;
        };
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_message_reactions: {
        Row: {
          created_at: string;
          emoji: string;
          id: string;
          message_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          emoji: string;
          id?: string;
          message_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          emoji?: string;
          id?: string;
          message_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_message_reactions_message_id_fkey";
            columns: ["message_id"];
            isOneToOne: false;
            referencedRelation: "club_messages";
            referencedColumns: ["id"];
          },
        ];
      };
      club_messages: {
        Row: {
          club_id: string;
          content: string;
          created_at: string;
          file_name: string | null;
          file_type: string | null;
          file_url: string | null;
          id: string;
          is_pinned: boolean;
          message_type: string;
          pinned_at: string | null;
          pinned_by: string | null;
          reply_to_id: string | null;
          user_id: string;
        };
        Insert: {
          club_id: string;
          content: string;
          created_at?: string;
          file_name?: string | null;
          file_type?: string | null;
          file_url?: string | null;
          id?: string;
          is_pinned?: boolean;
          message_type?: string;
          pinned_at?: string | null;
          pinned_by?: string | null;
          reply_to_id?: string | null;
          user_id: string;
        };
        Update: {
          club_id?: string;
          content?: string;
          created_at?: string;
          file_name?: string | null;
          file_type?: string | null;
          file_url?: string | null;
          id?: string;
          is_pinned?: boolean;
          message_type?: string;
          pinned_at?: string | null;
          pinned_by?: string | null;
          reply_to_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_messages_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_messages_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_messages_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_messages_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_messages_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_messages_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_messages_reply_to_id_fkey";
            columns: ["reply_to_id"];
            isOneToOne: false;
            referencedRelation: "club_messages";
            referencedColumns: ["id"];
          },
        ];
      };
      club_moderation_logs: {
        Row: {
          action_type: string;
          club_id: string;
          created_at: string;
          id: string;
          message_author_name: string | null;
          message_content: string | null;
          moderator_id: string;
          target_message_id: string | null;
          target_user_id: string | null;
        };
        Insert: {
          action_type: string;
          club_id: string;
          created_at?: string;
          id?: string;
          message_author_name?: string | null;
          message_content?: string | null;
          moderator_id: string;
          target_message_id?: string | null;
          target_user_id?: string | null;
        };
        Update: {
          action_type?: string;
          club_id?: string;
          created_at?: string;
          id?: string;
          message_author_name?: string | null;
          message_content?: string | null;
          moderator_id?: string;
          target_message_id?: string | null;
          target_user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "club_moderation_logs_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_moderation_logs_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_moderation_logs_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_moderation_logs_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_moderation_logs_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_moderation_logs_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_muted_members: {
        Row: {
          club_id: string;
          created_at: string;
          expires_at: string;
          id: string;
          muted_at: string;
          muted_by: string;
          reason: string | null;
          user_id: string;
        };
        Insert: {
          club_id: string;
          created_at?: string;
          expires_at: string;
          id?: string;
          muted_at?: string;
          muted_by: string;
          reason?: string | null;
          user_id: string;
        };
        Update: {
          club_id?: string;
          created_at?: string;
          expires_at?: string;
          id?: string;
          muted_at?: string;
          muted_by?: string;
          reason?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_muted_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_muted_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_muted_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_muted_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_muted_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_muted_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_poll_options: {
        Row: {
          created_at: string;
          id: string;
          option_order: number;
          option_text: string;
          poll_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          option_order?: number;
          option_text: string;
          poll_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          option_order?: number;
          option_text?: string;
          poll_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_poll_options_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "club_polls";
            referencedColumns: ["id"];
          },
        ];
      };
      club_poll_votes: {
        Row: {
          created_at: string;
          id: string;
          option_id: string;
          poll_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          option_id: string;
          poll_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          option_id?: string;
          poll_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_poll_votes_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "club_poll_options";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_poll_votes_poll_id_fkey";
            columns: ["poll_id"];
            isOneToOne: false;
            referencedRelation: "club_polls";
            referencedColumns: ["id"];
          },
        ];
      };
      club_polls: {
        Row: {
          club_id: string;
          created_at: string;
          creator_id: string;
          ends_at: string | null;
          id: string;
          is_anonymous: boolean;
          is_closed: boolean;
          is_multiple_choice: boolean;
          message_id: string | null;
          question: string;
        };
        Insert: {
          club_id: string;
          created_at?: string;
          creator_id: string;
          ends_at?: string | null;
          id?: string;
          is_anonymous?: boolean;
          is_closed?: boolean;
          is_multiple_choice?: boolean;
          message_id?: string | null;
          question: string;
        };
        Update: {
          club_id?: string;
          created_at?: string;
          creator_id?: string;
          ends_at?: string | null;
          id?: string;
          is_anonymous?: boolean;
          is_closed?: boolean;
          is_multiple_choice?: boolean;
          message_id?: string | null;
          question?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_polls_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_polls_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_polls_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_polls_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_polls_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_polls_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_polls_message_id_fkey";
            columns: ["message_id"];
            isOneToOne: false;
            referencedRelation: "club_messages";
            referencedColumns: ["id"];
          },
        ];
      };
      club_rewards: {
        Row: {
          active: boolean;
          arena_points: number;
          badge_name: string | null;
          created_at: string;
          description: string | null;
          id: string;
          rank_from: number;
          rank_to: number;
          xp_bonus: number;
        };
        Insert: {
          active?: boolean;
          arena_points?: number;
          badge_name?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          rank_from: number;
          rank_to: number;
          xp_bonus?: number;
        };
        Update: {
          active?: boolean;
          arena_points?: number;
          badge_name?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          rank_from?: number;
          rank_to?: number;
          xp_bonus?: number;
        };
        Relationships: [];
      };
      club_rivalries: {
        Row: {
          club_a: string | null;
          club_b: string | null;
          created_at: string | null;
          id: string;
          rivalry_level: number | null;
          updated_at: string | null;
          wars_played: number | null;
          wins_a: number | null;
          wins_b: number | null;
        };
        Insert: {
          club_a?: string | null;
          club_b?: string | null;
          created_at?: string | null;
          id?: string;
          rivalry_level?: number | null;
          updated_at?: string | null;
          wars_played?: number | null;
          wins_a?: number | null;
          wins_b?: number | null;
        };
        Update: {
          club_a?: string | null;
          club_b?: string | null;
          created_at?: string | null;
          id?: string;
          rivalry_level?: number | null;
          updated_at?: string | null;
          wars_played?: number | null;
          wins_a?: number | null;
          wins_b?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "club_rivalries_club_a_fkey";
            columns: ["club_a"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_rivalries_club_a_fkey";
            columns: ["club_a"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_rivalries_club_a_fkey";
            columns: ["club_a"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_rivalries_club_a_fkey";
            columns: ["club_a"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_rivalries_club_a_fkey";
            columns: ["club_a"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_rivalries_club_a_fkey";
            columns: ["club_a"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_rivalries_club_b_fkey";
            columns: ["club_b"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_rivalries_club_b_fkey";
            columns: ["club_b"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_rivalries_club_b_fkey";
            columns: ["club_b"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_rivalries_club_b_fkey";
            columns: ["club_b"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_rivalries_club_b_fkey";
            columns: ["club_b"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_rivalries_club_b_fkey";
            columns: ["club_b"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_season_rankings: {
        Row: {
          club_id: string;
          created_at: string;
          id: string;
          rank: number | null;
          rewards_claimed: boolean;
          season_id: string;
          total_predictions: number;
          total_wins: number;
          total_xp: number;
          updated_at: string;
        };
        Insert: {
          club_id: string;
          created_at?: string;
          id?: string;
          rank?: number | null;
          rewards_claimed?: boolean;
          season_id: string;
          total_predictions?: number;
          total_wins?: number;
          total_xp?: number;
          updated_at?: string;
        };
        Update: {
          club_id?: string;
          created_at?: string;
          id?: string;
          rank?: number | null;
          rewards_claimed?: boolean;
          season_id?: string;
          total_predictions?: number;
          total_wins?: number;
          total_xp?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_season_rankings_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_season_rankings_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_season_rankings_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_season_rankings_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_season_rankings_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_season_rankings_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_season_rankings_season_id_fkey";
            columns: ["season_id"];
            isOneToOne: false;
            referencedRelation: "club_seasons";
            referencedColumns: ["id"];
          },
        ];
      };
      club_season_rewards: {
        Row: {
          active: boolean;
          arena_points: number;
          badge_name: string | null;
          created_at: string;
          id: string;
          rank_from: number;
          rank_to: number;
          xp_bonus: number;
        };
        Insert: {
          active?: boolean;
          arena_points?: number;
          badge_name?: string | null;
          created_at?: string;
          id?: string;
          rank_from: number;
          rank_to: number;
          xp_bonus?: number;
        };
        Update: {
          active?: boolean;
          arena_points?: number;
          badge_name?: string | null;
          created_at?: string;
          id?: string;
          rank_from?: number;
          rank_to?: number;
          xp_bonus?: number;
        };
        Relationships: [];
      };
      club_season_stats: {
        Row: {
          club_id: string | null;
          created_at: string | null;
          elo_rating: number | null;
          id: string;
          season_id: string | null;
          season_score: number | null;
          tier: string | null;
          updated_at: string | null;
          war_draws: number | null;
          war_losses: number | null;
          war_wins: number | null;
          war_xp: number | null;
        };
        Insert: {
          club_id?: string | null;
          created_at?: string | null;
          elo_rating?: number | null;
          id?: string;
          season_id?: string | null;
          season_score?: number | null;
          tier?: string | null;
          updated_at?: string | null;
          war_draws?: number | null;
          war_losses?: number | null;
          war_wins?: number | null;
          war_xp?: number | null;
        };
        Update: {
          club_id?: string | null;
          created_at?: string | null;
          elo_rating?: number | null;
          id?: string;
          season_id?: string | null;
          season_score?: number | null;
          tier?: string | null;
          updated_at?: string | null;
          war_draws?: number | null;
          war_losses?: number | null;
          war_wins?: number | null;
          war_xp?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "club_season_stats_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_season_stats_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_season_stats_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_season_stats_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_season_stats_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_season_stats_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_season_stats_season_id_fkey";
            columns: ["season_id"];
            isOneToOne: false;
            referencedRelation: "seasons";
            referencedColumns: ["id"];
          },
        ];
      };
      club_seasons: {
        Row: {
          created_at: string;
          end_date: string;
          id: string;
          name: string;
          start_date: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          end_date: string;
          id?: string;
          name: string;
          start_date?: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          end_date?: string;
          id?: string;
          name?: string;
          start_date?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      club_territories: {
        Row: {
          arena_bonus: number;
          capture_progress: number | null;
          continent: string | null;
          controlling_club_id: string | null;
          created_at: string;
          id: string;
          is_capital: boolean | null;
          map_key: string | null;
          map_x: number | null;
          map_y: number | null;
          name: string;
          prestige_bonus: number;
          region: string | null;
          siege_progress: number | null;
          slug: string;
          strategic_value: number | null;
          updated_at: string;
          x: number | null;
          xp_bonus: number;
          y: number | null;
        };
        Insert: {
          arena_bonus?: number;
          capture_progress?: number | null;
          continent?: string | null;
          controlling_club_id?: string | null;
          created_at?: string;
          id?: string;
          is_capital?: boolean | null;
          map_key?: string | null;
          map_x?: number | null;
          map_y?: number | null;
          name: string;
          prestige_bonus?: number;
          region?: string | null;
          siege_progress?: number | null;
          slug: string;
          strategic_value?: number | null;
          updated_at?: string;
          x?: number | null;
          xp_bonus?: number;
          y?: number | null;
        };
        Update: {
          arena_bonus?: number;
          capture_progress?: number | null;
          continent?: string | null;
          controlling_club_id?: string | null;
          created_at?: string;
          id?: string;
          is_capital?: boolean | null;
          map_key?: string | null;
          map_x?: number | null;
          map_y?: number | null;
          name?: string;
          prestige_bonus?: number;
          region?: string | null;
          siege_progress?: number | null;
          slug?: string;
          strategic_value?: number | null;
          updated_at?: string;
          x?: number | null;
          xp_bonus?: number;
          y?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "club_territories_controlling_club_id_fkey";
            columns: ["controlling_club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_territories_controlling_club_id_fkey";
            columns: ["controlling_club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_territories_controlling_club_id_fkey";
            columns: ["controlling_club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_territories_controlling_club_id_fkey";
            columns: ["controlling_club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_territories_controlling_club_id_fkey";
            columns: ["controlling_club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_territories_controlling_club_id_fkey";
            columns: ["controlling_club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_war_scores: {
        Row: {
          club_id: string;
          id: string;
          total_score: number | null;
          updated_at: string | null;
          war_id: string;
        };
        Insert: {
          club_id: string;
          id?: string;
          total_score?: number | null;
          updated_at?: string | null;
          war_id: string;
        };
        Update: {
          club_id?: string;
          id?: string;
          total_score?: number | null;
          updated_at?: string | null;
          war_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_war_scores_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_war_scores_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_war_scores_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_war_scores_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_war_scores_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_war_scores_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_war_scores_war_id_fkey";
            columns: ["war_id"];
            isOneToOne: false;
            referencedRelation: "active_club_wars";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_war_scores_war_id_fkey";
            columns: ["war_id"];
            isOneToOne: false;
            referencedRelation: "club_wars";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_war_scores_war_id_fkey";
            columns: ["war_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["war_id"];
          },
          {
            foreignKeyName: "club_war_scores_war_id_fkey";
            columns: ["war_id"];
            isOneToOne: false;
            referencedRelation: "live_club_war";
            referencedColumns: ["id"];
          },
        ];
      };
      club_wars: {
        Row: {
          challenger_id: string;
          challenger_predictions: number;
          challenger_wins: number;
          challenger_xp: number;
          created_at: string;
          defender_id: string;
          defender_predictions: number;
          defender_wins: number;
          defender_xp: number;
          end_date: string | null;
          id: string;
          season_id: string | null;
          start_date: string | null;
          status: string;
          territory_id: string | null;
          updated_at: string;
          winner_id: string | null;
          xp_reward: number;
        };
        Insert: {
          challenger_id: string;
          challenger_predictions?: number;
          challenger_wins?: number;
          challenger_xp?: number;
          created_at?: string;
          defender_id: string;
          defender_predictions?: number;
          defender_wins?: number;
          defender_xp?: number;
          end_date?: string | null;
          id?: string;
          season_id?: string | null;
          start_date?: string | null;
          status?: string;
          territory_id?: string | null;
          updated_at?: string;
          winner_id?: string | null;
          xp_reward?: number;
        };
        Update: {
          challenger_id?: string;
          challenger_predictions?: number;
          challenger_wins?: number;
          challenger_xp?: number;
          created_at?: string;
          defender_id?: string;
          defender_predictions?: number;
          defender_wins?: number;
          defender_xp?: number;
          end_date?: string | null;
          id?: string;
          season_id?: string | null;
          start_date?: string | null;
          status?: string;
          territory_id?: string | null;
          updated_at?: string;
          winner_id?: string | null;
          xp_reward?: number;
        };
        Relationships: [
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_season_id_fkey";
            columns: ["season_id"];
            isOneToOne: false;
            referencedRelation: "seasons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_territory_id_fkey";
            columns: ["territory_id"];
            isOneToOne: false;
            referencedRelation: "club_territories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_wars_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_wars_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_wars_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_weekly_rankings: {
        Row: {
          accuracy: number;
          club_id: string;
          created_at: string;
          final_rank: number | null;
          id: string;
          rewards_claimed: boolean;
          total_predictions: number;
          total_wins: number;
          total_xp: number;
          week_end: string;
          week_start: string;
        };
        Insert: {
          accuracy?: number;
          club_id: string;
          created_at?: string;
          final_rank?: number | null;
          id?: string;
          rewards_claimed?: boolean;
          total_predictions?: number;
          total_wins?: number;
          total_xp?: number;
          week_end: string;
          week_start: string;
        };
        Update: {
          accuracy?: number;
          club_id?: string;
          created_at?: string;
          final_rank?: number | null;
          id?: string;
          rewards_claimed?: boolean;
          total_predictions?: number;
          total_wins?: number;
          total_xp?: number;
          week_end?: string;
          week_start?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_weekly_rankings_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_weekly_rankings_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_weekly_rankings_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_weekly_rankings_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_weekly_rankings_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_weekly_rankings_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      clubs: {
        Row: {
          banner_url: string | null;
          created_at: string;
          description: string | null;
          discord_server_icon: string | null;
          discord_server_id: string | null;
          discord_server_name: string | null;
          id: string;
          is_public: boolean;
          logo_url: string | null;
          max_members: number;
          member_count: number;
          name: string;
          owner_id: string;
          slug: string;
          total_predictions: number;
          total_wins: number;
          total_xp: number;
          updated_at: string;
        };
        Insert: {
          banner_url?: string | null;
          created_at?: string;
          description?: string | null;
          discord_server_icon?: string | null;
          discord_server_id?: string | null;
          discord_server_name?: string | null;
          id?: string;
          is_public?: boolean;
          logo_url?: string | null;
          max_members?: number;
          member_count?: number;
          name: string;
          owner_id: string;
          slug: string;
          total_predictions?: number;
          total_wins?: number;
          total_xp?: number;
          updated_at?: string;
        };
        Update: {
          banner_url?: string | null;
          created_at?: string;
          description?: string | null;
          discord_server_icon?: string | null;
          discord_server_id?: string | null;
          discord_server_name?: string | null;
          id?: string;
          is_public?: boolean;
          logo_url?: string | null;
          max_members?: number;
          member_count?: number;
          name?: string;
          owner_id?: string;
          slug?: string;
          total_predictions?: number;
          total_wins?: number;
          total_xp?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      cosmetics: {
        Row: {
          created_at: string | null;
          id: string;
          name: string | null;
          rarity: string | null;
          type: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name?: string | null;
          rarity?: string | null;
          type?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string | null;
          rarity?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
      daily_challenges: {
        Row: {
          active: boolean;
          challenge_type: string;
          created_at: string;
          description: string;
          icon: string;
          id: string;
          requirement_value: number;
          title: string;
          xp_reward: number;
        };
        Insert: {
          active?: boolean;
          challenge_type: string;
          created_at?: string;
          description: string;
          icon?: string;
          id?: string;
          requirement_value?: number;
          title: string;
          xp_reward?: number;
        };
        Update: {
          active?: boolean;
          challenge_type?: string;
          created_at?: string;
          description?: string;
          icon?: string;
          id?: string;
          requirement_value?: number;
          title?: string;
          xp_reward?: number;
        };
        Relationships: [];
      };
      level_rewards: {
        Row: {
          created_at: string;
          description: string;
          icon: string;
          id: string;
          level_required: number;
          rarity: string;
          reward_type: string;
          reward_value: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          icon?: string;
          id?: string;
          level_required: number;
          rarity?: string;
          reward_type: string;
          reward_value: string;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          icon?: string;
          id?: string;
          level_required?: number;
          rarity?: string;
          reward_type?: string;
          reward_value?: string;
          title?: string;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          external_id: string | null;
          id: string;
          resolved: boolean | null;
          resolved_at: string | null;
          resolved_by: string | null;
          team_a: string | null;
          team_b: string | null;
          winner: string | null;
        };
        Insert: {
          external_id?: string | null;
          id?: string;
          resolved?: boolean | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          team_a?: string | null;
          team_b?: string | null;
          winner?: string | null;
        };
        Update: {
          external_id?: string | null;
          id?: string;
          resolved?: boolean | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          team_a?: string | null;
          team_b?: string | null;
          winner?: string | null;
        };
        Relationships: [];
      };
      player_cosmetics: {
        Row: {
          cosmetic_id: string | null;
          created_at: string | null;
          equipped: boolean | null;
          id: string;
          user_id: string | null;
        };
        Insert: {
          cosmetic_id?: string | null;
          created_at?: string | null;
          equipped?: boolean | null;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          cosmetic_id?: string | null;
          created_at?: string | null;
          equipped?: boolean | null;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "player_cosmetics_cosmetic_id_fkey";
            columns: ["cosmetic_id"];
            isOneToOne: false;
            referencedRelation: "cosmetics";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "player_cosmetics_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      player_prestige: {
        Row: {
          created_at: string | null;
          id: string;
          level: number | null;
          prestige: number | null;
          user_id: string | null;
          xp: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          level?: number | null;
          prestige?: number | null;
          user_id?: string | null;
          xp?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          level?: number | null;
          prestige?: number | null;
          user_id?: string | null;
          xp?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "player_prestige_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      predictions: {
        Row: {
          created_at: string;
          id: string;
          match_id: string;
          odds: number;
          potential_winnings: number;
          resolved_at: string | null;
          selected_team: string;
          stake_amount: number;
          status: string;
          user_id: string;
          xp_awarded: boolean | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          match_id: string;
          odds: number;
          potential_winnings: number;
          resolved_at?: string | null;
          selected_team: string;
          stake_amount: number;
          status?: string;
          user_id: string;
          xp_awarded?: boolean | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          match_id?: string;
          odds?: number;
          potential_winnings?: number;
          resolved_at?: string | null;
          selected_team?: string;
          stake_amount?: number;
          status?: string;
          user_id?: string;
          xp_awarded?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "predictions_match_fk";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["external_id"];
          },
        ];
      };
      prize_redemptions: {
        Row: {
          created_at: string;
          delivery_info: Json | null;
          id: string;
          notes: string | null;
          price_paid: number;
          prize_id: number;
          prize_name: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          delivery_info?: Json | null;
          id?: string;
          notes?: string | null;
          price_paid: number;
          prize_id: number;
          prize_name: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          delivery_info?: Json | null;
          id?: string;
          notes?: string | null;
          price_paid?: number;
          prize_id?: number;
          prize_name?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prize_redemptions_prize_id_fkey";
            columns: ["prize_id"];
            isOneToOne: false;
            referencedRelation: "arena_prizes";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          discord_id: string | null;
          display_name: string | null;
          id: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          discord_id?: string | null;
          display_name?: string | null;
          id: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          discord_id?: string | null;
          display_name?: string | null;
          id?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      rate_limits: {
        Row: {
          action_count: number | null;
          action_type: string;
          id: string;
          user_id: string;
          window_start: string | null;
        };
        Insert: {
          action_count?: number | null;
          action_type: string;
          id?: string;
          user_id: string;
          window_start?: string | null;
        };
        Update: {
          action_count?: number | null;
          action_type?: string;
          id?: string;
          user_id?: string;
          window_start?: string | null;
        };
        Relationships: [];
      };
      referral_codes: {
        Row: {
          code: string | null;
          created_at: string | null;
          id: string;
          user_id: string | null;
          uses: number | null;
        };
        Insert: {
          code?: string | null;
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
          uses?: number | null;
        };
        Update: {
          code?: string | null;
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
          uses?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "referral_codes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      referrals: {
        Row: {
          created_at: string | null;
          id: string;
          referred_user_id: string | null;
          referrer_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          referred_user_id?: string | null;
          referrer_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          referred_user_id?: string | null;
          referrer_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "referrals_referred_user_id_fkey";
            columns: ["referred_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey";
            columns: ["referrer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      season_club_scores: {
        Row: {
          club_id: string | null;
          created_at: string | null;
          id: string;
          season_id: string | null;
          territories: number | null;
          war_wins: number | null;
          xp: number | null;
        };
        Insert: {
          club_id?: string | null;
          created_at?: string | null;
          id?: string;
          season_id?: string | null;
          territories?: number | null;
          war_wins?: number | null;
          xp?: number | null;
        };
        Update: {
          club_id?: string | null;
          created_at?: string | null;
          id?: string;
          season_id?: string | null;
          territories?: number | null;
          war_wins?: number | null;
          xp?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "season_club_scores_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "season_club_scores_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "season_club_scores_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "season_club_scores_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "season_club_scores_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "season_club_scores_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "season_club_scores_season_id_fkey";
            columns: ["season_id"];
            isOneToOne: false;
            referencedRelation: "seasons";
            referencedColumns: ["id"];
          },
        ];
      };
      season_hall_of_fame: {
        Row: {
          created_at: string | null;
          id: string;
          rank: number;
          reward: number;
          season_id: string;
          season_name: string;
          user_id: string;
          username: string | null;
          xp: number;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          rank: number;
          reward: number;
          season_id: string;
          season_name: string;
          user_id: string;
          username?: string | null;
          xp: number;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          rank?: number;
          reward?: number;
          season_id?: string;
          season_name?: string;
          user_id?: string;
          username?: string | null;
          xp?: number;
        };
        Relationships: [];
      };
      season_xp: {
        Row: {
          created_at: string | null;
          id: string;
          level: number | null;
          season_id: string | null;
          updated_at: string | null;
          user_id: string | null;
          xp: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          level?: number | null;
          season_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          xp?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          level?: number | null;
          season_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          xp?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "season_xp_season_id_fkey";
            columns: ["season_id"];
            isOneToOne: false;
            referencedRelation: "seasons";
            referencedColumns: ["id"];
          },
        ];
      };
      seasons: {
        Row: {
          created_at: string | null;
          end_date: string;
          id: string;
          is_active: boolean | null;
          name: string;
          start_date: string;
          status: string | null;
        };
        Insert: {
          created_at?: string | null;
          end_date: string;
          id?: string;
          is_active?: boolean | null;
          name: string;
          start_date: string;
          status?: string | null;
        };
        Update: {
          created_at?: string | null;
          end_date?: string;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          start_date?: string;
          status?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          created_at: string | null;
          current_period_end: string | null;
          id: string;
          status: string | null;
          stripe_customer_id: string | null;
          stripe_price_id: string | null;
          stripe_subscription_id: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          current_period_end?: string | null;
          id?: string;
          status?: string | null;
          stripe_customer_id?: string | null;
          stripe_price_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          current_period_end?: string | null;
          id?: string;
          status?: string | null;
          stripe_customer_id?: string | null;
          stripe_price_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      support_inquiries: {
        Row: {
          category: string;
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          resolved_at: string | null;
          status: string;
          subject: string;
          user_id: string | null;
        };
        Insert: {
          category?: string;
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          resolved_at?: string | null;
          status?: string;
          subject: string;
          user_id?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          resolved_at?: string | null;
          status?: string;
          subject?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      territory_connections: {
        Row: {
          created_at: string | null;
          id: string;
          territory_a: string | null;
          territory_b: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          territory_a?: string | null;
          territory_b?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          territory_a?: string | null;
          territory_b?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "territory_connections_territory_a_fkey";
            columns: ["territory_a"];
            isOneToOne: false;
            referencedRelation: "club_territories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "territory_connections_territory_b_fkey";
            columns: ["territory_b"];
            isOneToOne: false;
            referencedRelation: "club_territories";
            referencedColumns: ["id"];
          },
        ];
      };
      user_badges: {
        Row: {
          badge_type: string;
          created_at: string | null;
          id: string;
          season_id: string | null;
          user_id: string | null;
        };
        Insert: {
          badge_type: string;
          created_at?: string | null;
          id?: string;
          season_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          badge_type?: string;
          created_at?: string | null;
          id?: string;
          season_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_badges_season_id_fkey";
            columns: ["season_id"];
            isOneToOne: false;
            referencedRelation: "seasons";
            referencedColumns: ["id"];
          },
        ];
      };
      user_daily_challenges: {
        Row: {
          challenge_date: string;
          challenge_id: string;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          id: string;
          progress: number;
          user_id: string;
          xp_claimed: boolean;
        };
        Insert: {
          challenge_date?: string;
          challenge_id: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          progress?: number;
          user_id: string;
          xp_claimed?: boolean;
        };
        Update: {
          challenge_date?: string;
          challenge_id?: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          progress?: number;
          user_id?: string;
          xp_claimed?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "user_daily_challenges_challenge_id_fkey";
            columns: ["challenge_id"];
            isOneToOne: false;
            referencedRelation: "daily_challenges";
            referencedColumns: ["id"];
          },
        ];
      };
      user_level_rewards: {
        Row: {
          claimed_at: string;
          id: string;
          reward_id: string;
          user_id: string;
        };
        Insert: {
          claimed_at?: string;
          id?: string;
          reward_id: string;
          user_id: string;
        };
        Update: {
          claimed_at?: string;
          id?: string;
          reward_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_level_rewards_reward_id_fkey";
            columns: ["reward_id"];
            isOneToOne: false;
            referencedRelation: "level_rewards";
            referencedColumns: ["id"];
          },
        ];
      };
      user_notifications: {
        Row: {
          created_at: string;
          id: string;
          is_read: boolean;
          message: string;
          payload: Json | null;
          title: string;
          type: string;
          user_id: string;
          value: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_read?: boolean;
          message: string;
          payload?: Json | null;
          title: string;
          type: string;
          user_id: string;
          value?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_read?: boolean;
          message?: string;
          payload?: Json | null;
          title?: string;
          type?: string;
          user_id?: string;
          value?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      user_season_tiers: {
        Row: {
          season_id: string;
          tier: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          season_id: string;
          tier: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          season_id?: string;
          tier?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      v_matches: {
        Row: {
          json_agg: Json | null;
        };
        Insert: {
          json_agg?: Json | null;
        };
        Update: {
          json_agg?: Json | null;
        };
        Relationships: [];
      };
      war_contributions: {
        Row: {
          club_id: string | null;
          created_at: string | null;
          id: string;
          user_id: string | null;
          war_id: string | null;
          xp: number | null;
        };
        Insert: {
          club_id?: string | null;
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
          war_id?: string | null;
          xp?: number | null;
        };
        Update: {
          club_id?: string | null;
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
          war_id?: string | null;
          xp?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "war_contributions_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "war_contributions_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "war_contributions_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "war_contributions_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "war_contributions_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "war_contributions_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "war_contributions_war_id_fkey";
            columns: ["war_id"];
            isOneToOne: false;
            referencedRelation: "active_club_wars";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "war_contributions_war_id_fkey";
            columns: ["war_id"];
            isOneToOne: false;
            referencedRelation: "club_wars";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "war_contributions_war_id_fkey";
            columns: ["war_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["war_id"];
          },
          {
            foreignKeyName: "war_contributions_war_id_fkey";
            columns: ["war_id"];
            isOneToOne: false;
            referencedRelation: "live_club_war";
            referencedColumns: ["id"];
          },
        ];
      };
      weekly_rankings: {
        Row: {
          accuracy: number;
          arena_score: number;
          created_at: string;
          final_rank: number | null;
          id: string;
          predictions_count: number;
          rewards_claimed: boolean;
          user_id: string;
          week_end: string;
          week_start: string;
        };
        Insert: {
          accuracy?: number;
          arena_score?: number;
          created_at?: string;
          final_rank?: number | null;
          id?: string;
          predictions_count?: number;
          rewards_claimed?: boolean;
          user_id: string;
          week_end: string;
          week_start: string;
        };
        Update: {
          accuracy?: number;
          arena_score?: number;
          created_at?: string;
          final_rank?: number | null;
          id?: string;
          predictions_count?: number;
          rewards_claimed?: boolean;
          user_id?: string;
          week_end?: string;
          week_start?: string;
        };
        Relationships: [];
      };
      weekly_rewards: {
        Row: {
          active: boolean;
          arena_points: number;
          badge_id: string | null;
          created_at: string;
          description: string | null;
          id: string;
          rank_from: number;
          rank_to: number;
        };
        Insert: {
          active?: boolean;
          arena_points: number;
          badge_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          rank_from: number;
          rank_to: number;
        };
        Update: {
          active?: boolean;
          arena_points?: number;
          badge_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          rank_from?: number;
          rank_to?: number;
        };
        Relationships: [
          {
            foreignKeyName: "weekly_rewards_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "badges";
            referencedColumns: ["id"];
          },
        ];
      };
      world_boss: {
        Row: {
          created_at: string | null;
          current_hp: number;
          id: string;
          max_hp: number;
          name: string;
          status: string | null;
        };
        Insert: {
          created_at?: string | null;
          current_hp: number;
          id?: string;
          max_hp: number;
          name: string;
          status?: string | null;
        };
        Update: {
          created_at?: string | null;
          current_hp?: number;
          id?: string;
          max_hp?: number;
          name?: string;
          status?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      active_club_wars: {
        Row: {
          challenger_id: string | null;
          challenger_predictions: number | null;
          challenger_wins: number | null;
          challenger_xp: number | null;
          created_at: string | null;
          defender_id: string | null;
          defender_predictions: number | null;
          defender_wins: number | null;
          defender_xp: number | null;
          end_date: string | null;
          id: string | null;
          start_date: string | null;
          status: string | null;
          updated_at: string | null;
          winner_id: string | null;
          xp_reward: number | null;
        };
        Insert: {
          challenger_id?: string | null;
          challenger_predictions?: number | null;
          challenger_wins?: number | null;
          challenger_xp?: number | null;
          created_at?: string | null;
          defender_id?: string | null;
          defender_predictions?: number | null;
          defender_wins?: number | null;
          defender_xp?: number | null;
          end_date?: string | null;
          id?: string | null;
          start_date?: string | null;
          status?: string | null;
          updated_at?: string | null;
          winner_id?: string | null;
          xp_reward?: number | null;
        };
        Update: {
          challenger_id?: string | null;
          challenger_predictions?: number | null;
          challenger_wins?: number | null;
          challenger_xp?: number | null;
          created_at?: string | null;
          defender_id?: string | null;
          defender_predictions?: number | null;
          defender_wins?: number | null;
          defender_xp?: number | null;
          end_date?: string | null;
          id?: string | null;
          start_date?: string | null;
          status?: string | null;
          updated_at?: string | null;
          winner_id?: string | null;
          xp_reward?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_wars_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_wars_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_wars_winner_id_fkey";
            columns: ["winner_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_leaderboard: {
        Row: {
          accuracy: number | null;
          id: string | null;
          name: string | null;
          slug: string | null;
          total_predictions: number | null;
          total_wins: number | null;
          total_xp: number | null;
        };
        Insert: {
          accuracy?: never;
          id?: string | null;
          name?: string | null;
          slug?: string | null;
          total_predictions?: number | null;
          total_wins?: number | null;
          total_xp?: number | null;
        };
        Update: {
          accuracy?: never;
          id?: string | null;
          name?: string | null;
          slug?: string | null;
          total_predictions?: number | null;
          total_wins?: number | null;
          total_xp?: number | null;
        };
        Relationships: [];
      };
      club_season_leaderboard: {
        Row: {
          club_id: string | null;
          club_name: string | null;
          rank: number | null;
          season_id: string | null;
          season_score: number | null;
          tier: string | null;
          war_draws: number | null;
          war_losses: number | null;
          war_wins: number | null;
          war_xp: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "club_season_stats_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_season_stats_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_season_stats_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_season_stats_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_season_stats_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_season_stats_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_season_stats_season_id_fkey";
            columns: ["season_id"];
            isOneToOne: false;
            referencedRelation: "seasons";
            referencedColumns: ["id"];
          },
        ];
      };
      club_stats: {
        Row: {
          accuracy: number | null;
          id: string | null;
          member_count: number | null;
          name: string | null;
          slug: string | null;
          total_predictions: number | null;
          total_wins: number | null;
          total_xp: number | null;
        };
        Relationships: [];
      };
      club_territory_leaderboard: {
        Row: {
          club_id: string | null;
          club_name: string | null;
          territories_count: number | null;
          total_arena_bonus: number | null;
          total_prestige_bonus: number | null;
          total_xp_bonus: number | null;
        };
        Relationships: [];
      };
      club_top_members: {
        Row: {
          club_id: string | null;
          rank: number | null;
          user_id: string | null;
          xp_contributed: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      club_wars_live: {
        Row: {
          challenger_id: string | null;
          challenger_name: string | null;
          challenger_xp: number | null;
          created_at: string | null;
          defender_id: string | null;
          defender_name: string | null;
          defender_xp: number | null;
          leader: string | null;
          status: string | null;
          war_id: string | null;
        };
        Relationships: [];
      };
      hall_of_fame_public: {
        Row: {
          created_at: string | null;
          rank: number | null;
          reward: number | null;
          season_name: string | null;
          username: string | null;
          xp: number | null;
        };
        Insert: {
          created_at?: string | null;
          rank?: number | null;
          reward?: number | null;
          season_name?: string | null;
          username?: string | null;
          xp?: number | null;
        };
        Update: {
          created_at?: string | null;
          rank?: number | null;
          reward?: number | null;
          season_name?: string | null;
          username?: string | null;
          xp?: number | null;
        };
        Relationships: [];
      };
      live_club_war: {
        Row: {
          challenger_id: string | null;
          challenger_name: string | null;
          challenger_predictions: number | null;
          challenger_wins: number | null;
          challenger_xp: number | null;
          defender_id: string | null;
          defender_name: string | null;
          defender_predictions: number | null;
          defender_wins: number | null;
          defender_xp: number | null;
          id: string | null;
          start_date: string | null;
          status: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_wars_challenger_id_fkey";
            columns: ["challenger_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_leaderboard";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_territory_leaderboard";
            referencedColumns: ["club_id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["challenger_id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "club_wars_live";
            referencedColumns: ["defender_id"];
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey";
            columns: ["defender_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      user_balances: {
        Row: {
          calculated_balance: number | null;
          user_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      add_arena_balance: {
        Args: {
          p_amount: number;
          p_metadata?: Json;
          p_reference_id?: string;
          p_transaction_type: string;
        };
        Returns: Json;
      };
      add_arena_secure: {
        Args: {
          p_amount: number;
          p_description?: string;
          p_reference_id?: string;
          p_source: Database["public"]["Enums"]["arena_source"];
        };
        Returns: Json;
      };
      add_club_xp: {
        Args: { p_user_id: string; p_xp: number };
        Returns: undefined;
      };
      add_war_contribution:
        | {
            Args: {
              p_club: string;
              p_user: string;
              p_war: string;
              p_xp: number;
            };
            Returns: undefined;
          }
        | {
            Args: { p_user: string; p_war: string; p_xp: number };
            Returns: undefined;
          };
      add_xp: { Args: { p_amount: number; p_user_id: string }; Returns: Json };
      apply_boss_damage: {
        Args: { p_club_id: string; p_damage: number };
        Returns: undefined;
      };
      apply_club_promotions: {
        Args: { p_season_id: string };
        Returns: undefined;
      };
      apply_war_xp: {
        Args: { p_club_id: string; p_xp: number };
        Returns: undefined;
      };
      approve_join_request: { Args: { p_request_id: string }; Returns: Json };
      auth_role_test: { Args: never; Returns: string };
      can_invade_territory: {
        Args: { p_club_id: string; p_target_territory: string };
        Returns: boolean;
      };
      capture_territory: {
        Args: { p_club_id: string; p_territory_id: string };
        Returns: Json;
      };
      check_and_reward_tier_upgrade: {
        Args: { p_new_tier: string; p_season_id: string; p_user_id: string };
        Returns: undefined;
      };
      check_rate_limit: {
        Args: { p_action_type: string; p_max_per_hour: number };
        Returns: boolean;
      };
      claim_club_challenge_reward: {
        Args: { p_challenge_id: string };
        Returns: Json;
      };
      claim_club_season_reward: {
        Args: { p_ranking_id: string };
        Returns: Json;
      };
      cleanup_rate_limits: { Args: never; Returns: undefined };
      complete_daily_challenge_reward: {
        Args: { p_xp_reward?: number };
        Returns: Json;
      };
      create_auto_war: {
        Args: { p_club_id: string; p_duration_hours?: number };
        Returns: Json;
      };
      create_club_war: { Args: { p_club_id: string }; Returns: Json };
      create_join_request: {
        Args: { p_club_id: string; p_message?: string };
        Returns: Json;
      };
      create_prediction_secure: {
        Args: {
          p_match_id: string;
          p_odds: number;
          p_selected_team: string;
          p_stake_amount: number;
        };
        Returns: Json;
      };
      end_club_season: { Args: never; Returns: undefined };
      end_current_season: { Args: never; Returns: Json };
      end_expired_club_wars: { Args: never; Returns: undefined };
      end_expired_wars: { Args: never; Returns: undefined };
      end_season: { Args: never; Returns: undefined };
      ensure_owner_membership: { Args: { p_club_id: string }; Returns: Json };
      find_opponent: { Args: { p_club_id: string }; Returns: string };
      find_war_opponent: { Args: { p_club_id: string }; Returns: string };
      finish_active_club_season: { Args: never; Returns: Json };
      finish_expired_wars: { Args: never; Returns: undefined };
      generate_referral_code: { Args: { p_user: string }; Returns: string };
      generate_weekly_club_rankings: { Args: never; Returns: undefined };
      get_arena_balance: { Args: never; Returns: Json };
      get_attackable_territories: {
        Args: { p_club: string };
        Returns: {
          territory_id: string;
        }[];
      };
      get_club_detail: { Args: { p_slug: string }; Returns: Json };
      get_club_leaderboard: {
        Args: never;
        Returns: {
          capitals: number;
          club_id: string;
          club_name: string;
          territories: number;
          wins: number;
        }[];
      };
      get_dashboard_data: { Args: { p_user_id: string }; Returns: Json };
      get_player_leaderboard: {
        Args: never;
        Returns: {
          username: string;
          xp: number;
        }[];
      };
      get_player_level: { Args: { p_xp: number }; Returns: number };
      get_season_leaderboard: {
        Args: never;
        Returns: {
          avatar_url: string;
          current_level: number;
          rank: number;
          tier: string;
          user_id: string;
          username: string;
          xp: number;
        }[];
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      increment_club_war_xp: {
        Args: { p_club_id: string; p_xp: number };
        Returns: undefined;
      };
      is_user_banned: {
        Args: { p_club_id: string; p_user_id: string };
        Returns: boolean;
      };
      is_user_muted: {
        Args: { p_club_id: string; p_user_id: string };
        Returns: boolean;
      };
      recalculate_club_tier: {
        Args: { p_club_id: string; p_season_id: string };
        Returns: undefined;
      };
      redeem_prize: { Args: { p_prize_id: number }; Returns: Json };
      redeem_prize_secure: { Args: { p_prize_id: number }; Returns: Json };
      resolve_match: {
        Args: { p_match_id: string; p_winning_team: string };
        Returns: Json;
      };
      resolve_prediction: {
        Args: { p_prediction_id: string; p_won: boolean };
        Returns: Json;
      };
      resolve_territory_war: { Args: { p_war: string }; Returns: Json };
      reward_war_winner_with_territory: {
        Args: { p_winner_club_id: string };
        Returns: Json;
      };
      spend_arena_balance: {
        Args: {
          p_amount: number;
          p_metadata?: Json;
          p_reference_id?: string;
          p_transaction_type: string;
        };
        Returns: Json;
      };
      spend_arena_secure: {
        Args: {
          p_amount: number;
          p_description?: string;
          p_reference_id?: string;
          p_source: Database["public"]["Enums"]["arena_source"];
        };
        Returns: Json;
      };
      start_club_challenge: {
        Args: { p_club_id: string; p_template_id: string };
        Returns: Json;
      };
      start_club_season: {
        Args: { p_duration_days?: number; p_name: string };
        Returns: Json;
      };
      start_club_war: { Args: { p_club_id: string }; Returns: Json };
      start_new_season:
        | { Args: { p_name: string }; Returns: string }
        | { Args: { p_duration_days?: number; p_name: string }; Returns: Json };
      start_territory_war: {
        Args: { p_attacker_club: string; p_territory: string };
        Returns: Json;
      };
      update_club_elo: {
        Args: {
          p_club_a: string;
          p_club_b: string;
          p_season_id: string;
          p_winner: string;
        };
        Returns: undefined;
      };
      update_club_rivalry: {
        Args: { p_club_a: string; p_club_b: string; p_winner: string };
        Returns: undefined;
      };
      use_referral_code: {
        Args: { p_code: string; p_user: string };
        Returns: Json;
      };
      xp_for_level: { Args: { level_num: number }; Returns: number };
    };
    Enums: {
      app_role: "admin" | "moderator" | "user";
      arena_source:
        | "purchase"
        | "contest_refill"
        | "refund"
        | "prize"
        | "manual"
        | "prediction_win"
        | "prediction_loss"
        | "staking_reward"
        | "season_reward";
      badge_category:
        | "prediction"
        | "streak"
        | "engagement"
        | "achievement"
        | "special";
      badge_rarity: "common" | "rare" | "epic" | "legendary";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      arena_source: [
        "purchase",
        "contest_refill",
        "refund",
        "prize",
        "manual",
        "prediction_win",
        "prediction_loss",
        "staking_reward",
        "season_reward",
      ],
      badge_category: [
        "prediction",
        "streak",
        "engagement",
        "achievement",
        "special",
      ],
      badge_rarity: ["common", "rare", "epic", "legendary"],
    },
  },
} as const;
