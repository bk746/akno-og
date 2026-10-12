import type { Metadata } from "next";
import AknoPage, { aknoMetadata } from "@/components/AknoPage";

export const metadata: Metadata = aknoMetadata("services.html");

export default function ServicesPage() {
  return <AknoPage htmlPath="services.html" />;
}
