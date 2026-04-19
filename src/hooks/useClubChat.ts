// src/hooks/useClubChat.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { playSoundIfEnabled } from "@/lib/sounds";

interface Profile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  userIds: string[];
  hasReacted: boolean;
}

export interface ReplyToMessage {
  id: string;
  content: string;
  user_id: string;
  display_name: string | null;
}

export interface ChatMessage {
  id: string;
  club_id: string;
  user_id: string;
  content: string;
  message_type: "text" | "system" | "achievement";
  created_at: string;
  reply_to_id: string | null;
  reply_to?: ReplyToMessage | null;
  is_pinned: boolean;
  pinned_at: string | null;
  pinned_by: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  profile?: Profile;
  reactions: MessageReaction[];
}

interface OnlineUser {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  online_at: string;
}

interface TypingUser {
  user_id: string;
  display_name: string;
}

interface RawReaction {
  message_id: string;
  user_id: string;
  emoji: string;
}

export const AVAILABLE_EMOJIS = [
  "👍",
  "❤️",
  "😂",
  "😮",
  "😢",
  "🔥",
  "🎉",
  "👏",
];

/**
 * Type-guard: keep only non-empty strings.
 *
 * @example
 * ["a", null, ""].filter(isNonEmptyString) // ["a"]
 */
