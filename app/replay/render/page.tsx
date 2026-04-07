import ReplayRenderPage from "@/components/replay/ReplayRenderPage";

export const dynamic = "force-dynamic";

export default function Page({
  searchParams,
}: {
  searchParams?: { secret?: string | string[] };
}) {
  const secret = Array.isArray(searchParams?.secret)
    ? searchParams.secret[0] ?? null
    : searchParams?.secret ?? null;

  return <ReplayRenderPage secret={secret} />;
}
