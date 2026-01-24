import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Send, Users, Smile, Loader2, 
  ChevronDown, X, Plus, AtSign, Volume2, VolumeX,
  Reply, CornerDownRight, Trash2, Pin, PinOff,
  Paperclip, Image, FileText, Download, BarChart3, Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useClubChat, ChatMessage, AVAILABLE_EMOJIS, ReplyToMessage } from '@/hooks/useClubChat';
import { useClubMembers, useClubs } from '@/hooks/useClubs';
import { ModerationLogs } from './ModerationLogs';
import { ModerationStats } from './ModerationStats';
import { ClubPolls } from './ClubPolls';
import { MuteUserDialog } from './MuteUserDialog';
import { BanUserDialog } from './BanUserDialog';
import { BannedMembersList } from './BannedMembersList';
import { BanAppealsList } from './BanAppeals';
import { useClubMute } from '@/hooks/useClubMute';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { format, isToday, isYesterday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { isSoundEnabled, toggleSound, playNotificationSound } from '@/lib/sounds';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ClubChatProps {
  clubId: string;
  clubName?: string;
}

const formatMessageTime = (date: string) => {
  const d = new Date(date);
  if (isToday(d)) {
    return format(d, 'HH:mm', { locale: fr });
  } else if (isYesterday(d)) {
    return 'Hier ' + format(d, 'HH:mm', { locale: fr });
  }
  return format(d, 'dd/MM HH:mm', { locale: fr });
};

// Parse message content and highlight mentions
const parseMessageContent = (content: string) => {
  const mentionRegex = /@(\w+(?:\s\w+)?)/g;
  const parts: Array<{ type: 'text' | 'mention'; value: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'mention', value: match[0] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: 'text' as const, value: content }];
};

const MessageContent = ({ content }: { content: string }) => {
  const parts = parseMessageContent(content);
  
  return (
    <span>
      {parts.map((part, index) => 
        part.type === 'mention' ? (
          <span key={index} className="bg-primary/20 text-primary font-medium px-1 rounded">
            {part.value}
          </span>
        ) : (
          <span key={index}>{part.value}</span>
        )
      )}
    </span>
  );
};

