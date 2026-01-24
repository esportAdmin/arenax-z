import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, MessageSquare, Check, X, Clock, CheckCircle, XCircle, AlertCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useBanAppeals, BanAppeal } from "@/hooks/useBanAppeals";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface BanAppealsListProps {
  clubId: string;
}

const AppealStatusBadge = ({ status }: { status: BanAppeal["status"] }) => {
  const config = {
    pending: { label: "En attente", icon: Clock, className: "bg-amber-500/20 text-amber-500" },
    approved: { label: "Accepté", icon: CheckCircle, className: "bg-green-500/20 text-green-500" },
    rejected: { label: "Refusé", icon: XCircle, className: "bg-destructive/20 text-destructive" },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <Badge variant="outline" className={`gap-1 ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};

const AppealCard = ({
  appeal,
  onRespond,
}: {
  appeal: BanAppeal;
  onRespond: (id: string, approved: boolean, response?: string) => Promise<boolean>;
}) => {
  const [showResponse, setShowResponse] = useState(false);
  const [response, setResponse] = useState("");
  const [responding, setResponding] = useState(false);

  const handleRespond = async (approved: boolean) => {
    setResponding(true);
    await onRespond(appeal.id, approved, response || undefined);
    setResponding(false);
    setShowResponse(false);
    setResponse("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/50 border border-border/50 rounded-lg p-4"
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={appeal.profile?.avatar_url || undefined} />
          <AvatarFallback>{appeal.profile?.display_name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{appeal.profile?.display_name || "Utilisateur inconnu"}</span>
            <AppealStatusBadge status={appeal.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDistanceToNow(new Date(appeal.created_at), { addSuffix: true, locale: fr })}
          </p>
        </div>
      </div>

      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
        <p className="text-sm font-medium mb-1">Raison de l'appel :</p>
        <p className="text-sm text-muted-foreground">{appeal.reason}</p>
      </div>

      {appeal.admin_response && (
        <div className="mt-2 p-3 bg-primary/5 border-l-2 border-primary rounded-r-lg">
          <p className="text-sm font-medium mb-1">Réponse de l'admin :</p>
          <p className="text-sm text-muted-foreground">{appeal.admin_response}</p>
        </div>
      )}

      {appeal.status === "pending" && (
        <AnimatePresence>
          {showResponse ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-3"
            >
              <Textarea
                placeholder="Réponse à l'utilisateur (optionnel)..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowResponse(false)} className="flex-1">
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRespond(false)}
                  disabled={responding}
                  className="flex-1 gap-1"
                >
                  <X className="h-3 w-3" />
                  Refuser
                </Button>
                <Button size="sm" onClick={() => handleRespond(true)} disabled={responding} className="flex-1 gap-1">
                  <Check className="h-3 w-3" />
                  Accepter
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowResponse(true)} className="gap-1">
                <MessageSquare className="h-3 w-3" />
                Répondre
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export const BanAppealsList = ({ clubId }: BanAppealsListProps) => {
  const [open, setOpen] = useState(false);
  const { appeals, pendingAppeals, loading, respondToAppeal } = useBanAppeals(clubId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Scale className="h-4 w-4" />
          Appels
          {pendingAppeals.length > 0 && (
            <span className="bg-amber-500/20 text-amber-500 text-xs px-1.5 py-0.5 rounded-full">
              {pendingAppeals.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Appels de bannissement
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : appeals.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Scale className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>Aucun appel</p>
            </div>
          ) : (
            appeals.map((appeal) => <AppealCard key={appeal.id} appeal={appeal} onRespond={respondToAppeal} />)
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Component for banned users to submit an appeal
interface SubmitAppealDialogProps {
  clubId: string;
  clubName: string;
}

export const SubmitAppealDialog = ({ clubId, clubName }: SubmitAppealDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { myAppeal, loading, submitAppeal } = useBanAppeals(clubId);

  const handleSubmit = async () => {
    if (!reason.trim()) return;

    const success = await submitAppeal(reason);
    if (success) {
      setOpen(false);
      setReason("");
    }
  };

  // If user already has a pending or recent appeal
  if (myAppeal) {
    return (
      <div className="p-4 bg-card/50 border border-border/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Votre appel</h3>
          <AppealStatusBadge status={myAppeal.status} />
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Soumis {formatDistanceToNow(new Date(myAppeal.created_at), { addSuffix: true, locale: fr })}
        </p>
        <div className="p-3 bg-muted/50 rounded-lg text-sm">{myAppeal.reason}</div>
        {myAppeal.admin_response && (
          <div className="mt-2 p-3 bg-primary/5 border-l-2 border-primary rounded-r-lg text-sm">
            <p className="font-medium mb-1">Réponse :</p>
            <p className="text-muted-foreground">{myAppeal.admin_response}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Scale className="h-4 w-4" />
          Faire appel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Contester votre bannissement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p>
                  Vous avez été banni de <strong>{clubName}</strong>.
                </p>
                <p className="mt-1">
                  Expliquez pourquoi vous pensez que ce bannissement n'est pas justifié. Les administrateurs examineront
                  votre demande.
                </p>
              </div>
            </div>
          </div>

          <div>
            <Textarea
              placeholder="Expliquez votre situation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">Soyez respectueux et honnête dans votre explication.</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !reason.trim()} className="flex-1">
              {loading ? "Envoi..." : "Soumettre l'appel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
