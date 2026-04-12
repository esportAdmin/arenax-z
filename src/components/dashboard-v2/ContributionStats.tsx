export default function ContributionStats() {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">Your Contribution</h3>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-muted-foreground text-sm">Accuracy</div>
          <div className="font-bold text-lg">85%</div>
        </div>

        <div>
          <div className="text-muted-foreground text-sm">Points</div>
          <div className="font-bold text-lg text-green-400">+245</div>
        </div>

        <div>
        <div className="text-muted-foreground text-sm">Live calls</div>
          <div className="font-bold text-lg">12</div>
        </div>
      </div>
    </div>
  );
}
