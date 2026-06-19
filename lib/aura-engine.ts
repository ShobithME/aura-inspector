// lib/aura-engine.ts

export type Rank = {
  label: string;
  emoji: string;
  min: number;
  max: number;
};

export const RANKS: Rank[] = [
  { label: "PUBLIC NPC", emoji: "💀", min: 1, max: 1 },
  { label: "NPC", emoji: "💀", min: 2, max: 99 },
  { label: "Background Character", emoji: "🚶", min: 100, max: 199 },
  { label: "Mid", emoji: "😐", min: 200, max: 299 },
  { label: "Try Hard", emoji: "🤓", min: 300, max: 399 },
  { label: "Aura Apprentice", emoji: "📈", min: 400, max: 499 },
  { label: "Chill Guy", emoji: "😎", min: 500, max: 599 },
  { label: "Locked In", emoji: "🗿", min: 600, max: 699 },
  { label: "Main Character", emoji: "🔥", min: 700, max: 799 },
  { label: "Aura Farmer", emoji: "👑", min: 800, max: 899 },
  { label: "Certified Menace", emoji: "🚨", min: 900, max: 949 },
  { label: "Sigma Overload", emoji: "⚡", min: 950, max: 979 },
  { label: "Alpha Final Boss", emoji: "🐺", min: 980, max: 994 },
  { label: "Aura God", emoji: "☠️", min: 995, max: 999 },
  { label: "THE CHOSEN ONE", emoji: "🔥🔥", min: 1000, max: 1000 },
];

export function getRank(score: number): Rank {
  return RANKS.find((r) => score >= r.min && score <= r.max) ?? RANKS[3];
}

export const METRIC_NAMES = [
  "Confidence",
  "Drip",
  "Rizz Frequency",
  "Plot Armor",
  "Aura Density",
  "Cutscene Potential",
  "Menace Level",
  "Main Character Energy",
  "Nonchalant Energy",
  "Presence Frequency",
] as const;

export type Metric = { name: string; value: number };

// Gen Z slang tags, bucketed by score tier so the vibe actually escalates
// with the score instead of being picked from one flat pool.
const TAGS_TIER_DEAD = [ // 1-99 (Public NPC / NPC)
  "NPC Behavior",
  "No Bitches",
  "Ratio'd",
  "L Take",
  "Mid at Best",
  "Flopped",
  "Zero Rizz",
  "Background Noise",
  "Skill Issue",
  "Down Bad",
];

const TAGS_TIER_LOW = [ // 100-299 (Background Character / Mid)
  "Mid Energy",
  "Side Character",
  "Lowkey Cooked",
  "Nonchalant (Forced)",
  "Beta Behavior",
  "Cap Detected",
  "Needs Glow Up",
  "NPC Adjacent",
  "Tutorial Boss",
  "Basic Drip",
];

const TAGS_TIER_AVG = [ // 300-599 (Try Hard / Apprentice / Chill Guy)
  "Decent Rizz",
  "Mid but Trying",
  "Lowkey Slay",
  "Chill Guy Energy",
  "Aura Apprentice",
  "Mixed Signals",
  "Vibing",
  "Soft Launch Aura",
  "Respectfully Average",
  "Built Different (Kinda)",
];

const TAGS_TIER_HIGH = [ // 600-899 (Locked In / Main Character / Aura Farmer)
  "Locked In",
  "Main Character Energy",
  "Certified Rizzler",
  "Built Different",
  "No Cap Aura",
  "Aura Farmer",
  "CEO Energy",
  "Cutscene Energy",
  "Final Boss",
  "Plot Armor",
  "Corporate Villain",
];

const TAGS_TIER_LEGEND = [ // 900-1000 (Certified Menace -> THE CHOSEN ONE)
  "Certified Menace",
  "Sigma Overload",
  "Unspoken Rizz",
  "Goated",
  "Alpha Final Boss",
  "Aura God",
  "Diff",
  "Untouchable",
  "Cheat Codes Active",
  "Ascended",
];

function tagPoolForScore(score: number): string[] {
  if (score < 100) return TAGS_TIER_DEAD;
  if (score < 300) return TAGS_TIER_LOW;
  if (score < 600) return TAGS_TIER_AVG;
  if (score < 900) return TAGS_TIER_HIGH;
  return TAGS_TIER_LEGEND;
}

const VERDICTS_HIGH = [
  "Bro definitely walks away from explosions.",
  "Your aura entered the room before you did.",
  "Cutscene energy detected.",
  "Main character confirmed.",
  "Professional aura farmer.",
  "The scanner was impressed.",
  "Plot armor confirmed.",
  "Certified menace.",
  "The bureau requests your autograph.",
  "Walking soundtrack detected.",
  "Camera angles adjust automatically for you.",
  "NPC dialogue triggers when you enter.",
];

