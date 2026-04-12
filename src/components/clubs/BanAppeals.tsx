import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  CheckCircle,
  Clock,
  MessageSquare,
  Scale,
  X,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BanAppeal, useBanAppeals } from "@/hooks/useBanAppeals";

interface BanAppealsListProps {
  clubId: string;
}

const AppealStatusBadge = ({ status }: { status: BanAppeal["status"] }) => {
  const config = {
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-amber-500/20 text-amber-500",
    },
    approved: {
      label: "Approved",
      icon: CheckCircle,
      className: "bg-green-500/20 text-green-500",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      className: "bg-destructive/20 text-destructive",
    },
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
  onRespond: (
    id: string,
    approved: boolean,
    response?: string,
  ) => Promise<boolean>;
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
      className="rounded-lg border border-border/50 bg-card/50 p-4"
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={appeal.profile?.avatar_url || undefined} />
          <AvatarFallback>
            {appeal.profile?.display_name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">
              {appeal.profile?.display_name || "Unknown user"}
            </span>
            <AppealStatusBadge status={appeal.status} />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(appeal.created_at), {
              addSuffix: true,
              locale: enUS,
            })}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-muted/50 p-3">
        <p className="mb-1 text-sm font-medium">Appeal reason:</p>
        <p className="text-sm text-muted-foreground">{appeal.reason}</p>
      </div>

      {appeal.admin_response ? (
        <div className="mt-2 rounded-r-lg border-l-2 border-primary bg-primary/5 p-3">
          <p className="mb-1 text-sm font-medium">Admin response:</p>
          <p className="text-sm text-muted-foreground">
            {appeal.admin_response}
          </p>
        </div>
      ) : null}

      {appeal.status === "pending" ? (
        <AnimatePresence>
          {showResponse ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-3"
            >
              <Textarea
                placeholder="Reply to the user (optional)..."
                value={response}
                onChange={(event) => setResponse(event.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResponse(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRespond(false)}
                  disabled={responding}
                  className="flex-1 gap-1"
                >
                  <X className="h-3 w-3" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleRespond(true)}
                  disabled={responding}
                  className="flex-1 gap-1"
                >
                  <Check className="h-3 w-3" />
                  Approve
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 flex justify-end"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResponse(true)}
                className="gap-1"
              >
                <MessageSquare className="h-3 w-3" />
                Reply
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      ) : null}
    </motion.div>
  );
};

export const BanAppealsList = ({ clubId }: BanAppealsListProps) => {
  const [open, setOpen] = useState(false);
  const { appeals, pendingAppeals, loading, respondToAppeal } =
    useBanAppeals(clubId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Scale className="h-4 w-4" />
          Appeals
          {pendingAppeals.length > 0 ? (
            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-500">
              {pendingAppeals.length}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] max-w-lg flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Ban appeals
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
            </div>
          ) : appeals.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Scale className="mx-auto mb-2 h-12 w-12 opacity-30" />
              <p>No appeals</p>
            </div>
          ) : (
            appeals.map((appeal) => (
              <AppealCard
                key={appeal.id}
                appeal={appeal}
                onRespond={respondToAppeal}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface SubmitAppealDialogProps {
  clubId: string;
  clubName: string;
}

export const SubmitAppealDialog = ({
  clubId,
  clubName,
}: SubmitAppealDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { myAppeal, loading, submitAppeal } = useBanAppeals(clubId);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      return;
    }

    const success = await submitAppeal(reason);
    if (success) {
      setOpen(false);
      setReason("");
    }
  };

  if (myAppeal) {
    return (
      <div className="rounded-lg border border-border/50 bg-card/50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Your appeal</h3>
          <AppealStatusBadge status={myAppeal.status} />
        </div>
        <p className="mb-2 text-sm text-muted-foreground">
          Submitted{" "}
          {formatDistanceToNow(new Date(myAppeal.created_at), {
            addSuffix: true,
            locale: enUS,
          })}
        </p>
        <div className="rounded-lg bg-muted/50 p-3 text-sm">
          {myAppeal.reason}
        </div>
        {myAppeal.admin_response ? (
          <div className="mt-2 rounded-r-lg border-l-2 border-primary bg-primary/5 p-3 text-sm">
            <p className="mb-1 font-medium">Response:</p>
            <p className="text-muted-foreground">{myAppeal.admin_response}</p>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Scale className="h-4 w-4" />
          Submit appeal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Appeal your ban
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                <p>
                  You have been banned from <strong>{clubName}</strong>.
                </p>
                <p className="mt-1">
                  Explain why you believe this ban is not justified.
                  Administrators will review your request.
                </p>
              </div>
            </div>
          </div>

          <div>
            <Textarea
              placeholder="Explain your situation..."
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={4}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Please stay respectful and honest in your explanation.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !reason.trim()}
              className="flex-1"
            >
              {loading ? "Submitting..." : "Submit appeal"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
