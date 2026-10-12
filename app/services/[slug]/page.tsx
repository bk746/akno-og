import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AknoPage, { aknoMetadata } from "@/components/AknoPage";
import { SERVICE_SLUGS } from "@/lib/akno-site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!SERVICE_SLUGS.includes(slug as (typeof SERVICE_SLUGS)[number])) {
    return {};
  }
  return aknoMetadata(`services/${slug}.html`);
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!SERVICE_SLUGS.includes(slug as (typeof SERVICE_SLUGS)[number])) {
    notFound();
  }
  return <AknoPage htmlPath={`services/${slug}.html`} />;
}
