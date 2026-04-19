import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Plus, X, Check, Users, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useClubPolls, Poll } from '@/hooks/useClubPolls';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface ClubPollsProps {
  clubId: string;
  isAdmin?: boolean;
}

const PollCard = ({ 
  poll, 
  onVote, 
  onClose, 
  isAdmin, 
  userId 
}: { 
  poll: Poll; 
  onVote: (pollId: string, optionId: string) => void;
  onClose: (pollId: string) => void;
  isAdmin: boolean;
  userId?: string;
}) => {
  const [expanded, setExpanded] = useState(true);
  const hasVoted = poll.user_votes.length > 0;
  const isCreator = poll.creator_id === userId;
  const canClose = (isAdmin || isCreator) && !poll.is_closed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 border border-border/50 rounded-lg p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(poll.created_at), { addSuffix: true, locale: enUS })}
            </span>
            {poll.is_anonymous && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3" /> Anonymous
              </span>
            )}
            {poll.is_closed && (
              <span className="text-xs text-destructive flex items-center gap-1">
                <Lock className="h-3 w-3" /> Closed
              </span>
            )}
          </div>
          <h4 className="font-medium text-foreground">{poll.question}</h4>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-2">
              {poll.options.map((option) => {
                const percentage = poll.total_votes > 0 
                  ? Math.round((option.vote_count / poll.total_votes) * 100) 
                  : 0;
                const isSelected = poll.user_votes.includes(option.id);

                return (
                  <button
                    key={option.id}
                    onClick={() => !poll.is_closed && onVote(poll.id, option.id)}
                    disabled={poll.is_closed}
                    className={`w-full text-left relative overflow-hidden rounded-lg border transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border/50 hover:border-primary/50'
                    } ${poll.is_closed ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                  >
                    <div className="relative z-10 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                        <span className="text-sm">{option.option_text}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{option.vote_count}</span>
                        <span>{percentage}%</span>
                      </div>
                    </div>
                    {(hasVoted || poll.is_closed) && (
                      <div 
                        className="absolute inset-0 bg-primary/20 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{poll.total_votes} vote{poll.total_votes !== 1 ? 's' : ''}</span>
              </div>
              {poll.is_multiple_choice && (
                <span>Multiple choice</span>
              )}
              {canClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-destructive hover:text-destructive"
                  onClick={() => onClose(poll.id)}
                >
                  Close poll
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CreatePollDialog = ({ 
  clubId, 
  onPollCreated 
}: { 
  clubId: string;
  onPollCreated: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [creating, setCreating] = useState(false);
  const { createPoll } = useClubPolls(clubId);

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreate = async () => {
    if (!question.trim() || options.filter(o => o.trim()).length < 2) return;
    
    setCreating(true);
    await createPoll(
      question.trim(),
      options.filter(o => o.trim()),
      isMultipleChoice,
      isAnonymous
    );
    setCreating(false);
    setOpen(false);
    setQuestion('');
    setOptions(['', '']);
    setIsMultipleChoice(false);
    setIsAnonymous(false);
    onPollCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Create poll
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            New poll
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              placeholder="Ask your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Options</Label>
            <div className="space-y-2 mt-1">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                  />
                  {options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 10 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={addOption}
                className="mt-2 gap-1"
              >
                <Plus className="h-3 w-3" />
                Add an option
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="multiple" className="text-sm">
                Multiple choice
              </Label>
              <Switch
                id="multiple"
                checked={isMultipleChoice}
                onCheckedChange={setIsMultipleChoice}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="anonymous" className="text-sm">
                Anonymous votes
              </Label>
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>
          </div>

          <Button
            onClick={handleCreate}
            disabled={creating || !question.trim() || options.filter(o => o.trim()).length < 2}
            className="w-full"
          >
            {creating ? 'Creating...' : 'Create poll'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ClubPolls = ({ clubId, isAdmin = false }: ClubPollsProps) => {
  const { user } = useAuth();
  const { polls, loading, fetchPolls, vote, closePoll } = useClubPolls(clubId);
  const [showPolls, setShowPolls] = useState(false);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const activePolls = polls.filter(p => !p.is_closed);

  if (loading) return null;

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setShowPolls(!showPolls)}
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
        >
          <BarChart3 className="h-4 w-4 text-primary" />
          Polls
          {activePolls.length > 0 && (
            <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
              {activePolls.length}
            </span>
          )}
          {showPolls ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        <CreatePollDialog clubId={clubId} onPollCreated={fetchPolls} />
      </div>

      <AnimatePresence>
        {showPolls && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {activePolls.length === 0 ? (
              <div className="text-center text-muted-foreground py-4 text-xs">
                No active polls
              </div>
            ) : (
              <div className="space-y-2 mt-2 max-h-[150px] overflow-y-auto">
                {activePolls.slice(0, 3).map((poll) => (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    onVote={vote}
                    onClose={closePoll}
                    isAdmin={isAdmin}
                    userId={user?.id}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
