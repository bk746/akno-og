import AknoSiteBoot from "@/components/AknoSiteBoot";
import { loadAknoPage } from "@/lib/akno-site";

type AknoPageProps = {
  htmlPath: string;
};

export default function AknoPage({ htmlPath }: AknoPageProps) {
  const page = loadAknoPage(htmlPath);
  return (
    <>
      <style
        id={`akno-critical-${htmlPath.replace(/[^\w-]+/g, "-")}`}
        dangerouslySetInnerHTML={{ __html: page.criticalCss }}
      />
      <div
        id="akno-page"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
      />
      <AknoSiteBoot />
    </>
  );
}

export function aknoMetadata(htmlPath: string) {
  const page = loadAknoPage(htmlPath);
  return {
    title: page.title,
    description: page.description,
    icons: {
      icon: [
        { url: "/assets/favicon.svg", type: "image/svg+xml" },
        { url: "/assets/favicon-32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/assets/apple-touch-icon.png",
    },
  };
}
