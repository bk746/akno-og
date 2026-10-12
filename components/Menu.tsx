"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./menu.css";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/#copilot", label: "Copilot" },
  { href: "/#a-propos", label: "À propos" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

const CONTACT_LINKS = [
  { href: "mailto:aknoweb.contact@gmail.com", label: "aknoweb.contact@gmail.com" },
  { href: "tel:+33781990761", label: "07\u00a081\u00a099\u00a007\u00a061" },
] as const;

type MenuState = "closed" | "open" | "closing";

export default function Menu() {
  const [menuState, setMenuState] = useState<MenuState>("closed");
  const [revealed, setRevealed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);

  const setOpen = useCallback((next: boolean) => {
    if (next) {
      setMenuState("open");
      return;
    }
    setMenuState((s) => (s === "open" ? "closing" : s));
  }, []);

  openRef.current = menuState === "open";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (menuState !== "open") {
      setRevealed(false);
      return;
    }
    setRevealed(false);
    let outer = 0;
    let inner = 0;
    outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setRevealed(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [menuState]);

  useEffect(() => {
    const root = document.documentElement;
    const lock = menuState === "open" || menuState === "closing";
    root.classList.toggle("ak-menu-open", lock);
    root.style.overflow = menuState === "open" ? "hidden" : "";
    return () => {
      root.classList.remove("ak-menu-open");
      root.style.overflow = "";
    };
  }, [menuState]);

  useEffect(() => {
    const syncBu = (open: boolean) => {
      const bu = buRef.current;
      if (!bu) return;
      bu.setAttribute("aria-expanded", open ? "true" : "false");
      bu.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      bu.setAttribute("aria-controls", "ak-menu-panel");
    };
    syncBu(menuState === "open");
  }, [menuState]);

  useEffect(() => {
    const hideLegacy = () => {
      const mn = document.getElementById("mn");
      if (mn) mn.hidden = true;
    };

    const syncBuButton = () => {
      const bu = document.getElementById("bu") as HTMLButtonElement | null;
      if (!bu) return;
      buRef.current = bu;
      bu.setAttribute("aria-controls", "ak-menu-panel");
      hideLegacy();
    };

    const onDocClick = (e: Event) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const bu = target.closest("#bu");
      if (!bu || bu.id !== "bu") return;
      e.preventDefault();
      e.stopImmediatePropagation();
      buRef.current = bu as HTMLButtonElement;
      setOpen(!openRef.current);
    };

    syncBuButton();
    document.addEventListener("click", onDocClick, true);

    const mo = new MutationObserver(syncBuButton);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      document.removeEventListener("click", onDocClick, true);
      buRef.current = null;
    };
  }, [setOpen]);

  useEffect(() => {
    if (menuState !== "closing") return;
    const panel = menuRef.current;
    if (!panel) {
      setMenuState("closed");
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prop = reduceMotion ? "opacity" : "clip-path";
    const fallback = window.setTimeout(() => setMenuState("closed"), reduceMotion ? 280 : 520);

    const onEnd = (e: TransitionEvent) => {
      if (e.target !== panel || e.propertyName !== prop) return;
      window.clearTimeout(fallback);
      setMenuState("closed");
      buRef.current?.focus();
    };

    panel.addEventListener("transitionend", onEnd);
    return () => {
      window.clearTimeout(fallback);
      panel.removeEventListener("transitionend", onEnd);
    };
  }, [menuState]);

  useEffect(() => {
    if (menuState !== "open" || !menuRef.current) return;

    const menu = menuRef.current;
    const focusables = () =>
      [...menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(
        (el) => el.offsetParent !== null || menu.contains(el),
      );

    const first = focusables()[0];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (menu.contains(t) || buRef.current?.contains(t)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuState, setOpen]);

  const onNavClick = () => setOpen(false);

  if (!mounted || menuState === "closed") return null;

  const panelState =
    menuState === "closing"
      ? "closing"
      : menuState === "open" && revealed
        ? "open"
        : menuState === "open"
          ? "opening"
          : "closed";

  const linkDelay = (i: number) =>
    panelState === "open" ? `${0.18 + i * 0.06}s` : "0s";
  const contactBase = NAV_LINKS.length;

  return createPortal(
    <div
      ref={menuRef}
      id="ak-menu-panel"
      className="ak-menu"
      data-state={panelState}
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
    >
      <div className="ak-menu__inner">
        <nav className="ak-menu__nav" aria-label="Navigation">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              className="ak-menu__link"
              href={link.href}
              onClick={onNavClick}
            >
              <span
                className="ak-menu__link-inner"
                style={{ transitionDelay: linkDelay(i) }}
              >
                {link.label}
              </span>
            </a>
          ))}
        </nav>
        <div className="ak-menu__contact">
          {CONTACT_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onNavClick}
            >
              <span
                className="ak-menu__contact-inner"
                style={{ transitionDelay: linkDelay(contactBase + i) }}
              >
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
