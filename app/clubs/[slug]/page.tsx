import ClubDetail from "@/legacy-pages/ClubDetail";

interface PageProps {
  params: { slug: string };
}

export default function ClubPage({ params }: PageProps) {
  return <ClubDetail slug={params.slug} />;
}
