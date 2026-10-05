import type { FresherProfile } from "../game/placement";
import { nextUnit } from "../game/rng";

export type CompanyTier = "seed" | "growth" | "established" | "giant";
export type CompanyType =
  "startup" | "product" | "agency" | "enterprise" | "remote";

export type Company = {
  id: string;
  name: string;
  tier: CompanyTier;
  type: CompanyType;
  salary: number;
  learning: number;
  energyCost: number;
  minSkill: number;
  /** Share of each payday paid in the company's own stock. Zero for private companies. */
  stockPercent: number;
  summary: string;
};

export const TIER_LABEL: Record<CompanyTier, string> = {
  seed: "Seed",
  growth: "Growth",
  established: "Established",
  giant: "Giant",
};

export const TYPE_LABEL: Record<CompanyType, string> = {
  startup: "Startup",
  product: "Product",
  agency: "Agency",
  enterprise: "Enterprise",
  remote: "Remote-first",
};

/** How a job feels day to day, in the three groups players think in. The room's office clip follows the same grouping. */
export type Workplace = "startup" | "big" | "remote";

/** A product company still feels like a startup until it's established. */
export function workplaceOf(
  company: Pick<Company, "type" | "tier">,
): Workplace {
  switch (company.type) {
    case "startup":
    case "agency":
      return "startup";
    case "remote":
      return "remote";
    case "enterprise":
      return "big";
    case "product":
      return company.tier === "seed" || company.tier === "growth"
        ? "startup"
        : "big";
  }
}

export const WORKPLACE_LABEL: Record<Workplace, string> = {
  startup: "Startup",
  big: "Big company",
  remote: "Remote",
};

