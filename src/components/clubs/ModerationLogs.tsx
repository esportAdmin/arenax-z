import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Trash2, Pin, PinOff, Clock, User,
  ChevronDown, ChevronUp, RefreshCw, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useModerationLogs, ModerationLog } from '@/hooks/useModerationLogs';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ModerationLogsProps {
  clubId: string;
}

const getActionIcon = (actionType: ModerationLog['action_type']) => {
  switch (actionType) {
    case 'delete':
      return <Trash2 className="h-4 w-4 text-destructive" />;
    case 'pin':
      return <Pin className="h-4 w-4 text-primary" />;
    case 'unpin':
      return <PinOff className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Shield className="h-4 w-4" />;
  }
};

const getActionLabel = (actionType: ModerationLog['action_type']) => {
  switch (actionType) {
    case 'delete':
      return 'Message supprimé';
    case 'pin':
      return 'Message épinglé';
    case 'unpin':
      return 'Message désépinglé';
    default:
      return 'Action';
  }
};

const getActionBadgeVariant = (actionType: ModerationLog['action_type']) => {
  switch (actionType) {
    case 'delete':
      return 'destructive';
    case 'pin':
      return 'default';
    case 'unpin':
      return 'secondary';
    default:
      return 'outline';
  }
};

const LogItem = ({ log }: { log: ModerationLog }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg p-3 bg-card"
    >
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="flex items-start gap-3">
          {/* Action icon */}
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
            log.action_type === 'delete' ? 'bg-destructive/10' : 'bg-primary/10'
          )}>
            {getActionIcon(log.action_type)}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={getActionBadgeVariant(log.action_type) as any}>
                {getActionLabel(log.action_type)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: fr })}
              </span>
            </div>
            
            <div className="mt-1 flex items-center gap-2 text-sm">
              <Avatar className="h-5 w-5">
                <AvatarImage src={log.moderator?.avatar_url || undefined} />
                <AvatarFallback className="text-[10px]">
                  {log.moderator?.display_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">
                {log.moderator?.display_name || 'Modérateur'}
              </span>
              {log.message_author_name && (
                <>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-muted-foreground">
                    message de {log.message_author_name}
                  </span>
                </>
              )}
            </div>
            
            {/* Expandable content preview */}
            {log.message_content && (
              <CollapsibleTrigger asChild>
                <button className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquare className="h-3 w-3" />
                  <span>Voir le contenu</span>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </CollapsibleTrigger>
            )}
          </div>
          
          {/* Time */}
          <div className="text-[10px] text-muted-foreground shrink-0">
            {format(new Date(log.created_at), 'HH:mm', { locale: fr })}
          </div>
        </div>
        
        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-3 bg-muted/50 rounded-lg text-sm"
          >
            <p className="text-muted-foreground italic break-words">
              "{log.message_content}"
            </p>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export const ModerationLogs = ({ clubId }: ModerationLogsProps) => {
  const { logs, loading, refresh } = useModerationLogs(clubId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Shield className="h-4 w-4" />
          Logs de modération
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Historique de modération
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {logs.length} action{logs.length !== 1 ? 's' : ''} enregistrée{logs.length !== 1 ? 's' : ''}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Actualiser
          </Button>
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
              <Shield className="h-12 w-12 mb-4 opacity-30" />
              <p className="font-medium">Aucune action de modération</p>
              <p className="text-sm">Les actions seront enregistrées ici</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {logs.map((log) => (
                  <LogItem key={log.id} log={log} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ModerationLogs;
