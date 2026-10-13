"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  type WorkCategory,
  type WorkCategoryId,
  cardMatchesCategory,
  categoriesForSlugs,
  slugFromWorkCard,
  type WorkSlug,
} from "@/lib/work-filter";
import "./work-filter.css";

const EASE = "cubic-bezier(0.19, 1, 0.22, 1)";

function findWorkSection(): HTMLElement | null {
  return (
    document.getElementById("travaux") ??
    document.querySelector<HTMLElement>(".wk.wk--r") ??
    document.querySelector<HTMLElement>(".dk .wk")
  );
}

function refreshScrollTrigger() {
  const gsap = (
    window as Window & {
      gsap?: { ScrollTrigger?: { refresh: () => void } };
    }
  ).gsap;
  gsap?.ScrollTrigger?.refresh?.();
}

export default function WorkFilter() {
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [categories, setCategories] = useState<WorkCategory[]>([]);
  const [active, setActive] = useState<WorkCategoryId>("all");
  const cardsRef = useRef<HTMLElement[]>([]);
  const gridRef = useRef<HTMLElement | null>(null);
  const slugMapRef = useRef<Map<HTMLElement, WorkSlug>>(new Map());
  const tablistRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const pendingFilterRef = useRef<WorkCategoryId | null>(null);
  const applyFilterRef = useRef<(categoryId: WorkCategoryId) => Promise<void>>(
    async () => {},
  );

  const completeFilter = useCallback((categoryId: WorkCategoryId) => {
    busyRef.current = false;
    refreshScrollTrigger();
    const pending = pendingFilterRef.current;
    if (pending && pending !== categoryId) {
      pendingFilterRef.current = null;
      void applyFilterRef.current(pending);
    } else {
      pendingFilterRef.current = null;
    }
  }, []);

  const moveIndicator = useCallback(() => {
    const list = tablistRef.current;
    const ind = indicatorRef.current;
    if (!list || !ind) return;
    const tab = list.querySelector<HTMLElement>(
      `[role="tab"][aria-selected="true"]`,
    );
    if (!tab) return;
    const lr = list.getBoundingClientRect();
    const tr = tab.getBoundingClientRect();
    const x = tr.left - lr.left + list.scrollLeft;
    const y = tr.top - lr.top;
    ind.style.width = `${tr.width}px`;
    ind.style.height = `${tr.height}px`;
    ind.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const scrollTabIntoView = useCallback((tab: HTMLElement) => {
    if (innerWidth > 768) return;
    tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, []);

  const applyFilter = useCallback(
    async (categoryId: WorkCategoryId) => {
      const cards = cardsRef.current;
      const grid = gridRef.current;
      if (!cards.length || !grid) return;
      if (busyRef.current) {
        pendingFilterRef.current = categoryId;
        return;
      }
      busyRef.current = true;

      const reduceMotion = matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const visible = (cat: WorkCategoryId) =>
        cards.filter((c) =>
          cardMatchesCategory(slugMapRef.current.get(c) ?? null, cat),
        );

      const prevVisible = new Set(
        cards.filter((c) => !c.hidden).map((c) => c),
      );
      const nextCards = visible(categoryId);
      const nextVisible = new Set(nextCards);

      const leaving = cards.filter((c) => prevVisible.has(c) && !nextVisible.has(c));
      const entering = cards.filter((c) => !prevVisible.has(c) && nextVisible.has(c));
      const staying = cards.filter((c) => prevVisible.has(c) && nextVisible.has(c));

      if (reduceMotion) {
        cards.forEach((c) => {
          c.hidden = !nextVisible.has(c);
          c.classList.remove("ak-work-card--hide", "ak-work-card--enter");
        });
        grid.style.height = "";
        completeFilter(categoryId);
        return;
      }

      const startH = grid.getBoundingClientRect().height;
      grid.style.height = `${startH}px`;

      const firstRects = new Map(
        staying.map((c) => [c, c.getBoundingClientRect()]),
      );

      leaving.forEach((c) => {
        c.classList.add("ak-work-card--hide");
      });

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 180);
      });

      leaving.forEach((c) => {
        c.hidden = true;
        c.classList.remove("ak-work-card--hide");
      });

      entering.forEach((c) => {
        c.hidden = false;
        c.classList.add("ak-work-card--enter");
      });

      staying.forEach((c) => {
        c.hidden = false;
      });

      grid.style.height = "auto";
      const endH = grid.getBoundingClientRect().height;
      grid.style.height = `${startH}px`;
      void grid.offsetHeight;

      staying.forEach((c) => {
        const first = firstRects.get(c);
        if (!first) return;
        const last = c.getBoundingClientRect();
        const dx = first.left - last.left;
        const dy = first.top - last.top;
        c.style.transition = "none";
        c.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      requestAnimationFrame(() => {
        grid.style.transition = `height 0.5s ${EASE}`;
        grid.style.height = `${endH}px`;

        staying.forEach((c) => {
          c.style.transition = `transform 0.5s ${EASE}`;
          c.style.transform = "";
        });

        requestAnimationFrame(() => {
          entering.forEach((c, i) => {
            c.style.transition = `opacity 0.5s ${EASE} ${i * 50}ms, transform 0.5s ${EASE} ${i * 50}ms`;
            c.classList.remove("ak-work-card--enter");
          });
        });
      });

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 520 + entering.length * 50);
      });

      cards.forEach((c) => {
        c.style.transition = "";
        c.style.transform = "";
        c.classList.remove("ak-work-card--enter", "ak-work-card--hide");
        c.hidden = !nextVisible.has(c);
      });

      grid.style.transition = "";
      grid.style.height = "";
      completeFilter(categoryId);
    },
    [completeFilter],
  );

  applyFilterRef.current = applyFilter;

  const activeRef = useRef<WorkCategoryId>("all");
  activeRef.current = active;

  const selectCategory = useCallback(
    (id: WorkCategoryId, tabEl?: HTMLElement) => {
      if (id === activeRef.current && !busyRef.current) return;
      setActive(id);
      if (tabEl) scrollTabIntoView(tabEl);
      void applyFilter(id);
    },
    [applyFilter, scrollTabIntoView],
  );

  useEffect(() => {
    const section = findWorkSection();
    if (!section) return;

    const cards = [
      ...section.querySelectorAll<HTMLElement>("article.wc"),
    ];
    if (!cards.length) return;

    const slugs = new Set<WorkSlug>();
    const slugMap = new Map<HTMLElement, WorkSlug>();
    cards.forEach((card) => {
      const slug = slugFromWorkCard(card);
      if (slug) {
        slugs.add(slug);
        slugMap.set(card, slug);
        card.dataset.workSlug = slug;
      }
    });
    slugMapRef.current = slugMap;
    cardsRef.current = cards;

    const cats = categoriesForSlugs(slugs);
    setCategories(cats);

    let grid = section.querySelector<HTMLElement>("#ak-work-grid");
    if (!grid) {
      grid = document.createElement("div");
      grid.id = "ak-work-grid";
      grid.className = "ak-work-grid";
      grid.setAttribute("role", "tabpanel");
      grid.setAttribute("aria-live", "polite");

      const wg = section.querySelector(".wg");
      const firstCard = cards[0];
      const insertBefore = wg ?? firstCard;
      section.insertBefore(grid, insertBefore);

      cards.forEach((card) => {
        if (card.parentElement !== grid) {
          grid!.appendChild(card);
        }
      });
    }
    gridRef.current = grid;
    grid.setAttribute("id", "ak-work-grid");

    let mountEl = section.querySelector<HTMLElement>("#ak-work-filter-root");
    if (!mountEl) {
      mountEl = document.createElement("div");
      mountEl.id = "ak-work-filter-root";
      const anchor =
        section.querySelector(".wk-h") ??
        section.querySelector("h2.sr") ??
        grid;
      anchor.insertAdjacentElement("afterend", mountEl);
    }
    setMount(mountEl);

    cards.forEach((c) => {
      c.hidden = false;
    });

    return () => {
      setMount(null);
    };
  }, []);

  useLayoutEffect(() => {
    moveIndicator();
  }, [active, categories, mount, moveIndicator]);

  useEffect(() => {
    const list = tablistRef.current;
    const wrap = wrapRef.current;
    if (!list || !wrap) return;

    const onScroll = () => {
      const scrollable = list.scrollWidth > list.clientWidth + 2;
      wrap.classList.toggle("is-scrollable", scrollable && list.scrollLeft < list.scrollWidth - list.clientWidth - 2);
    };

    const onScrollOrResize = () => {
      onScroll();
      moveIndicator();
    };
    onScrollOrResize();
    list.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      list.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [mount, categories]);

  useEffect(() => {
    window.addEventListener("resize", moveIndicator);
    return () => window.removeEventListener("resize", moveIndicator);
  }, [moveIndicator]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const tabs = [
      ...tablistRef.current!.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    ];
    const i = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    if (i < 0) return;

    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;

    e.preventDefault();
    const tab = tabs[next];
    const id = tab.dataset.categoryId as WorkCategoryId;
    selectCategory(id, tab);
    tab.focus();
  };

  if (!mount || categories.length === 0) return null;

  return createPortal(
    <div ref={wrapRef} className="ak-work-filter-wrap">
      <div
        ref={tablistRef}
        className="ak-work-filter"
        role="tablist"
        aria-label="Filtrer les réalisations par secteur"
        onKeyDown={onKeyDown}
      >
        <span ref={indicatorRef} className="ak-work-filter__indicator" aria-hidden="true" />
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            className="ak-work-filter__tab"
            id={`work-tab-${cat.id}`}
            data-category-id={cat.id}
            aria-selected={active === cat.id}
            aria-controls="ak-work-grid"
            tabIndex={active === cat.id ? 0 : -1}
            onClick={(e) => selectCategory(cat.id, e.currentTarget)}
          >
            {cat.label}
          </button>
        ))}
        <span className="ak-work-filter__fade" aria-hidden="true" />
      </div>
    </div>,
    mount,
  );
}