export const COMPANIES: Company[] = [
  {
    id: "loft",
    name: "Loft & Co",
    tier: "seed",
    type: "startup",
    salary: 900,
    learning: 1.4,
    energyCost: 14,
    minSkill: 0,
    stockPercent: 0,
    summary:
      "Four people and a whiteboard. You will touch everything, and the days run hot.",
  },
  {
    id: "relay",
    name: "Relay Studio",
    tier: "seed",
    type: "agency",
    salary: 1100,
    learning: 1.1,
    energyCost: 10,
    minSkill: 0,
    stockPercent: 0,
    summary: "Client work in short bursts. Breadth over ownership.",
  },
  {
    id: "spark",
    name: "Spark",
    tier: "growth",
    type: "startup",
    salary: 1400,
    learning: 1.5,
    energyCost: 16,
    minSkill: 18,
    stockPercent: 0.25,
    summary:
      "A startup that already has users. High fresher scope, high energy cost.",
  },
  {
    id: "northwind",
    name: "Northwind",
    tier: "growth",
    type: "product",
    salary: 1500,
    learning: 1.2,
    energyCost: 12,
    minSkill: 12,
    stockPercent: 0.15,
    summary:
      "One product, one queue. You learn the system instead of a new client every week.",
  },
  {
    id: "harbor",
    name: "Harbor",
    tier: "growth",
    type: "remote",
    salary: 1600,
    learning: 1,
    energyCost: 8,
    minSkill: 12,
    stockPercent: 0.12,
    summary:
      "Remote-first. Quieter days, slower feedback, fewer interruptions built into the salary.",
  },
  {
    id: "lumen",
    name: "Lumen",
    tier: "established",
    type: "product",
    salary: 1800,
    learning: 1,
    energyCost: 11,
    minSkill: 14,
    stockPercent: 0.15,
    summary: "A known product company. Process exists. So does a mentor.",
  },
  {
    id: "keel",
    name: "Keel Systems",
    tier: "established",
    type: "enterprise",
    salary: 1900,
    learning: 0.7,
    energyCost: 9,
    minSkill: 16,
    stockPercent: 0.1,
    summary:
      "Enterprise delivery. Reputation moves more than skill. The calendar is part of the job.",
  },
  {
    id: "atlas",
    name: "Atlas",
    tier: "giant",
    type: "enterprise",
    salary: 2200,
    learning: 0.6,
    energyCost: 8,
    minSkill: 20,
    stockPercent: 0.2,
    summary:
      "A giant. High fresher pay, narrow first tasks, a long path to owning anything.",
  },
  {
    id: "forge",
    name: "Forge Labs",
    tier: "seed",
    type: "startup",
    salary: 950,
    learning: 1.35,
    energyCost: 15,
    minSkill: 0,
    stockPercent: 0.22,
    summary:
      "Hardware sketches and firmware patches. Small team, loud standups, real ownership.",
  },
  {
    id: "canvas",
    name: "Canvas Works",
    tier: "seed",
    type: "agency",
    salary: 1050,
    learning: 1.15,
    energyCost: 11,
    minSkill: 0,
    stockPercent: 0,
    summary:
      "Design-led client sprints. You ship mockups and the occasional production fix.",
  },
  {
    id: "drift",
    name: "Driftware",
    tier: "growth",
    type: "product",
    salary: 1550,
    learning: 1.25,
    energyCost: 13,
    minSkill: 14,
    stockPercent: 0.14,
    summary:
      "A mobile product with steady releases. You learn one codebase deeply.",
  },
  {
    id: "quarry",
    name: "Quarry Data",
    tier: "growth",
    type: "enterprise",
    salary: 1700,
    learning: 0.95,
    energyCost: 10,
    minSkill: 15,
    stockPercent: 0.11,
    summary:
      "Data platforms for big clients. Slower pace, heavier compliance, solid pay.",
  },
  {
    id: "tide",
    name: "Tideframe",
    tier: "established",
    type: "remote",
    salary: 1750,
    learning: 1.05,
    energyCost: 7,
    minSkill: 13,
    stockPercent: 0.13,
    summary:
      "Async-first product shop. Fewer meetings, written specs, calm weeks.",
  },
  {
    id: "meridian",
    name: "Meridian Agency",
    tier: "established",
    type: "agency",
    salary: 1850,
    learning: 0.85,
    energyCost: 12,
    minSkill: 15,
    stockPercent: 0,
    summary:
      "Long client relationships and polished delivery. Less equity, more predictability.",
  },
  {
    id: "nook",
    name: "Nook Remote",
    tier: "growth",
    type: "remote",
    salary: 1650,
    learning: 1.1,
    energyCost: 8,
    minSkill: 11,
    stockPercent: 0.1,
    summary:
      "Fully distributed team across time zones. Flexible hours baked into the culture.",
  },
  {
    id: "summit",
    name: "Summit Digital",
    tier: "giant",
    type: "product",
    salary: 2100,
    learning: 0.65,
    energyCost: 9,
    minSkill: 19,
    stockPercent: 0.18,
    summary:
      "A household name in apps. Strong benefits, narrow scope at first, long runway.",
  },
];

export function offerNote(company: Company, profile: FresherProfile): string {
  return `${profile.blurb} ${company.name} is a ${TIER_LABEL[company.tier].toLowerCase()} ${TYPE_LABEL[company.type].toLowerCase()} company. Payday is ${company.salary} every five days. Learning is ${company.learning > 1.2 ? "fast" : company.learning < 0.9 ? "slow" : "steady"}, and a work block costs about ${company.energyCost} energy.`;
}

export function buildOffers(
  skill: number,
  seed: number,
): { offers: Company[]; rngState: number } {
  const qualified = COMPANIES.filter(
    (company) => company.minSkill <= skill,
  ).sort(
    (a, b) =>
      Math.abs(a.minSkill - skill) - Math.abs(b.minSkill - skill) ||
      b.salary - a.salary,
  );
  const stretch = COMPANIES.filter(
    (company) => company.minSkill > skill && company.minSkill <= skill + 8,
  );
  const picked: Company[] = [];
  const take = (company: Company | undefined) => {
    if (!company || picked.some((item) => item.id === company.id)) return;
    picked.push(company);
  };
  take(qualified[0]);
  take(qualified.find((company) => company.type !== picked[0]?.type));
  take(stretch[0]);
  const roll = nextUnit(seed);
  const rest = COMPANIES.filter(
    (company) => !picked.some((item) => item.id === company.id),
  );
  while (picked.length < 3 && rest.length > 0) {
    const index = Math.floor(roll.value * rest.length) % rest.length;
    const [next] = rest.splice(index, 1);
    take(next);
  }
  return { offers: picked.slice(0, 3), rngState: roll.rngState };
}