const VERDICTS_MID = [
  "Aura: present but unverified.",
  "The bureau is cautiously optimistic.",
  "Potential detected. More data needed.",
  "Mid, but inspirationally so.",
  "Your aura is loading. Please wait.",
];

const VERDICTS_LOW = [
  "The scanner requested early retirement.",
  "Even the loading screen had more aura.",
  "You are the side quest.",
  "Congratulations. You lost aura.",
  "The bureau filed a complaint.",
  "Background character energy confirmed.",
  "You triggered the tutorial sequence.",
  "Aura.exe has stopped responding.",
];

const VERDICT_ONE = "Awarded 1 aura point for participating.";
const VERDICT_THOUSAND = "The bureau has never witnessed an aura this powerful.";

export function getVerdict(score: number): string {
  if (score === 1) return VERDICT_ONE;
  if (score === 1000) return VERDICT_THOUSAND;
  if (score < 300) return pick(VERDICTS_LOW);
  if (score >= 700) return pick(VERDICTS_HIGH);
  return pick(VERDICTS_MID);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Weighted random score 1-1000.
 * 25% → 1-299 (Low)
 * 50% → 300-799 (Average)
 * 20% → 800-979 (High)
 *  5% → 980-1000 (Legendary)
 * Score 1 and 1000 are extremely rare special cases.
 */
export function generateScore(): number {
  const special = Math.random();
  if (special < 0.0005) return 1;
  if (special < 0.001) return 1000;

  const r = Math.random();
  if (r < 0.25) return randInt(2, 299);
  if (r < 0.75) return randInt(300, 799);
  if (r < 0.95) return randInt(800, 979);
  return randInt(980, 999);
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMetrics(score: number): Metric[] {
  const base = Math.min(98, Math.max(8, Math.round(score / 10)));
  return METRIC_NAMES.map((name) => {
    const jitter = randInt(-22, 22);
    const value = Math.min(99, Math.max(3, base + jitter));
    return { name, value };
  });
}

export function generateTags(score: number): string[] {
  const count = randInt(3, 5);
  const pool = tagPoolForScore(score);
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

export type RareEvent = "none" | "aura-god" | "chosen-one";

export function rollRareEvent(score: number): RareEvent {
  if (score === 1000) return "chosen-one";
  if (score >= 995) return "aura-god";
  const roll = Math.random();
  if (roll < 0.001) return "chosen-one";
  if (roll < 0.01) return "aura-god";
  return "none";
}

export type InspectionReport = {
  score: number;
  rank: Rank;
  metrics: Metric[];
  tags: string[];
  verdict: string;
  rareEvent: RareEvent;
  timestamp: number;
  caseId: string;
};

export function generateReport(): InspectionReport {
  const score = generateScore();
  const rank = getRank(score);
  const metrics = generateMetrics(score);
  const tags = generateTags(score);
  const verdict = getVerdict(score);
  const rareEvent = rollRareEvent(score);
  const caseId = `AIB-${Math.floor(100000 + Math.random() * 899999)}`;

  return { score, rank, metrics, tags, verdict, rareEvent, timestamp: Date.now(), caseId };
}

export function encodeReport(report: InspectionReport): string {
  const payload = {
    s: report.score,
    r: report.rank.label,
    re: report.rank.emoji,
    m: report.metrics.map((x) => x.value),
    t: report.tags,
    v: report.verdict,
    ev: report.rareEvent,
    ts: report.timestamp,
    id: report.caseId,
  };
  return btoa(encodeURIComponent(JSON.stringify(payload)));
}

export function decodeReport(encoded: string): InspectionReport | null {
  try {
    const payload = JSON.parse(decodeURIComponent(atob(encoded)));
    const score = payload.s as number;
    const rank = getRank(score);
    const metrics = METRIC_NAMES.map((name, i) => ({ name, value: payload.m[i] ?? 50 }));
    return {
      score,
      rank,
      metrics,
      tags: payload.t,
      verdict: payload.v,
      rareEvent: payload.ev,
      timestamp: payload.ts,
      caseId: payload.id,
    };
  } catch {
    return null;
  }
}

export const SCAN_MESSAGES = [
  "Initializing Aura Scanner…",
  "Connecting To Aura Database…",
  "Checking Vibe Density…",
  "Analyzing Drip Levels…",
  "Measuring Confidence…",
  "Inspecting Plot Armor…",
  "Detecting Rizz Frequency…",
  "Calculating Main Character Energy…",
  "Scanning Aura Signature…",
  "Generating Inspection Report…",
];
