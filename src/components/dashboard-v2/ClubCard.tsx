type Props = {
  club: any;
};

export default function ClubCard({ club }: Props) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">Your Club</h3>

      <div className="text-4xl font-bold text-orange-400">
        #{club?.rank ?? 3}
      </div>

      <div className="mt-2 text-sm">{club?.name ?? "Eclipse Esports"}</div>
    </div>
  );
}
