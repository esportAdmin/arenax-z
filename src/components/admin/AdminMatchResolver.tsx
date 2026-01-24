import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResolveResult {
  success: boolean;
  error?: string;
  match_id?: string;
  winning_team?: string;
  resolved_count?: number;
  won_count?: number;
  lost_count?: number;
}

export const AdminMatchResolver = () => {
  const [matchId, setMatchId] = useState("");
  const [winningTeam, setWinningTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<ResolveResult | null>(null);

  const handleResolve = async () => {
    if (!matchId.trim()) {
      toast.error("Le Match ID est requis");
      return;
    }

    if (!winningTeam.trim()) {
      toast.error("Le nom de l'équipe gagnante est requis");
      return;
    }

    setLoading(true);
    setLastResult(null);

    try {
      const { data, error } = await supabase.rpc("resolve_match", {
        p_match_id: matchId.trim(),
        p_winning_team: winningTeam.trim(),
      });

      if (error) {
        toast.error(`Erreur: ${error.message}`);
        setLastResult({ success: false, error: error.message });
        return;
      }

      const result = data as unknown as ResolveResult;

      if (!result.success) {
        toast.error(result.error || "Erreur inconnue");
        setLastResult(result);
        return;
      }

      toast.success(`Match résolu ! ${result.won_count} gagnants, ${result.lost_count} perdants`);
      setLastResult(result);

      // Reset form
      setMatchId("");
      setWinningTeam("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(errorMessage);
      setLastResult({ success: false, error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Résolution des Matchs
        </CardTitle>
        <CardDescription>
          Résolvez manuellement un match et distribuez les récompenses (XP, Points, Streaks)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="matchId">Match ID</Label>
            <Input
              id="matchId"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
              placeholder="Ex: match_12345 ou CSGO_2024_final"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">L'identifiant unique du match à résoudre</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="winningTeam">Équipe Gagnante</Label>
            <Input
              id="winningTeam"
              value={winningTeam}
              onChange={(e) => setWinningTeam(e.target.value)}
              placeholder="Ex: Team Vitality ou G2 Esports"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Le nom exact de l'équipe gagnante (doit correspondre aux prédictions)
            </p>
          </div>
        </div>

        <Button onClick={handleResolve} disabled={loading || !matchId.trim() || !winningTeam.trim()} className="w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Résolution en cours...
            </>
          ) : (
            <>
              <Trophy className="h-4 w-4 mr-2" />
              Résoudre et Payer
            </>
          )}
        </Button>

        {lastResult && (
          <Alert variant={lastResult.success ? "default" : "destructive"}>
            {lastResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>
              {lastResult.success ? (
                <div className="space-y-1">
                  <p>
                    <strong>Match résolu avec succès !</strong>
                  </p>
                  <p>Match ID: {lastResult.match_id}</p>
                  <p>Équipe gagnante: {lastResult.winning_team}</p>
                  <p>Prédictions traitées: {lastResult.resolved_count}</p>
                  <p className="text-green-600">✓ Gagnants: {lastResult.won_count}</p>
                  <p className="text-red-600">✗ Perdants: {lastResult.lost_count}</p>
                </div>
              ) : (
                <p>{lastResult.error}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">Actions effectuées :</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Mise à jour du statut des prédictions (won/lost)</li>
            <li>Crédit des gains aux gagnants (arena_balance)</li>
            <li>Attribution de 50 XP aux gagnants</li>
            <li>Mise à jour des streaks (incrémenté ou remis à 0)</li>
            <li>Enregistrement dans le ledger</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
