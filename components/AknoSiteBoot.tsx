"use client";

import Script from "next/script";
import { useEffect } from "react";

function isInternalNavHref(href: string): boolean {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  if (href.startsWith("http://") || href.startsWith("https://")) {
    try {
      const u = new URL(href);
      return u.origin === window.location.origin;
    } catch {
      return false;
    }
  }
  return href.startsWith("/");
}

export default function AknoSiteBoot() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || !isInternalNavHref(href)) return;
      e.preventDefault();
      window.location.assign(href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <Script src="/assets/js/base.min.js" strategy="afterInteractive" />;
}
