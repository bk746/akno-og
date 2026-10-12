"use client";

import { useEffect } from "react";

const BASE_SCRIPT = "/assets/js/base.js";

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
    const script = document.createElement("script");
    script.src = BASE_SCRIPT;
    script.defer = true;
    document.body.appendChild(script);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || !isInternalNavHref(href)) return;
      e.preventDefault();
      window.location.assign(href);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      script.remove();
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
