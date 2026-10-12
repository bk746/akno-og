import type { Metadata } from "next";
import Script from "next/script";
import Menu from "@/components/Menu";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://akno.fr"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="no-pre" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/assets/fonts/mona-sans-sub.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <Script
          id="ak-no-pre"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.akIntro||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("no-pre")}catch(e){}`,
          }}
        />
      </head>
      <body>
        {children}
        <Menu />
      </body>
    </html>
  );
}