const ReactionPicker = ({ 
  onSelect, 
  onClose 
}: { 
  onSelect: (emoji: string) => void;
  onClose: () => void;
}) => {
  return (
    <div className="flex gap-1 p-1">
      {AVAILABLE_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => {
            onSelect(emoji);
            onClose();
          }}
          className="hover:bg-muted p-1.5 rounded-md transition-colors text-lg"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

// File attachment preview component - uses signed URLs for secure access
const FileAttachment = ({ 
  filePath, 
  fileName, 
  fileType,
  getSignedUrl
}: { 
  filePath: string; 
  fileName: string; 
  fileType: string;
  getSignedUrl: (path: string) => Promise<string | null>;
}) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isImage = fileType?.startsWith('image/');

  useEffect(() => {
    let mounted = true;
    const fetchUrl = async () => {
      // If it's already a full URL (legacy), use as-is
      if (filePath.startsWith('http')) {
        setSignedUrl(filePath);
        setLoading(false);
        return;
      }
      const url = await getSignedUrl(filePath);
      if (mounted) {
        setSignedUrl(url);
        setLoading(false);
      }
    };
    fetchUrl();
    return () => { mounted = false; };
  }, [filePath, getSignedUrl]);

  if (loading) {
    return (
      <div className="mt-2 flex items-center gap-2 p-2 bg-muted/50 rounded-lg max-w-[200px]">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Chargement...</span>
      </div>
    );
  }

  if (!signedUrl) {
    return (
      <div className="mt-2 flex items-center gap-2 p-2 bg-destructive/10 rounded-lg max-w-[200px]">
        <FileText className="h-4 w-4 text-destructive" />
        <span className="text-xs text-destructive">Fichier inaccessible</span>
      </div>
    );
  }
  
  if (isImage) {
    return (
      <div className="mt-2 max-w-[200px]">
        <a href={signedUrl} target="_blank" rel="noopener noreferrer">
          <img 
            src={signedUrl} 
            alt={fileName} 
            className="rounded-lg max-h-[200px] w-auto object-cover border hover:opacity-90 transition-opacity cursor-pointer"
          />
        </a>
      </div>
    );
  }

  return (
    <a 
      href={signedUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="mt-2 flex items-center gap-2 p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors max-w-[200px]"
    >
      <FileText className="h-5 w-5 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{fileName}</p>
        <p className="text-[10px] text-muted-foreground">Cliquer pour ouvrir</p>
      </div>
      <Download className="h-4 w-4 text-muted-foreground shrink-0" />
    </a>
  );
};

// File upload preview before sending
const FileUploadPreview = ({ 
  file, 
  onRemove 
}: { 
  file: File; 
  onRemove: () => void;
}) => {
  const isImage = file.type.startsWith('image/');
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border">
      {isImage && preview ? (
        <img src={preview} alt={file.name} className="h-10 w-10 object-cover rounded" />
      ) : (
        <FileText className="h-10 w-10 text-primary p-2 bg-primary/10 rounded" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{file.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

const MessageReactions = ({ 
  reactions,
  onToggle
}: { 
  reactions: ChatMessage['reactions'];
  onToggle: (emoji: string) => void;
}) => {
  if (reactions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          onClick={() => onToggle(reaction.emoji)}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors",
            reaction.hasReacted 
              ? "bg-primary/20 border border-primary/50" 
              : "bg-muted/50 hover:bg-muted"
          )}
        >
          <span>{reaction.emoji}</span>
          <span className="font-medium">{reaction.count}</span>
        </button>
      ))}
    </div>
  );
};

interface MentionSuggestion {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
}

interface MentionDropdownProps {
  suggestions: MentionSuggestion[];
  onSelect: (name: string) => void;
  selectedIndex: number;
}

const MentionDropdown = ({ suggestions, onSelect, selectedIndex }: MentionDropdownProps) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-1 bg-background border rounded-lg shadow-lg overflow-hidden z-50">
      <div className="p-1 max-h-40 overflow-y-auto">
        {suggestions.map((member, index) => (
          <button
            key={member.user_id}
            onClick={() => onSelect(member.display_name)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
              index === selectedIndex ? "bg-primary/20" : "hover:bg-muted"
            )}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={member.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {member.display_name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{member.display_name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Reply preview component
const ReplyPreview = ({ 
  replyTo, 
  compact = false 
}: { 
  replyTo: ReplyToMessage; 
  compact?: boolean;
}) => {
  const truncatedContent = replyTo.content.length > 60 
    ? replyTo.content.slice(0, 60) + '...' 
    : replyTo.content;

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
        <CornerDownRight className="h-3 w-3" />
        <span className="font-medium">{replyTo.display_name || 'Anonyme'}</span>
        <span className="truncate max-w-[150px]">{truncatedContent}</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 px-3 py-2 bg-muted/50 rounded-lg border-l-2 border-primary/50 mb-2">
      <Reply className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-primary">
          {replyTo.display_name || 'Anonyme'}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {truncatedContent}
        </p>
      </div>
    </div>
  );
};

// Pinned messages banner
const PinnedMessagesBanner = ({ 
  messages, 
  onClose 
}: { 
  messages: ChatMessage[];
  onClose: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (messages.length === 0) return null;
  
  const currentMessage = messages[currentIndex];
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="border-b bg-primary/5 px-4 py-2"
    >
      <div className="flex items-center gap-2">
        <Pin className="h-4 w-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary">
              {currentMessage.profile?.display_name || 'Anonyme'}
            </span>
            {messages.length > 1 && (
              <span className="text-xs text-muted-foreground">
                ({currentIndex + 1}/{messages.length})
              </span>
            )}
          </div>
          <p className="text-xs text-foreground truncate">
            {currentMessage.content}
          </p>
        </div>
        {messages.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % messages.length)}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
};

const MessageBubble = ({ 
  message, 
  isOwn, 
  showAvatar,
  onReact,
  onReply,
  onDelete,
  onTogglePin,
  canDelete,
  canPin,
  canMute,
  canBan,
  clubId,
  getSignedUrl
}: {
  message: ChatMessage; 
  isOwn: boolean;
  showAvatar: boolean;
  onReact: (emoji: string) => void;
  onReply: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  canDelete: boolean;
  canPin: boolean;
  canMute?: boolean;
  canBan?: boolean;
  clubId?: string;
  getSignedUrl: (path: string) => Promise<string | null>;
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  if (message.message_type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-2 mb-2 group",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      {showAvatar ? (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={message.profile?.avatar_url || undefined} />
          <AvatarFallback className="text-xs">
            {message.profile?.display_name?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-8 shrink-0" />
      )}
      <div className={cn("max-w-[70%]", isOwn && "text-right")}>
        {showAvatar && (
          <p className={cn(
            "text-xs text-muted-foreground mb-0.5",
            isOwn && "text-right"
          )}>
            {message.profile?.display_name || 'Anonyme'}
          </p>
        )}
        
        {/* Reply preview */}
        {message.reply_to && (
          <div className={cn("mb-1", isOwn && "flex justify-end")}>
            <ReplyPreview replyTo={message.reply_to} compact />
          </div>
        )}
        
        <div className="relative inline-block">
          <div
            className={cn(
              "inline-block px-3 py-2 rounded-2xl text-sm",
              isOwn 
                ? "bg-primary text-primary-foreground rounded-br-md" 
                : "bg-muted rounded-bl-md"
            )}
          >
            <MessageContent content={message.content} />
          </div>
          
          {/* File attachment */}
          {message.file_url && message.file_name && message.file_type && (
            <FileAttachment 
              filePath={message.file_url} 
              fileName={message.file_name} 
              fileType={message.file_type}
              getSignedUrl={getSignedUrl}
            />
          )}
          
          {/* Action buttons */}
          <div
            className={cn(
              "absolute -bottom-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
              isOwn ? "-left-2 flex-row-reverse" : "-right-2"
            )}
          >
            {/* Delete button (only for admins or own messages) */}
            {canDelete && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onDelete}
                    className="bg-background border rounded-full p-1 shadow-sm hover:bg-destructive/10 hover:border-destructive/50"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Supprimer</TooltipContent>
              </Tooltip>
            )}
            
            {/* Pin button (only for admins) */}
            {canPin && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onTogglePin}
                    className={cn(
                      "bg-background border rounded-full p-1 shadow-sm hover:bg-muted",
                      message.is_pinned && "bg-primary/10 border-primary/50"
                    )}
                  >
                    {message.is_pinned ? (
                      <PinOff className="h-3 w-3 text-primary" />
                    ) : (
                      <Pin className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{message.is_pinned ? 'Désépingler' : 'Épingler'}</TooltipContent>
              </Tooltip>
            )}
            
            {/* Mute button (only for moderators on other users' messages) */}
            {canMute && !isOwn && clubId && (
              <MuteUserDialog
                clubId={clubId}
                userId={message.user_id}
                userName={message.profile?.display_name || 'Anonyme'}
                trigger={
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="bg-background border rounded-full p-1 shadow-sm hover:bg-destructive/10 hover:border-destructive/50">
                        <VolumeX className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Mute</TooltipContent>
                  </Tooltip>
                }
              />
            )}
            
            {/* Ban button (only for admins on other users' messages) */}
            {canBan && !isOwn && clubId && (
              <BanUserDialog
                clubId={clubId}
                userId={message.user_id}
                userName={message.profile?.display_name || 'Anonyme'}
                trigger={
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="bg-background border rounded-full p-1 shadow-sm hover:bg-destructive/10 hover:border-destructive/50">
                        <Ban className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Bannir</TooltipContent>
                  </Tooltip>
                }
              />
            )}
            
            {/* Reply button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onReply}
                  className="bg-background border rounded-full p-1 shadow-sm hover:bg-muted"
                >
                  <Reply className="h-3 w-3 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Répondre</TooltipContent>
            </Tooltip>
            
            {/* Reaction button */}
            <Popover open={showReactionPicker} onOpenChange={setShowReactionPicker}>
              <PopoverTrigger asChild>
                <button
                  className="bg-background border rounded-full p-1 shadow-sm hover:bg-muted"
                >
                  <Smile className="h-3 w-3 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" side="top" align={isOwn ? "end" : "start"}>
                <ReactionPicker 
                  onSelect={onReact} 
                  onClose={() => setShowReactionPicker(false)} 
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Reactions */}
        <div className={cn(isOwn && "flex justify-end")}>
          <MessageReactions reactions={message.reactions} onToggle={onReact} />
        </div>
        
        <p className={cn(
          "text-[10px] text-muted-foreground mt-0.5",
          isOwn && "text-right"
        )}>
          {formatMessageTime(message.created_at)}
        </p>
      </div>
    </motion.div>
  );
};

// Custom hook for mention functionality
const useMentions = (clubId: string) => {
  const { members } = useClubMembers(clubId);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const suggestions = useMemo(() => {
    if (!mentionQuery) return [];
    
    const query = mentionQuery.toLowerCase();
    return members
      .filter(m => m.profile?.display_name?.toLowerCase().includes(query))
      .slice(0, 5)
      .map(m => ({
        user_id: m.user_id,
        display_name: m.profile?.display_name || 'Anonyme',
        avatar_url: m.profile?.avatar_url || null
      }));
  }, [mentionQuery, members]);

  const detectMention = (value: string, cursorPosition: number) => {
    // Find @ before cursor
    const textBeforeCursor = value.slice(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex === -1) {
      setMentionQuery(null);
      return;
    }

    // Check if there's a space between @ and cursor
    const textAfterAt = textBeforeCursor.slice(atIndex + 1);
    if (textAfterAt.includes(' ') && textAfterAt.split(' ').length > 2) {
      setMentionQuery(null);
      return;
    }

    setMentionQuery(textAfterAt);
    setSelectedIndex(0);
  };

  const insertMention = (
    value: string, 
    cursorPosition: number, 
    displayName: string
  ): { newValue: string; newCursorPosition: number } => {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    const beforeAt = value.slice(0, atIndex);
    const afterCursor = value.slice(cursorPosition);
    
    const newValue = `${beforeAt}@${displayName} ${afterCursor}`;
    const newCursorPosition = beforeAt.length + displayName.length + 2;
    
    setMentionQuery(null);
    
    return { newValue, newCursorPosition };
  };

  return {
    suggestions,
    mentionQuery,
    selectedIndex,
    setSelectedIndex,
    detectMention,
    insertMention,
    isOpen: mentionQuery !== null && suggestions.length > 0
  };
};

// Typing indicator component
const TypingIndicator = ({ users }: { users: { user_id: string; display_name: string }[] }) => {
  if (users.length === 0) return null;

  const text = users.length === 1
    ? `${users[0].display_name} écrit...`
    : users.length === 2
    ? `${users[0].display_name} et ${users[1].display_name} écrivent...`
    : `${users[0].display_name} et ${users.length - 1} autres écrivent...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 px-4 py-2"
    >
      <div className="flex gap-1">
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 bg-muted-foreground rounded-full"
        />
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 bg-muted-foreground rounded-full"
        />
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 bg-muted-foreground rounded-full"
        />
      </div>
      <span className="text-xs text-muted-foreground">{text}</span>
    </motion.div>
  );
};

export const ClubChat = ({ clubId, clubName }: ClubChatProps) => {
  const { user } = useAuth();
  const { messages, pinnedMessages, onlineUsers, typingUsers, loading, sending, sendMessage, deleteMessage, togglePin, toggleReaction, startTyping, stopTyping, getSignedFileUrl } = useClubChat(clubId);
  const { myMembership } = useClubs();
  const { isMuted, muteExpiresAt } = useClubMute(clubId);
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showPinned, setShowPinned] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if user can moderate (is admin, owner, or moderator)
  const canModerate = myMembership?.role === 'owner' || myMembership?.role === 'admin' || myMembership?.role === 'moderator';
  // Only owners and admins can pin messages
  const canPin = myMembership?.role === 'owner' || myMembership?.role === 'admin';
  
  const {
    suggestions,
    selectedIndex,
    setSelectedIndex,
    detectMention,
    insertMention,
    isOpen: showMentions
  } = useMentions(clubId);

  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const newValue = toggleSound();
    setSoundEnabled(newValue);
    // Play a test sound when enabling
    if (newValue) {
      playNotificationSound('message');
    }
  };

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    detectMention(value, e.target.selectionStart || value.length);
    
    // Trigger typing indicator
    if (value.trim()) {
      startTyping();
    }
  };

  const handleMentionSelect = (displayName: string) => {
    const cursorPosition = inputRef.current?.selectionStart || inputValue.length;
    const { newValue, newCursorPosition } = insertMention(inputValue, cursorPosition, displayName);
    setInputValue(newValue);
    
    // Set cursor position after state update
    setTimeout(() => {
      inputRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
      inputRef.current?.focus();
    }, 0);
  };

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && !selectedFile) || sending) return;
    
    const content = inputValue;
    const replyId = replyingTo?.id;
    const file = selectedFile;
    setInputValue('');
    setReplyingTo(null);
    setSelectedFile(null);
    stopTyping();
    await sendMessage(content, replyId, file || undefined);
    inputRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier est trop volumineux (max 10MB)');
        return;
      }
      setSelectedFile(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          handleMentionSelect(suggestions[selectedIndex].display_name);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        detectMention('', 0); // Close mentions
      }
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by user for avatar display
  const shouldShowAvatar = (message: ChatMessage, index: number) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return prevMessage.user_id !== message.user_id;
  };

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg relative"
          onClick={() => setIsExpanded(true)}
        >
          <MessageCircle className="h-6 w-6" />
          {onlineUsers.length > 1 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
              {onlineUsers.length}
            </span>
          )}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-50 w-[360px] h-[500px] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{clubName || 'Chat du club'}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {onlineUsers.length} en ligne
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleToggleSound}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {soundEnabled ? 'Désactiver le son' : 'Activer le son'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExpanded(false)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Online Users */}
      {onlineUsers.length > 0 && (
        <div className="px-4 py-2 border-b flex items-center gap-2 overflow-x-auto">
          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 8).map((u) => (
              <Avatar key={u.user_id} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={u.avatar_url || undefined} />
                <AvatarFallback className="text-[10px]">
                  {u.display_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
            ))}
            {onlineUsers.length > 8 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium border-2 border-background">
                +{onlineUsers.length - 8}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pinned messages */}
      <AnimatePresence>
        {showPinned && pinnedMessages.length > 0 && (
          <PinnedMessagesBanner 
            messages={pinnedMessages} 
            onClose={() => setShowPinned(false)} 
          />
        )}
      </AnimatePresence>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-sm">Aucun message</p>
            <p className="text-xs">Soyez le premier à écrire !</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.user_id === user?.id}
              showAvatar={shouldShowAvatar(message, index)}
              onReact={(emoji) => toggleReaction(message.id, emoji)}
              onReply={() => handleReply(message)}
              onDelete={() => deleteMessage(message.id)}
              onTogglePin={() => togglePin(message.id)}
              canDelete={message.user_id === user?.id || canModerate}
              canPin={canPin}
              canMute={canModerate}
              canBan={canPin}
              clubId={clubId}
              getSignedUrl={getSignedFileUrl}
            />
          ))
        )}
        
        {/* Typing indicator */}
        <AnimatePresence>
          <TypingIndicator users={typingUsers} />
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-muted/20 relative">
        {/* Reply preview */}
        <AnimatePresence>
          {replyingTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2"
            >
              <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 border-l-2 border-primary">
                <div className="flex items-center gap-2 min-w-0">
                  <Reply className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-primary">
                      Réponse à {replyingTo.profile?.display_name || 'Anonyme'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {replyingTo.content.slice(0, 50)}{replyingTo.content.length > 50 ? '...' : ''}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={cancelReply}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* File upload preview */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2"
            >
              <FileUploadPreview file={selectedFile} onRemove={() => setSelectedFile(null)} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mention dropdown */}
        <AnimatePresence>
          {showMentions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <MentionDropdown 
                suggestions={suggestions}
                onSelect={handleMentionSelect}
                selectedIndex={selectedIndex}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt"
          className="hidden"
        />
        
        {isMuted ? (
          <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
            <VolumeX className="h-4 w-4 text-destructive shrink-0" />
            <p className="text-xs text-destructive">
              Vous êtes mute {muteExpiresAt && `jusqu'à ${formatDistanceToNow(muteExpiresAt, { addSuffix: true, locale: fr })}`}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              ref={inputRef}
              placeholder={replyingTo ? "Écrire votre réponse..." : "Écrire un message..."}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={sending}
              className="flex-1 bg-background"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={(!inputValue.trim() && !selectedFile) || sending}
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Full page chat component for club detail page
export const ClubChatFull = ({ clubId, clubName }: ClubChatProps) => {
  const { user } = useAuth();
  const { messages, pinnedMessages, onlineUsers, typingUsers, loading, sending, sendMessage, deleteMessage, togglePin, toggleReaction, startTyping, stopTyping, getSignedFileUrl } = useClubChat(clubId);
  const { myMembership } = useClubs();
  const { isMuted, muteExpiresAt, isUserMuted } = useClubMute(clubId);
  const [inputValue, setInputValue] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showPinned, setShowPinned] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if user can moderate (is admin, owner, or moderator)
  const canModerate = myMembership?.role === 'owner' || myMembership?.role === 'admin' || myMembership?.role === 'moderator';
  // Only owners and admins can pin messages
  const canPin = myMembership?.role === 'owner' || myMembership?.role === 'admin';

  const {
    suggestions,
    selectedIndex,
    setSelectedIndex,
    detectMention,
    insertMention,
    isOpen: showMentions
  } = useMentions(clubId);

  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const newValue = toggleSound();
    setSoundEnabled(newValue);
    if (newValue) {
      playNotificationSound('message');
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    detectMention(value, e.target.selectionStart || value.length);
    
    // Trigger typing indicator
    if (value.trim()) {
      startTyping();
    }
  };

  const handleMentionSelect = (displayName: string) => {
    const cursorPosition = inputRef.current?.selectionStart || inputValue.length;
    const { newValue, newCursorPosition } = insertMention(inputValue, cursorPosition, displayName);
    setInputValue(newValue);
    
    setTimeout(() => {
      inputRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
      inputRef.current?.focus();
    }, 0);
  };

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && !selectedFile) || sending) return;
    
    const content = inputValue;
    const replyId = replyingTo?.id;
    const file = selectedFile;
    setInputValue('');
    setReplyingTo(null);
    setSelectedFile(null);
    stopTyping();
    await sendMessage(content, replyId, file || undefined);
    inputRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier est trop volumineux (max 10MB)');
        return;
      }
      setSelectedFile(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          handleMentionSelect(suggestions[selectedIndex].display_name);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        detectMention('', 0);
      }
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const shouldShowAvatar = (message: ChatMessage, index: number) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return prevMessage.user_id !== message.user_id;
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Chat du club</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {onlineUsers.length} membre{onlineUsers.length > 1 ? 's' : ''} en ligne
            </div>
          </div>
        </div>
        
        {/* Online Users Avatars + Sound Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {onlineUsers.slice(0, 5).map((u) => (
              <Avatar key={u.user_id} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={u.avatar_url || undefined} />
                <AvatarFallback className="text-xs">
                  {u.display_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
            ))}
            {onlineUsers.length > 5 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                +{onlineUsers.length - 5}
              </div>
            )}
          </div>
          
          {/* Moderation buttons - only for admins */}
          {(myMembership?.role === 'owner' || myMembership?.role === 'admin') && (
            <>
              <ModerationStats clubId={clubId} />
              <ModerationLogs clubId={clubId} />
              <BannedMembersList clubId={clubId} />
              <BanAppealsList clubId={clubId} />
            </>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleToggleSound}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {soundEnabled ? 'Désactiver le son' : 'Activer le son'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Polls Section */}
      <div className="border-b max-h-[200px] overflow-y-auto">
        <ClubPolls 
          clubId={clubId} 
          isAdmin={myMembership?.role === 'owner' || myMembership?.role === 'admin'} 
        />
      </div>

      {/* Pinned messages */}
      <AnimatePresence>
        {showPinned && pinnedMessages.length > 0 && (
          <PinnedMessagesBanner 
            messages={pinnedMessages} 
            onClose={() => setShowPinned(false)} 
          />
        )}
      </AnimatePresence>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-1"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageCircle className="h-16 w-16 mb-4 opacity-30" />
            <p className="font-medium">Aucun message</p>
            <p className="text-sm">Lancez la conversation avec votre club !</p>
            <p className="text-xs mt-2">Tapez @ pour mentionner un membre</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.user_id === user?.id}
              showAvatar={shouldShowAvatar(message, index)}
              onReact={(emoji) => toggleReaction(message.id, emoji)}
              onReply={() => handleReply(message)}
              onDelete={() => deleteMessage(message.id)}
              onTogglePin={() => togglePin(message.id)}
              canDelete={message.user_id === user?.id || canModerate}
              canPin={canPin}
              canMute={canModerate}
              canBan={canPin}
              clubId={clubId}
              getSignedUrl={getSignedFileUrl}
            />
          ))
        )}
        
        {/* Typing indicator */}
        <AnimatePresence>
          <TypingIndicator users={typingUsers} />
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-muted/20 relative">
        {/* Reply preview */}
        <AnimatePresence>
          {replyingTo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3"
            >
              <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 border-l-2 border-primary">
                <div className="flex items-center gap-2 min-w-0">
                  <Reply className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-primary">
                      Réponse à {replyingTo.profile?.display_name || 'Anonyme'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {replyingTo.content.slice(0, 60)}{replyingTo.content.length > 60 ? '...' : ''}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={cancelReply}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* File upload preview */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3"
            >
              <FileUploadPreview file={selectedFile} onRemove={() => setSelectedFile(null)} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mention dropdown */}
        <AnimatePresence>
          {showMentions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <MentionDropdown 
                suggestions={suggestions}
                onSelect={handleMentionSelect}
                selectedIndex={selectedIndex}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt"
          className="hidden"
        />

        {isMuted ? (
          <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <VolumeX className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">
              Vous êtes mute et ne pouvez pas envoyer de messages {muteExpiresAt && `(expire ${formatDistanceToNow(muteExpiresAt, { addSuffix: true, locale: fr })})`}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              ref={inputRef}
              placeholder={replyingTo ? "Écrire votre réponse..." : "Écrire un message..."}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={sending}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={(!inputValue.trim() && !selectedFile) || sending}
              className="gap-2"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Envoyer
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
