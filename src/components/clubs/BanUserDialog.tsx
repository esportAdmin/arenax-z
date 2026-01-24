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
    if (confirmText !== "BANNIR") return;

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
            Bannir
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Ban className="h-5 w-5" />
            Bannir {userName}
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
                <p className="font-semibold text-destructive">Action irréversible</p>
                <p className="text-sm text-destructive/80 mt-1">
                  {userName} sera définitivement exclu du club et ne pourra plus le rejoindre tant qu'un administrateur
                  ne le débannit pas.
                </p>
                <ul className="text-sm text-destructive/80 mt-2 list-disc list-inside space-y-1">
                  <li>Sera retiré de la liste des membres</li>
                  <li>Ne pourra plus voir le chat du club</li>
                  <li>Ne pourra plus participer aux activités</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <div>
            <Label htmlFor="reason">Raison du bannissement (optionnel)</Label>
            <Input
              id="reason"
              placeholder="Ex: Comportement toxique, spam répété..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="confirm" className="text-destructive">
              Tapez BANNIR pour confirmer
            </Label>
            <Input
              id="confirm"
              placeholder="BANNIR"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              className="mt-1 border-destructive/50 focus:border-destructive"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleBan}
              disabled={loading || confirmText !== "BANNIR"}
              className="flex-1 gap-2"
            >
              <UserX className="h-4 w-4" />
              {loading ? "Bannissement..." : "Confirmer le bannissement"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
