import type { Metadata } from "next";
import AknoPage, { aknoMetadata } from "@/components/AknoPage";

export const metadata: Metadata = aknoMetadata("realisations.html");

export default function RealisationsPage() {
  return <AknoPage htmlPath="realisations.html" />;
}
