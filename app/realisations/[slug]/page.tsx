import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AknoPage, { aknoMetadata } from "@/components/AknoPage";
import { REALISATION_SLUGS } from "@/lib/akno-site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return REALISATION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!REALISATION_SLUGS.includes(slug as (typeof REALISATION_SLUGS)[number])) {
    return {};
  }
  return aknoMetadata(`realisations/${slug}.html`);
}

export default async function RealisationDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!REALISATION_SLUGS.includes(slug as (typeof REALISATION_SLUGS)[number])) {
    notFound();
  }
  return <AknoPage htmlPath={`realisations/${slug}.html`} />;
}
