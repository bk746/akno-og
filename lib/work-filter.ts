export const WORK_SLUGS = [
  "veillee",
  "alric",
  "vauclair",
  "lacets",
  "sublimessence",
] as const;

export type WorkSlug = (typeof WORK_SLUGS)[number];

export type WorkCategoryId =
  | "all"
  | "artisans-btp"
  | "artisanat-art"
  | "luxe-auto"
  | "culture-expo";

export type WorkCategory = {
  id: WorkCategoryId;
  label: string;
  slugs: readonly WorkSlug[];
};

export const WORK_CATEGORIES: readonly WorkCategory[] = [
  { id: "all", label: "Tous", slugs: WORK_SLUGS },
  {
    id: "artisans-btp",
    label: "Artisans & BTP",
    slugs: ["alric", "vauclair"],
  },
  {
    id: "artisanat-art",
    label: "Artisanat d’art",
    slugs: ["sublimessence"],
  },
  {
    id: "luxe-auto",
    label: "Luxe & automobile",
    slugs: ["lacets"],
  },
  {
    id: "culture-expo",
    label: "Culture & expo",
    slugs: ["veillee"],
  },
] as const;

export function slugFromWorkCard(card: HTMLElement): WorkSlug | null {
  const a = card.querySelector<HTMLAnchorElement>('a[href*="realisations/"]');
  const href = a?.getAttribute("href") ?? "";
  const m = href.match(/realisations\/([^./?#]+)/);
  if (!m) return null;
  const slug = m[1].replace(/\.html$/, "") as WorkSlug;
  return WORK_SLUGS.includes(slug) ? slug : null;
}

export function categoriesForSlugs(present: Set<WorkSlug>): WorkCategory[] {
  return WORK_CATEGORIES.filter((cat) => {
    if (cat.id === "all") return present.size > 0;
    return cat.slugs.some((s) => present.has(s));
  });
}

export function cardMatchesCategory(
  slug: WorkSlug | null,
  categoryId: WorkCategoryId,
): boolean {
  if (!slug) return false;
  if (categoryId === "all") return true;
  const cat = WORK_CATEGORIES.find((c) => c.id === categoryId);
  return cat ? cat.slugs.includes(slug) : false;
}
