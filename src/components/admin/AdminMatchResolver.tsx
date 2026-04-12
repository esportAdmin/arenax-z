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
      toast.error("Match ID is required");
      return;
    }

    if (!winningTeam.trim()) {
      toast.error("Winning team name is required");
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
        toast.error(`Error: ${error.message}`);
        setLastResult({ success: false, error: error.message });
        return;
      }

      const result = data as unknown as ResolveResult;

      if (!result.success) {
        toast.error(result.error || "Unknown error");
        setLastResult(result);
        return;
      }

      toast.success(`Match resolved! ${result.won_count} winners, ${result.lost_count} losers`);
      setLastResult(result);

      // Reset form
      setMatchId("");
      setWinningTeam("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
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
          Match Resolution
        </CardTitle>
        <CardDescription>
          Resolve a match manually and distribute rewards (XP, Points, Streaks)
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
            <p className="text-xs text-muted-foreground">The unique match identifier to resolve</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="winningTeam">Winning Team</Label>
            <Input
              id="winningTeam"
              value={winningTeam}
              onChange={(e) => setWinningTeam(e.target.value)}
              placeholder="Ex: Team Vitality ou G2 Esports"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              The exact winning team name, matching the prediction records
            </p>
          </div>
        </div>

        <Button onClick={handleResolve} disabled={loading || !matchId.trim() || !winningTeam.trim()} className="w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Resolving...
            </>
          ) : (
            <>
              <Trophy className="h-4 w-4 mr-2" />
              Resolve and Payout
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
                    <strong>Match resolved successfully!</strong>
                  </p>
                  <p>Match ID: {lastResult.match_id}</p>
                  <p>Winning team: {lastResult.winning_team}</p>
              <p>Live calls processed: {lastResult.resolved_count}</p>
                  <p className="text-green-600">✓ Winners: {lastResult.won_count}</p>
                  <p className="text-red-600">✗ Losers: {lastResult.lost_count}</p>
                </div>
              ) : (
                <p>{lastResult.error}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">Actions performed:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Prediction status updated (won/lost)</li>
            <li>Winnings credited to successful players (arena_balance)</li>
            <li>50 XP awarded to winners</li>
            <li>Streaks updated (incremented or reset to 0)</li>
            <li>Ledger entry recorded</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
