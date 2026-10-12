import type { Metadata } from "next";
import AknoPage, { aknoMetadata } from "@/components/AknoPage";

export const metadata: Metadata = aknoMetadata("index.html");

export default function Home() {
  return <AknoPage htmlPath="index.html" />;
}
