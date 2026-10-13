import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://akno.fr"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/assets/fonts/mona-sans-sub.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="/assets/svc-mobile.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
