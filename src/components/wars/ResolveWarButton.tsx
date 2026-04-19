"use client";

import { useResolveWar } from "@/hooks/useResolveWar";

interface Props {
  warId: string;
}

export default function ResolveWarButton({ warId }: Props) {
  const { loading, result, resolveWar } = useResolveWar();

  return (
    <div className="mt-3 space-y-2">
      <button
        type="button"
        onClick={() => resolveWar(warId)}
        disabled={loading}
        className="rounded bg-emerald-500 px-3 py-2 text-xs font-semibold text-black disabled:opacity-50"
      >
        {loading ? "Resolving..." : "Resolve War"}
      </button>

      {result?.message && (
        <div
          className={`text-xs ${
            result.success ? "text-green-400" : "text-red-400"
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}
