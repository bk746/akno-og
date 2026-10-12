import type { Metadata } from "next";
import AknoPage, { aknoMetadata } from "@/components/AknoPage";

export const metadata: Metadata = aknoMetadata("contact.html");

export default function ContactPage() {
  return <AknoPage htmlPath="contact.html" />;
}