function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export const useClubChat = (clubId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());
  const [reactions, setReactions] = useState<Map<string, RawReaction[]>>(
    new Map(),
  );

  const channelRef = useRef<RealtimeChannel | null>(null);
  const presenceChannelRef = useRef<RealtimeChannel | null>(null);
  const reactionsChannelRef = useRef<RealtimeChannel | null>(null);
  const typingChannelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Build UI-ready reactions for a message.
   *
   * @example
   * processReactions("m1", [{message_id:"m1", user_id:"u1", emoji:"🔥"}]).length // 1
   */
  const processReactions = useCallback(
    (messageId: string, rawReactions: RawReaction[]): MessageReaction[] => {
      const emojiMap = new Map<string, { count: number; userIds: string[] }>();

      rawReactions.forEach((r) => {
        if (!emojiMap.has(r.emoji)) {
          emojiMap.set(r.emoji, { count: 0, userIds: [] });
        }
        const entry = emojiMap.get(r.emoji)!;
        entry.count += 1;
        entry.userIds.push(r.user_id);
      });

      return Array.from(emojiMap.entries()).map(([emoji, data]) => ({
        emoji,
        count: data.count,
        userIds: data.userIds,
        hasReacted: user ? data.userIds.includes(user.id) : false,
      }));
    },
    [user],
  );

  const fetchReactions = useCallback(async (messageIds: string[]) => {
    if (messageIds.length === 0) return new Map<string, RawReaction[]>();

    const { data, error } = await supabase
      .from("club_message_reactions")
      .select("message_id, user_id, emoji")
      .in("message_id", messageIds);

    if (error) {
      console.error("Error fetching reactions:", error);
      return new Map<string, RawReaction[]>();
    }

    const reactionMap = new Map<string, RawReaction[]>();
    (data || []).forEach((r) => {
      if (!reactionMap.has(r.message_id)) reactionMap.set(r.message_id, []);
      reactionMap.get(r.message_id)!.push(r);
    });

    return reactionMap;
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!clubId) return;

    try {
      const { data, error } = await supabase
        .from("club_messages")
        .select("*")
        .eq("club_id", clubId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) throw error;

      const rows = (data || []) as any[];
      const messageIds = rows.map((m) => m.id).filter(isNonEmptyString);

      const userIds = Array.from(
        new Set(rows.map((m) => m.user_id).filter(isNonEmptyString)),
      );

      const replyToIds = Array.from(
        new Set(rows.map((m) => m.reply_to_id).filter(isNonEmptyString)),
      );

      const [profilesData, reactionsMap, replyMessagesData] = await Promise.all(
        [
          userIds.length > 0
            ? supabase
                .from("profiles")
                .select("user_id, display_name, avatar_url")
                .in("user_id", userIds)
            : Promise.resolve({ data: [] as Profile[] }),
          fetchReactions(messageIds),
          replyToIds.length > 0
            ? supabase
                .from("club_messages")
                .select("id, content, user_id")
                .in("id", replyToIds)
            : Promise.resolve({ data: [] as any[] }),
        ],
      );

      const profileMap = new Map<string, Profile>();
      (profilesData.data || []).forEach((p: any) => {
        if (isNonEmptyString(p.user_id)) {
          profileMap.set(p.user_id, {
            user_id: p.user_id,
            display_name: p.display_name ?? null,
            avatar_url: p.avatar_url ?? null,
          });
        }
      });

      setProfiles(profileMap);
      setReactions(reactionsMap);

      const replyMessagesMap = new Map<string, ReplyToMessage>();
      (replyMessagesData.data || []).forEach((m: any) => {
        if (!isNonEmptyString(m.id) || !isNonEmptyString(m.user_id)) return;
        const prof = profileMap.get(m.user_id);
        replyMessagesMap.set(m.id, {
          id: m.id,
          content: m.content ?? "",
          user_id: m.user_id,
          display_name: prof?.display_name ?? null,
        });
      });

      setMessages(
        rows
          .filter((m) => isNonEmptyString(m.id) && isNonEmptyString(m.user_id))
          .map((m) => ({
            ...(m as any),
            message_type: (m.message_type ||
              "text") as ChatMessage["message_type"],
            profile: profileMap.get(m.user_id),
            reactions: processReactions(m.id, reactionsMap.get(m.id) || []),
            reply_to: isNonEmptyString(m.reply_to_id)
              ? replyMessagesMap.get(m.reply_to_id) || null
              : null,
          })),
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [clubId, fetchReactions, processReactions]);

  const fetchProfile = async (userId: string): Promise<Profile | undefined> => {
    if (profiles.has(userId)) return profiles.get(userId);

    const { data } = await supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .eq("user_id", userId)
      .single();

    if (data?.user_id) {
      const p: Profile = {
        user_id: data.user_id,
        display_name: data.display_name ?? null,
        avatar_url: data.avatar_url ?? null,
      };
      setProfiles((prev) => new Map(prev).set(userId, p));
      return p;
    }
    return undefined;
  };

  const sendMessage = async (
    content: string,
    replyToId?: string,
    file?: File,
  ) => {
    if (!clubId || !user || (!content.trim() && !file)) return;

    setSending(true);
    try {
      let filePath: string | null = null;
      let fileName: string | null = null;
      let fileType: string | null = null;

      if (file) {
        const fileExt = file.name.split(".").pop();
        filePath = `${user.id}/${clubId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("club-chat-files")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        fileName = file.name;
        fileType = file.type;
      }

      const payload = {
        club_id: clubId,
        user_id: user.id,
        content: content.trim() || (file ? fileName || "" : ""),
        message_type: "text",
        reply_to_id: replyToId ?? null,
        file_url: filePath,
        file_name: fileName,
        file_type: fileType,
      };

      const { error } = await supabase.from("club_messages").insert([payload]);

      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const getSignedFileUrl = async (filePath: string): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from("club-chat-files")
      .createSignedUrl(filePath, 3600);

    if (error) {
      console.error("Error generating signed URL:", error);
      return null;
    }
    return data.signedUrl;
  };

  const deleteMessage = async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("club_messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const togglePin = async (messageId: string) => {
    if (!user) return;

    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    try {
      const newPinnedState = !message.is_pinned;

      const { error } = await supabase
        .from("club_messages")
        .update({
          is_pinned: newPinnedState,
          pinned_at: newPinnedState ? new Date().toISOString() : null,
          pinned_by: newPinnedState ? user.id : null,
        })
        .eq("id", messageId);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                is_pinned: newPinnedState,
                pinned_at: newPinnedState ? new Date().toISOString() : null,
                pinned_by: newPinnedState ? user.id : null,
              }
            : m,
        ),
      );
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
    if (!user) return;

    const messageReactions = reactions.get(messageId) || [];
    const existingReaction = messageReactions.find(
      (r) => r.user_id === user.id && r.emoji === emoji,
    );

    try {
      if (existingReaction) {
        await supabase
          .from("club_message_reactions")
          .delete()
          .eq("message_id", messageId)
          .eq("user_id", user.id)
          .eq("emoji", emoji);
      } else {
        await supabase.from("club_message_reactions").insert([
          {
            message_id: messageId,
            user_id: user.id,
            emoji,
          },
        ]);
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  };

  const updateReactionsState = useCallback(
    (messageId: string, newReactions: RawReaction[]) => {
      setReactions((prev) => new Map(prev).set(messageId, newReactions));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, reactions: processReactions(messageId, newReactions) }
            : m,
        ),
      );
    },
    [processReactions],
  );

  const stopTyping = useCallback(async () => {
    if (!typingChannelRef.current) return;

    await typingChannelRef.current.untrack();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  const startTyping = useCallback(async () => {
    if (!typingChannelRef.current || !user) return;

    const profile = profiles.get(user.id);

    await typingChannelRef.current.track({
      user_id: user.id,
      display_name: profile?.display_name || "Anonyme",
      typing_at: new Date().toISOString(),
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      void stopTyping();
    }, 3000);
  }, [user, profiles, stopTyping]);

  useEffect(() => {
    if (!clubId || !user) return;

    void fetchMessages();

    channelRef.current = supabase
      .channel(`club_chat_${clubId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "club_messages",
          filter: `club_id=eq.${clubId}`,
        },
        async (payload) => {
          const newMessage = payload.new as any;
          const profile = isNonEmptyString(newMessage.user_id)
            ? await fetchProfile(newMessage.user_id)
            : undefined;

          if (newMessage.user_id && newMessage.user_id !== user.id) {
            const userProfile = profiles.get(user.id);
            const displayName = userProfile?.display_name?.toLowerCase();

            if (
              displayName &&
              typeof newMessage.content === "string" &&
              newMessage.content.toLowerCase().includes(`@${displayName}`)
            ) {
              playSoundIfEnabled("mention");
            } else {
              playSoundIfEnabled("message");
            }
          }

          let replyTo: ReplyToMessage | null = null;
          if (isNonEmptyString(newMessage.reply_to_id)) {
            const { data: replyData } = await supabase
              .from("club_messages")
              .select("id, content, user_id")
              .eq("id", newMessage.reply_to_id)
              .single();

            if (replyData && isNonEmptyString((replyData as any).user_id)) {
              const replyProfile = await fetchProfile(
                (replyData as any).user_id,
              );
              replyTo = {
                id: (replyData as any).id,
                content: (replyData as any).content ?? "",
                user_id: (replyData as any).user_id,
                display_name: replyProfile?.display_name || null,
              };
            }
          }

          setMessages((prev) => [
            ...prev,
            {
              ...(newMessage as any),
              message_type: (newMessage.message_type ||
                "text") as ChatMessage["message_type"],
              profile,
              reactions: [],
              reply_to: replyTo,
            },
          ]);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "club_messages",
          filter: `club_id=eq.${clubId}`,
        },
        (payload) => {
          const deletedId = (payload.old as { id: string }).id;
          setMessages((prev) => prev.filter((m) => m.id !== deletedId));
        },
      )
      .subscribe();

    reactionsChannelRef.current = supabase
      .channel(`club_reactions_${clubId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "club_message_reactions",
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newReaction = payload.new as RawReaction;
            const messageId = newReaction.message_id;
            const currentReactions = reactions.get(messageId) || [];
            updateReactionsState(messageId, [...currentReactions, newReaction]);
          } else if (payload.eventType === "DELETE") {
            const oldReaction = payload.old as RawReaction;
            const messageId = oldReaction.message_id;
            const currentReactions = reactions.get(messageId) || [];
            updateReactionsState(
              messageId,
              currentReactions.filter(
                (r) =>
                  !(
                    r.user_id === oldReaction.user_id &&
                    r.emoji === oldReaction.emoji
                  ),
              ),
            );
          }
        },
      )
      .subscribe();

    presenceChannelRef.current = supabase.channel(`club_presence_${clubId}`);

    presenceChannelRef.current
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannelRef.current?.presenceState() || {};
        const usersList: OnlineUser[] = [];

        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: OnlineUser) => {
            if (!usersList.find((u) => u.user_id === presence.user_id)) {
              usersList.push(presence);
            }
          });
        });

        setOnlineUsers(usersList);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, avatar_url")
            .eq("user_id", user.id)
            .single();

          await presenceChannelRef.current?.track({
            user_id: user.id,
            display_name: profile?.display_name || "Anonyme",
            avatar_url: profile?.avatar_url ?? null,
            online_at: new Date().toISOString(),
          });
        }
      });

    typingChannelRef.current = supabase.channel(`club_typing_${clubId}`);

    typingChannelRef.current
      .on("presence", { event: "sync" }, () => {
        const state = typingChannelRef.current?.presenceState() || {};
        const usersList: TypingUser[] = [];

        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (
              presence.user_id !== user.id &&
              !usersList.find((u) => u.user_id === presence.user_id)
            ) {
              usersList.push({
                user_id: presence.user_id,
                display_name: presence.display_name,
              });
            }
          });
        });

        setTypingUsers(usersList);
      })
      .subscribe();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      if (presenceChannelRef.current)
        supabase.removeChannel(presenceChannelRef.current);
      if (reactionsChannelRef.current)
        supabase.removeChannel(reactionsChannelRef.current);
      if (typingChannelRef.current)
        supabase.removeChannel(typingChannelRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
    // NOTE: on garde les deps minimales pour éviter de resouscrire en boucle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId, user]);

  const pinnedMessages = messages.filter((m) => m.is_pinned);

  return {
    messages,
    pinnedMessages,
    onlineUsers,
    typingUsers,
    loading,
    sending,
    sendMessage,
    deleteMessage,
    togglePin,
    toggleReaction,
    startTyping,
    stopTyping,
    getSignedFileUrl,
    refresh: fetchMessages,
  };
};
