export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          target_id: string | null
          target_type: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      arena_ledger: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: number
          reference_id: string | null
          source: Database["public"]["Enums"]["arena_source"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: number
          reference_id?: string | null
          source: Database["public"]["Enums"]["arena_source"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: number
          reference_id?: string | null
          source?: Database["public"]["Enums"]["arena_source"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "arena_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "arena_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_leaderboard"
            referencedColumns: ["user_id"]
          },
        ]
      }
      arena_prizes: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          name: string
          price_arena: number
          sku: string
          stock: number | null
          updated_at: string
          usd_value: number | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name: string
          price_arena: number
          sku: string
          stock?: number | null
          updated_at?: string
          usd_value?: number | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          price_arena?: number
          sku?: string
          stock?: number | null
          updated_at?: string
          usd_value?: number | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          arena_points_reward: number
          category: Database["public"]["Enums"]["badge_category"]
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          rarity: Database["public"]["Enums"]["badge_rarity"]
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          arena_points_reward?: number
          category: Database["public"]["Enums"]["badge_category"]
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          rarity?: Database["public"]["Enums"]["badge_rarity"]
          requirement_type: string
          requirement_value?: number
        }
        Update: {
          arena_points_reward?: number
          category?: Database["public"]["Enums"]["badge_category"]
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          rarity?: Database["public"]["Enums"]["badge_rarity"]
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      club_activities: {
        Row: {
          activity_type: string
          club_id: string
          created_at: string
          description: string | null
          id: string
          title: string
          user_id: string | null
          xp_amount: number | null
        }
        Insert: {
          activity_type: string
          club_id: string
          created_at?: string
          description?: string | null
          id?: string
          title: string
          user_id?: string | null
          xp_amount?: number | null
        }
        Update: {
          activity_type?: string
          club_id?: string
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          user_id?: string | null
          xp_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "club_activities_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_ban_appeals: {
        Row: {
          admin_response: string | null
          club_id: string
          created_at: string
          id: string
          reason: string
          responded_at: string | null
          responded_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          club_id: string
          created_at?: string
          id?: string
          reason: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          club_id?: string
          created_at?: string
          id?: string
          reason?: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_ban_appeals_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_banned_members: {
        Row: {
          banned_at: string
          banned_by: string
          club_id: string
          created_at: string
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          banned_at?: string
          banned_by: string
          club_id: string
          created_at?: string
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          banned_at?: string
          banned_by?: string
          club_id?: string
          created_at?: string
          id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_banned_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_challenge_contributions: {
        Row: {
          challenge_id: string
          contribution_value: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          contribution_value?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          contribution_value?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_challenge_contributions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "club_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      club_challenge_templates: {
        Row: {
          active: boolean
          arena_points_reward: number
          challenge_type: string
          created_at: string
          description: string
          difficulty: string
          duration_days: number
          icon: string
          id: string
          target_value: number
          title: string
          xp_reward: number
        }
        Insert: {
          active?: boolean
          arena_points_reward?: number
          challenge_type: string
          created_at?: string
          description: string
          difficulty?: string
          duration_days?: number
          icon?: string
          id?: string
          target_value: number
          title: string
          xp_reward?: number
        }
        Update: {
          active?: boolean
          arena_points_reward?: number
          challenge_type?: string
          created_at?: string
          description?: string
          difficulty?: string
          duration_days?: number
          icon?: string
          id?: string
          target_value?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      club_challenges: {
        Row: {
          club_id: string
          completed_at: string | null
          created_at: string
          current_value: number
          end_date: string
          id: string
          rewards_claimed: boolean
          start_date: string
          status: string
          target_value: number
          template_id: string
        }
        Insert: {
          club_id: string
          completed_at?: string | null
          created_at?: string
          current_value?: number
          end_date: string
          id?: string
          rewards_claimed?: boolean
          start_date?: string
          status?: string
          target_value: number
          template_id: string
        }
        Update: {
          club_id?: string
          completed_at?: string | null
          created_at?: string
          current_value?: number
          end_date?: string
          id?: string
          rewards_claimed?: boolean
          start_date?: string
          status?: string
          target_value?: number
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_challenges_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_challenges_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "club_challenge_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      club_join_requests: {
        Row: {
          club_id: string
          created_at: string
          id: string
          message: string | null
          responded_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          club_id: string
          created_at?: string
          id?: string
          message?: string | null
          responded_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          club_id?: string
          created_at?: string
          id?: string
          message?: string | null
          responded_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_join_requests_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_members: {
        Row: {
          club_id: string
          id: string
          joined_at: string
          predictions_count: number
          role: string
          user_id: string
          wins_count: number
          xp_contributed: number
        }
        Insert: {
          club_id: string
          id?: string
          joined_at?: string
          predictions_count?: number
          role?: string
          user_id: string
          wins_count?: number
          xp_contributed?: number
        }
        Update: {
          club_id?: string
          id?: string
          joined_at?: string
          predictions_count?: number
          role?: string
          user_id?: string
          wins_count?: number
          xp_contributed?: number
        }
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "club_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      club_messages: {
        Row: {
          club_id: string
          content: string
          created_at: string
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          is_pinned: boolean
          message_type: string
          pinned_at: string | null
          pinned_by: string | null
          reply_to_id: string | null
          user_id: string
        }
        Insert: {
          club_id: string
          content: string
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_pinned?: boolean
          message_type?: string
          pinned_at?: string | null
          pinned_by?: string | null
          reply_to_id?: string | null
          user_id: string
        }
        Update: {
          club_id?: string
          content?: string
          created_at?: string
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_pinned?: boolean
          message_type?: string
          pinned_at?: string | null
          pinned_by?: string | null
          reply_to_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_messages_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "club_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      club_moderation_logs: {
        Row: {
          action_type: string
          club_id: string
          created_at: string
          id: string
          message_author_name: string | null
          message_content: string | null
          moderator_id: string
          target_message_id: string | null
          target_user_id: string | null
        }
        Insert: {
          action_type: string
          club_id: string
          created_at?: string
          id?: string
          message_author_name?: string | null
          message_content?: string | null
          moderator_id: string
          target_message_id?: string | null
          target_user_id?: string | null
        }
        Update: {
          action_type?: string
          club_id?: string
          created_at?: string
          id?: string
          message_author_name?: string | null
          message_content?: string | null
          moderator_id?: string
          target_message_id?: string | null
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_moderation_logs_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_muted_members: {
        Row: {
          club_id: string
          created_at: string
          expires_at: string
          id: string
          muted_at: string
          muted_by: string
          reason: string | null
          user_id: string
        }
        Insert: {
          club_id: string
          created_at?: string
          expires_at: string
          id?: string
          muted_at?: string
          muted_by: string
          reason?: string | null
          user_id: string
        }
        Update: {
          club_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          muted_at?: string
          muted_by?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_muted_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_poll_options: {
        Row: {
          created_at: string
          id: string
          option_order: number
          option_text: string
          poll_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_order?: number
          option_text: string
          poll_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_order?: number
          option_text?: string
          poll_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "club_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      club_poll_votes: {
        Row: {
          created_at: string
          id: string
          option_id: string
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_id: string
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string
          poll_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "club_poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "club_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      club_polls: {
        Row: {
          club_id: string
          created_at: string
          creator_id: string
          ends_at: string | null
          id: string
          is_anonymous: boolean
          is_closed: boolean
          is_multiple_choice: boolean
          message_id: string | null
          question: string
        }
        Insert: {
          club_id: string
          created_at?: string
          creator_id: string
          ends_at?: string | null
          id?: string
          is_anonymous?: boolean
          is_closed?: boolean
          is_multiple_choice?: boolean
          message_id?: string | null
          question: string
        }
        Update: {
          club_id?: string
          created_at?: string
          creator_id?: string
          ends_at?: string | null
          id?: string
          is_anonymous?: boolean
          is_closed?: boolean
          is_multiple_choice?: boolean
          message_id?: string | null
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_polls_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_polls_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "club_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      club_rewards: {
        Row: {
          active: boolean
          arena_points: number
          badge_name: string | null
          created_at: string
          description: string | null
          id: string
          rank_from: number
          rank_to: number
          xp_bonus: number
        }
        Insert: {
          active?: boolean
          arena_points?: number
          badge_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          rank_from: number
          rank_to: number
          xp_bonus?: number
        }
        Update: {
          active?: boolean
          arena_points?: number
          badge_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          rank_from?: number
          rank_to?: number
          xp_bonus?: number
        }
        Relationships: []
      }
      club_wars: {
        Row: {
          challenger_id: string
          challenger_predictions: number
          challenger_wins: number
          challenger_xp: number
          created_at: string
          defender_id: string
          defender_predictions: number
          defender_wins: number
          defender_xp: number
          end_date: string | null
          id: string
          start_date: string | null
          status: string
          updated_at: string
          winner_id: string | null
          xp_reward: number
        }
        Insert: {
          challenger_id: string
          challenger_predictions?: number
          challenger_wins?: number
          challenger_xp?: number
          created_at?: string
          defender_id: string
          defender_predictions?: number
          defender_wins?: number
          defender_xp?: number
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          winner_id?: string | null
          xp_reward?: number
        }
        Update: {
          challenger_id?: string
          challenger_predictions?: number
          challenger_wins?: number
          challenger_xp?: number
          created_at?: string
          defender_id?: string
          defender_predictions?: number
          defender_wins?: number
          defender_xp?: number
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          winner_id?: string | null
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "club_wars_challenger_id_fkey"
            columns: ["challenger_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_wars_defender_id_fkey"
            columns: ["defender_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_wars_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_weekly_rankings: {
        Row: {
          accuracy: number
          club_id: string
          created_at: string
          final_rank: number | null
          id: string
          rewards_claimed: boolean
          total_predictions: number
          total_wins: number
          total_xp: number
          week_end: string
          week_start: string
        }
        Insert: {
          accuracy?: number
          club_id: string
          created_at?: string
          final_rank?: number | null
          id?: string
          rewards_claimed?: boolean
          total_predictions?: number
          total_wins?: number
          total_xp?: number
          week_end: string
          week_start: string
        }
        Update: {
          accuracy?: number
          club_id?: string
          created_at?: string
          final_rank?: number | null
          id?: string
          rewards_claimed?: boolean
          total_predictions?: number
          total_wins?: number
          total_xp?: number
          week_end?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_weekly_rankings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          logo_url: string | null
          max_members: number
          member_count: number
          name: string
          owner_id: string
          slug: string
          total_predictions: number
          total_wins: number
          total_xp: number
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          logo_url?: string | null
          max_members?: number
          member_count?: number
          name: string
          owner_id: string
          slug: string
          total_predictions?: number
          total_wins?: number
          total_xp?: number
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          logo_url?: string | null
          max_members?: number
          member_count?: number
          name?: string
          owner_id?: string
          slug?: string
          total_predictions?: number
          total_wins?: number
          total_xp?: number
          updated_at?: string
        }
        Relationships: []
      }
      daily_challenges: {
        Row: {
          active: boolean
          challenge_type: string
          created_at: string
          description: string
          icon: string
          id: string
          requirement_value: number
          title: string
          xp_reward: number
        }
        Insert: {
          active?: boolean
          challenge_type: string
          created_at?: string
          description: string
          icon?: string
          id?: string
          requirement_value?: number
          title: string
          xp_reward?: number
        }
        Update: {
          active?: boolean
          challenge_type?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          requirement_value?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      daily_pro_picks: {
        Row: {
          created_at: string
          id: string
          matches: Json
          pick_date: string
          resolved_at: string | null
          status: string
          total_potential_reward: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          matches: Json
          pick_date?: string
          resolved_at?: string | null
          status?: string
          total_potential_reward?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          matches?: Json
          pick_date?: string
          resolved_at?: string | null
          status?: string
          total_potential_reward?: number
          user_id?: string
        }
        Relationships: []
      }
      level_rewards: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          level_required: number
          rarity: string
          reward_type: string
          reward_value: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string
          id?: string
          level_required: number
          rarity?: string
          reward_type: string
          reward_value: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          level_required?: number
          rarity?: string
          reward_type?: string
          reward_value?: string
          title?: string
        }
        Relationships: []
      }
      predictions: {
        Row: {
          created_at: string
          id: string
          match_id: string
          odds: number
          potential_winnings: number
          resolved_at: string | null
          selected_team: string
          stake_amount: number
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          odds: number
          potential_winnings: number
          resolved_at?: string | null
          selected_team: string
          stake_amount: number
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          odds?: number
          potential_winnings?: number
          resolved_at?: string | null
          selected_team?: string
          stake_amount?: number
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      prize_redemptions: {
        Row: {
          created_at: string
          delivery_info: Json | null
          id: string
          notes: string | null
          price_paid: number
          prize_id: number
          prize_name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_info?: Json | null
          id?: string
          notes?: string | null
          price_paid: number
          prize_id: number
          prize_name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_info?: Json | null
          id?: string
          notes?: string | null
          price_paid?: number
          prize_id?: number
          prize_name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prize_redemptions_prize_id_fkey"
            columns: ["prize_id"]
            isOneToOne: false
            referencedRelation: "arena_prizes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prize_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "prize_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_leaderboard"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_streak: number
          arena_balance: number
          arena_score: number
          avatar_url: string | null
          created_at: string
          current_level: number
          current_xp: number
          display_name: string | null
          id: string
          onboarding_completed: boolean
          onboarding_completed_at: string | null
          prediction_accuracy: number | null
          referred_by: string | null
          total_predictions: number
          total_wins: number
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          active_streak?: number
          arena_balance?: number
          arena_score?: number
          avatar_url?: string | null
          created_at?: string
          current_level?: number
          current_xp?: number
          display_name?: string | null
          id?: string
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
          prediction_accuracy?: number | null
          referred_by?: string | null
          total_predictions?: number
          total_wins?: number
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          active_streak?: number
          arena_balance?: number
          arena_score?: number
          avatar_url?: string | null
          created_at?: string
          current_level?: number
          current_xp?: number
          display_name?: string | null
          id?: string
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
          prediction_accuracy?: number | null
          referred_by?: string | null
          total_predictions?: number
          total_wins?: number
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_inquiries: {
        Row: {
          category: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          resolved_at: string | null
          status: string
          subject: string
          user_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          resolved_at?: string | null
          status?: string
          subject: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_daily_challenges: {
        Row: {
          challenge_date: string
          challenge_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          progress: number
          user_id: string
          xp_claimed: boolean
        }
        Insert: {
          challenge_date?: string
          challenge_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          user_id: string
          xp_claimed?: boolean
        }
        Update: {
          challenge_date?: string
          challenge_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number
          user_id?: string
          xp_claimed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "user_daily_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_level_rewards: {
        Row: {
          claimed_at: string
          id: string
          reward_id: string
          user_id: string
        }
        Insert: {
          claimed_at?: string
          id?: string
          reward_id: string
          user_id: string
        }
        Update: {
          claimed_at?: string
          id?: string
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_level_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "level_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
          user_id: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
          value?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weekly_rankings: {
        Row: {
          accuracy: number
          arena_score: number
          created_at: string
          final_rank: number | null
          id: string
          predictions_count: number
          rewards_claimed: boolean
          user_id: string
          week_end: string
          week_start: string
        }
        Insert: {
          accuracy?: number
          arena_score?: number
          created_at?: string
          final_rank?: number | null
          id?: string
          predictions_count?: number
          rewards_claimed?: boolean
          user_id: string
          week_end: string
          week_start: string
        }
        Update: {
          accuracy?: number
          arena_score?: number
          created_at?: string
          final_rank?: number | null
          id?: string
          predictions_count?: number
          rewards_claimed?: boolean
          user_id?: string
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
      weekly_rewards: {
        Row: {
          active: boolean
          arena_points: number
          badge_id: string | null
          created_at: string
          description: string | null
          id: string
          rank_from: number
          rank_to: number
        }
        Insert: {
          active?: boolean
          arena_points: number
          badge_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          rank_from: number
          rank_to: number
        }
        Update: {
          active?: boolean
          arena_points?: number
          badge_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          rank_from?: number
          rank_to?: number
        }
        Relationships: [
          {
            foreignKeyName: "weekly_rewards_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_leaderboard: {
        Row: {
          active_streak: number | null
          arena_score: number | null
          avatar_url: string | null
          current_level: number | null
          display_name: string | null
          prediction_accuracy: number | null
          total_predictions: number | null
          total_wins: number | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          active_streak?: number | null
          arena_score?: number | null
          avatar_url?: string | null
          current_level?: number | null
          display_name?: string | null
          prediction_accuracy?: number | null
          total_predictions?: number | null
          total_wins?: number | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          active_streak?: number | null
          arena_score?: number | null
          avatar_url?: string | null
          current_level?: number | null
          display_name?: string | null
          prediction_accuracy?: number | null
          total_predictions?: number | null
          total_wins?: number | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_arena_secure: {
        Args: {
          p_amount: number
          p_description?: string
          p_reference_id?: string
          p_source: string
        }
        Returns: Json
      }
      add_xp: {
        Args: { p_user_id: string; p_xp_amount: number }
        Returns: Json
      }
      approve_join_request: { Args: { p_request_id: string }; Returns: Json }
      ban_club_member: {
        Args: { p_club_id: string; p_reason?: string; p_user_id: string }
        Returns: Json
      }
      claim_challenge_reward: {
        Args: { p_user_challenge_id: string }
        Returns: Json
      }
      claim_club_challenge_reward: {
        Args: { p_challenge_id: string }
        Returns: Json
      }
      claim_club_reward: { Args: { p_ranking_id: string }; Returns: Json }
      claim_level_reward: { Args: { p_reward_id: string }; Returns: Json }
      complete_club_war: { Args: { p_war_id: string }; Returns: Json }
      complete_daily_challenge_reward: {
        Args: { p_xp_reward?: number }
        Returns: Json
      }
      contribute_to_club_challenge: {
        Args: {
          p_club_id: string
          p_contribution_type: string
          p_value: number
        }
        Returns: undefined
      }
      create_club: {
        Args: { p_description?: string; p_is_public?: boolean; p_name: string }
        Returns: Json
      }
      create_club_war: {
        Args: { p_defender_id: string; p_duration_days?: number }
        Returns: Json
      }
      get_arena_balance: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_user_banned: {
        Args: { p_club_id: string; p_user_id: string }
        Returns: boolean
      }
      is_user_muted: {
        Args: { p_club_id: string; p_user_id: string }
        Returns: boolean
      }
      join_club: { Args: { p_club_id: string }; Returns: Json }
      leave_club: { Args: { p_club_id: string }; Returns: Json }
      mute_club_member: {
        Args: {
          p_club_id: string
          p_duration_minutes: number
          p_reason?: string
          p_user_id: string
        }
        Returns: Json
      }
      redeem_prize: {
        Args: { p_delivery_info?: Json; p_prize_id: number }
        Returns: Json
      }
      redeem_prize_secure: { Args: { p_prize_id: number }; Returns: Json }
      reject_join_request: { Args: { p_request_id: string }; Returns: Json }
      resolve_match: {
        Args: { p_match_id: string; p_winning_team: string }
        Returns: Json
      }
      respond_to_ban_appeal: {
        Args: { p_appeal_id: string; p_approved: boolean; p_response?: string }
        Returns: Json
      }
      respond_to_war: {
        Args: { p_accept: boolean; p_war_id: string }
        Returns: Json
      }
      spend_arena_secure: {
        Args: {
          p_amount: number
          p_description?: string
          p_reference_id?: string
          p_source: string
        }
        Returns: Json
      }
      start_club_challenge: { Args: { p_template_id: string }; Returns: Json }
      submit_ban_appeal: {
        Args: { p_club_id: string; p_reason: string }
        Returns: Json
      }
      unban_club_member: {
        Args: { p_club_id: string; p_user_id: string }
        Returns: Json
      }
      unmute_club_member: {
        Args: { p_club_id: string; p_user_id: string }
        Returns: Json
      }
      update_member_role: {
        Args: { p_member_id: string; p_new_role: string }
        Returns: Json
      }
      update_war_stats: {
        Args: { p_club_id: string; p_is_win: boolean; p_xp_earned: number }
        Returns: undefined
      }
      xp_for_level: { Args: { level_num: number }; Returns: number }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      arena_source:
        | "purchase"
        | "contest_refill"
        | "refund"
        | "prize"
        | "manual"
        | "prediction_win"
        | "prediction_loss"
        | "staking_reward"
      badge_category:
        | "prediction"
        | "streak"
        | "engagement"
        | "achievement"
        | "special"
      badge_rarity: "common" | "rare" | "epic" | "legendary"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

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
} as const
