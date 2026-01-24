import { useState } from 'react';
import { motion } from 'framer-motion';
import { VolumeX, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useClubMute } from '@/hooks/useClubMute';

interface MuteUserDialogProps {
  clubId: string;
  userId: string;
  userName: string;
  trigger?: React.ReactNode;
  onMuted?: () => void;
}

const MUTE_DURATIONS = [
  { value: '5', label: '5 minutes' },
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 heure' },
  { value: '360', label: '6 heures' },
  { value: '1440', label: '24 heures' },
  { value: 'custom', label: 'Personnalisé' },
];

export const MuteUserDialog = ({ 
  clubId, 
  userId, 
  userName, 
  trigger,
  onMuted 
}: MuteUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('15');
  const [customDuration, setCustomDuration] = useState('');
  const [reason, setReason] = useState('');
  const { muteMember, loading } = useClubMute(clubId);

  const handleMute = async () => {
    const duration = selectedDuration === 'custom' 
      ? parseInt(customDuration) 
      : parseInt(selectedDuration);
    
    if (isNaN(duration) || duration <= 0) {
      return;
    }

    const success = await muteMember(userId, duration, reason || undefined);
    if (success) {
      setOpen(false);
      setReason('');
      setSelectedDuration('15');
      setCustomDuration('');
      onMuted?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
            <VolumeX className="h-3 w-3" />
            Mute
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <VolumeX className="h-5 w-5 text-destructive" />
            Mute {userName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive">
                {userName} ne pourra plus envoyer de messages dans le chat du club pendant la durée du mute.
              </p>
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4" />
              Durée du mute
            </Label>
            <RadioGroup
              value={selectedDuration}
              onValueChange={setSelectedDuration}
              className="grid grid-cols-2 gap-2"
            >
              {MUTE_DURATIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            {selectedDuration === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2"
              >
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Durée"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    min="1"
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <Label htmlFor="reason">Raison (optionnel)</Label>
            <Input
              id="reason"
              placeholder="Ex: Spam, comportement inapproprié..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleMute}
              disabled={loading || (selectedDuration === 'custom' && (!customDuration || parseInt(customDuration) <= 0))}
              className="flex-1"
            >
              {loading ? 'Mute en cours...' : 'Confirmer le mute'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
