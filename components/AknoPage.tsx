import AknoSiteBoot from "@/components/AknoSiteBoot";
import WorkFilter from "@/components/WorkFilter";
import { loadAknoPage } from "@/lib/akno-site";

const WORK_FILTER_PAGES = new Set(["index.html", "realisations.html"]);

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
      {WORK_FILTER_PAGES.has(htmlPath) ? <WorkFilter /> : null}
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
