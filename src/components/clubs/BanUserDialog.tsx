import { useState } from "react";
import { motion } from "framer-motion";
import { Ban, AlertTriangle, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClubBan } from "@/hooks/useClubBan";

interface BanUserDialogProps {
  clubId: string;
  userId: string;
  userName: string;
  trigger?: React.ReactNode;
  onBanned?: () => void;
}

export const BanUserDialog = ({ clubId, userId, userName, trigger, onBanned }: BanUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const { banMember, loading } = useClubBan(clubId);

  const handleBan = async () => {
    if (confirmText !== "BAN") return;

    const success = await banMember(userId, reason || undefined);
    if (success) {
      setOpen(false);
      setReason("");
      setConfirmText("");
      onBanned?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
            <Ban className="h-3 w-3" />
            Ban
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Ban className="h-5 w-5" />
            Ban {userName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">Irreversible action</p>
                <p className="text-sm text-destructive/80 mt-1">
                  {userName} will be permanently removed from the club and cannot rejoin until an administrator
                  unbans them.
                </p>
                <ul className="text-sm text-destructive/80 mt-2 list-disc list-inside space-y-1">
                  <li>Will be removed from the member list</li>
                  <li>Will lose access to club chat</li>
                  <li>Will no longer take part in club activities</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <div>
            <Label htmlFor="reason">Ban reason (optional)</Label>
            <Input
              id="reason"
              placeholder="Example: toxic behavior, repeated spam..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="confirm" className="text-destructive">
              Type BAN to confirm
            </Label>
            <Input
              id="confirm"
              placeholder="BAN"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              className="mt-1 border-destructive/50 focus:border-destructive"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={loading || confirmText !== "BAN"}
              className="flex-1 gap-2"
            >
              <UserX className="h-4 w-4" />
              {loading ? "Banning..." : "Confirm ban"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
