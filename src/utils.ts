import { ApplyLabel, Job } from "./types";
import jobdata from "./assets/job-data.json";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_YEAR = 365.25 * MS_PER_DAY;
const BIG_BANG_YEARS_AGO = 13.787e9;
const MIN_POST_AGE_MS = 1e-6; // 1 nanosecond
const MAX_POST_AGE_MS = BIG_BANG_YEARS_AGO * MS_PER_YEAR;
const ONE_MONTH_MS = 30.4375 * MS_PER_DAY;
const ANCIENT_TAIL_CHANCE = 0.12;

function randomTriangular(min: number, max: number, mode: number): number {
  const u = Math.random();
  const span = max - min;
  const modeFraction = (mode - min) / span;

  if (u < modeFraction) {
    return min + Math.sqrt(u * span * (mode - min));
  }
  return max - Math.sqrt((1 - u) * span * (max - mode));
}

function randomLogUniform(min: number, max: number): number {
  return Math.exp(Math.log(min) + Math.random() * (Math.log(max) - Math.log(min)));
}

const PLURAL_UNITS: Record<string, string> = {
  century: "centuries",
  millennium: "millennia",
};

function formatCount(value: number): string {
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function formatAgo(value: number, unit: string, allowDecimals = false): string {
  const rounded = allowDecimals
    ? value >= 10
      ? Math.round(value)
      : Math.round(value * 10) / 10
    : Math.max(1, Math.floor(value));
  const count = allowDecimals ? formatCount(rounded) : String(rounded);
  const label =
    rounded === 1 ? unit : (PLURAL_UNITS[unit] ?? `${unit}s`);
  return `${count} ${label} ago`;
}

export function getTimeAgoString(date: Date): string {
  const ms = Date.now() - date.getTime();
  if (ms <= 0) return "Just now";

  if (ms < 1) {
    const nanoseconds = ms * 1e6;
    if (nanoseconds < 1000) return formatAgo(nanoseconds, "nanosecond");
    return formatAgo(nanoseconds / 1000, "microsecond");
  }
  if (ms < 1000) return formatAgo(ms, "millisecond");

  const seconds = ms / 1000;
  if (seconds < 60) return formatAgo(seconds, "second");

  const minutes = seconds / 60;
  if (minutes < 60) return formatAgo(minutes, "minute");

  const hours = minutes / 60;
  if (hours < 24) return formatAgo(hours, "hour");

  const days = hours / 24;
  if (days < 7) return formatAgo(days, "day");

  const weeks = days / 7;
  if (weeks < 4.345) return formatAgo(weeks, "week");

  const months = days / 30.4375;
  if (months < 12) return formatAgo(months, "month");

  const years = days / 365.25;
  if (years < 10) return formatAgo(years, "year");
  if (years < 100) return formatAgo(years / 10, "decade");
  if (years < 1000) return formatAgo(years / 100, "century");
  if (years < 1e6) return formatAgo(years / 1000, "millennium", true);
  if (years < 1e9) return `${formatCount(years / 1e6)} million years ago`;

  return `${formatCount(years / 1e9)} billion years ago`;
}

// Most listings land in the last month (peaking ~2 weeks ago); rare tail spans to the Big Bang.
export function randomPostDate(): Date {
  const ageMs =
    Math.random() < ANCIENT_TAIL_CHANCE
      ? randomLogUniform(ONE_MONTH_MS, MAX_POST_AGE_MS)
      : randomTriangular(MIN_POST_AGE_MS, ONE_MONTH_MS, 14 * MS_PER_DAY);

  return new Date(Date.now() - ageMs);
}

export function createRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  randomArray.forEach((number) => {
    result += chars[number % chars.length];
  });
  return result;
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function randomApplyLabel(): ApplyLabel {
  const roll = Math.random();
  if (roll < 0.45) return null;
  if (roll < 0.5) return "difficult";
  return "easy";
}

type LinkedInLogoStyle = {
  transform: string;
  filter?: string;
};

function hashString(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

const LINKEDIN_LOGO_STYLES: LinkedInLogoStyle[] = [
  { transform: "scaleX(-1)" },
  { transform: "scaleY(-1)" },
  { transform: "rotate(90deg)" },
  { transform: "rotate(180deg)" },
  { transform: "rotate(270deg)" },
  { transform: "scaleX(-1) rotate(90deg)" },
  { transform: "rotate(45deg)" },
  { transform: "rotate(-45deg)" },
  { transform: "skewX(-20deg) rotate(12deg)" },
  { transform: "skewY(16deg) scaleX(-1)" },
  { transform: "rotate(127deg) scale(0.9)" },
  { transform: "rotate(-73deg) scale(1.12)" },
  { transform: "scaleX(-1) skewX(14deg)" },
  { transform: "scaleY(-1) rotate(33deg)" },
  { transform: "perspective(48px) rotateY(180deg)" },
  { transform: "perspective(48px) rotateX(180deg)" },
  { transform: "perspective(48px) rotateY(90deg) scale(1.1)" },
  { transform: "rotate(15deg) scaleX(1.25)" },
  { transform: "rotate(-28deg) scaleY(0.82)" },
  { transform: "skewX(22deg) skewY(-8deg)" },
  { transform: "rotate(180deg) scale(0.75)" },
  { transform: "scaleX(-1) rotate(180deg) skewY(10deg)" },
  { filter: "hue-rotate(95deg)", transform: "rotate(18deg)" },
  { filter: "hue-rotate(210deg) saturate(1.6)", transform: "scaleX(-1)" },
  { filter: "sepia(0.8) hue-rotate(160deg)", transform: "rotate(-12deg)" },
  { filter: "invert(1) hue-rotate(180deg)", transform: "rotate(90deg)" },
  { filter: "saturate(2.5) hue-rotate(270deg)", transform: "skewX(-12deg)" },
  {
    filter: "brightness(1.3) contrast(1.2)",
    transform: "rotate(66deg) scaleX(-1)",
  },
];

function proceduralLinkedInLogoStyle(h: number): LinkedInLogoStyle {
  const rotate = (h % 200) - 100;
  const skewX = ((h >> 8) % 37) - 18;
  const skewY = ((h >> 12) % 25) - 12;
  const scale = 0.82 + ((h >> 16) % 36) / 100;

  const parts = [`rotate(${rotate}deg)`, `skewX(${skewX}deg)`, `skewY(${skewY}deg)`];
  if (h & 1) parts.push("scaleX(-1)");
  if (h & 2) parts.push("scaleY(-1)");
  parts.push(`scale(${scale.toFixed(2)})`);

  const style: LinkedInLogoStyle = { transform: parts.join(" ") };

  const filterRoll = (h >> 20) % 6;
  if (filterRoll === 1) style.filter = `hue-rotate(${h % 360}deg)`;
  if (filterRoll === 2) style.filter = "invert(1) hue-rotate(140deg)";
  if (filterRoll === 3) style.filter = "sepia(1) saturate(2)";
  if (filterRoll === 4) style.filter = "saturate(3) brightness(1.1)";
  if (filterRoll === 5) {
    style.transform = `${parts.join(" ")} perspective(40px) rotateY(${(h >> 4) % 2 ? 180 : 90}deg)`;
  }

  return style;
}

export function randomLinkedInLogoStyle(seed: string): LinkedInLogoStyle {
  const h = hashString(seed);
  if (h % 5 === 0) return proceduralLinkedInLogoStyle(h);
  return LINKEDIN_LOGO_STYLES[h % LINKEDIN_LOGO_STYLES.length];
}

export function randomLocation(): string {
  let location = "UK (Remote)";
  if (jobdata.locations.length > 0) {
    location =
      jobdata.locations[Math.floor(Math.random() * jobdata.locations.length)];
    if (Math.random() < 0.5 && location.length < 12) {
      location = location + " (Remote)";
    }
  }

  return location;
}

const JOB_CARD_WIDTH = 384; // matches LIJob w-96
const JOB_CARD_HEIGHT = 100;
const JOB_GRID_GAP = 20; // matches gap-5
const JOB_GRID_RESERVED_HEIGHT = 360; // header, bins, footer, padding
const JOB_GRID_RESERVED_WIDTH = 48;
export const MIN_JOBS_ON_SCREEN = 12;
export const MAX_JOBS_ON_SCREEN_CAP = 20;

// Progress asymptotically approaches this value but never reaches 100%
export const COMPLETION_MAX = 99.999999999;

export function addCompletionProgress(
  currentPercent: number,
  jobsCompleted: number,
): number {
  const remaining = COMPLETION_MAX - currentPercent;
  if (remaining <= 0) return COMPLETION_MAX;

  // Each job closes a shrinking fraction of the gap; rate decays as more jobs are done
  const decay = Math.pow(0.88, jobsCompleted / 4);
  const rate = 0.12 * decay;

  return Math.min(currentPercent + remaining * rate, COMPLETION_MAX);
}

export function getMaxJobsOnScreen(): number {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const cols = Math.max(
    1,
    Math.floor(
      (width - JOB_GRID_RESERVED_WIDTH + JOB_GRID_GAP) /
        (JOB_CARD_WIDTH + JOB_GRID_GAP),
    ),
  );
  const rows = Math.max(
    1,
    Math.floor(
      (height - JOB_GRID_RESERVED_HEIGHT + JOB_GRID_GAP) /
        (JOB_CARD_HEIGHT + JOB_GRID_GAP),
    ),
  );

  // Leave one row as buffer so rounding and UI chrome do not force a scrollbar
  const safeRows = Math.max(1, rows - 1);
  const fitCount = cols * safeRows;

  return Math.max(
    MIN_JOBS_ON_SCREEN,
    Math.min(fitCount, MAX_JOBS_ON_SCREEN_CAP, jobdata.jobs.length),
  );
}

const PROGRESS_STORAGE_KEY = "linkedin-data-refinement-progress";

export type SavedProgress = {
  completionPercentage: number;
  binCounts: number[];
  usedJobs: number[];
};

function isSavedProgress(value: unknown): value is SavedProgress {
  if (!value || typeof value !== "object") return false;
  const candidate = value as SavedProgress;
  return (
    typeof candidate.completionPercentage === "number" &&
    Array.isArray(candidate.binCounts) &&
    candidate.binCounts.length === jobdata.jobBins.length &&
    candidate.binCounts.every((count) => typeof count === "number") &&
    Array.isArray(candidate.usedJobs) &&
    candidate.usedJobs.every((index) => typeof index === "number")
  );
}

export function loadProgress(): SavedProgress | null {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isSavedProgress(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveProgress(progress: SavedProgress): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore quota errors or storage blocked in private browsing.
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
  } catch {
    // Ignore storage blocked in private browsing.
  }
}

export function createGibberishJobs(count: number): Job[] {
  const jobs: Job[] = [];
  for (let i = 0; i < count; i++) {
    const name = createRandomString(16);
    const company = createRandomString(12);
    const postDateString = getTimeAgoString(randomPostDate());

    jobs.push({
      name: name,
      company: company,
      postDateString: postDateString,
      location: randomLocation(),
      category: "",
      applyLabel: randomApplyLabel(),
    });
  }

  return jobs;
}
