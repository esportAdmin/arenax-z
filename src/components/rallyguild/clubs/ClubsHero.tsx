import { Building2, Map, Swords, Users } from "lucide-react";

const stats = [
  { icon: Building2, label: "Total Clubs", value: "8" },
  { icon: Users, label: "Active Members", value: "450,000+" },
  { icon: Map, label: "Territories", value: "8,900+" },
  { icon: Swords, label: "Daily Wars", value: "1,245" },
];

/**
 * Renders the neon directory hero for the Clubs page.
 *
 * Example:
 * ```tsx
 * <ClubsHero />
 * ```
 */
export function ClubsHero() {
  return (
    <section className="relative overflow-hidden rounded-[2.2rem] border border-cyan-300/18 bg-slate-950/72 px-5 py-10 text-center shadow-[0_0_70px_rgba(34,211,238,0.08)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_100%_20%,rgba(168,85,247,0.2),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(249,115,22,0.1),transparent_30%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(34,211,238,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.16)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative mx-auto max-w-4xl">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/24 bg-cyan-300/10 px-4 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.22em] text-cyan-100">
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.85)]" />
          Active clubs worldwide
        </div>
        <h1 className="font-display text-5xl font-black uppercase leading-none text-white md:text-7xl">
          Join the{" "}
          <span className="bg-gradient-to-r from-cyan-200 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
            Elite
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
          Choose your alliance. Conquer territories. Give members a public
          identity worth returning to every day.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-[1.25rem] border border-cyan-300/20 bg-white/[0.055] p-4">
              <Icon className="mx-auto h-5 w-5 text-cyan-200" />
              <div className="mt-2 font-display text-2xl font-black text-cyan-100">
                {value}
              </div>
              <div className="mt-1 text-xs font-bold text-slate-300">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
