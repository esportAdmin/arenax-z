import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ban, UserCheck, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useClubBan } from '@/hooks/useClubBan';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface BannedMembersListProps {
  clubId: string;
}

export const BannedMembersList = ({ clubId }: BannedMembersListProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { bannedMembers, loading, unbanMember } = useClubBan(clubId);
  const [unbanning, setUnbanning] = useState<string | null>(null);

  const filteredMembers = bannedMembers.filter(member => 
    member.profile?.display_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUnban = async (userId: string) => {
    setUnbanning(userId);
    await unbanMember(userId);
    setUnbanning(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Ban className="h-4 w-4" />
          Banned
          {bannedMembers.length > 0 && (
            <span className="bg-destructive/20 text-destructive text-xs px-1.5 py-0.5 rounded-full">
              {bannedMembers.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-destructive" />
            Banned members
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4 flex-1 overflow-hidden flex flex-col">
          {bannedMembers.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No banned members</p>
              </div>
            ) : (
              filteredMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-card/50 border border-border/50 rounded-lg"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.profile?.avatar_url || undefined} />
                    <AvatarFallback>
                      {member.profile?.display_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {member.profile?.display_name || 'Unknown user'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Banned {formatDistanceToNow(new Date(member.banned_at), { addSuffix: true, locale: enUS })}
                    </p>
                    {member.reason && (
                      <p className="text-xs text-destructive/80 mt-1 truncate">
                        Reason: {member.reason}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnban(member.user_id)}
                    disabled={unbanning === member.user_id}
                    className="gap-1 shrink-0"
                  >
                    <UserCheck className="h-3 w-3" />
                    {unbanning === member.user_id ? '...' : 'Unban'}
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
