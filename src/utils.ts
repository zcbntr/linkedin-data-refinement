import {
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
  sub,
} from "date-fns";
import { Job } from "./types";
import jobdata from "./assets/job-data.json";

export function getTimeAgoString(date: Date): string {
  const now = Date.now();
  const millisecondsSince = differenceInMilliseconds(now, date);

  if (millisecondsSince > 365 * 24 * 60 * 60 * 1000)
    return `${differenceInYears(now, date)} Years Ago`;
  else if (millisecondsSince > 30 * 24 * 60 * 60 * 1000)
    return `${differenceInMonths(now, date)} Months Ago`;
  else if (millisecondsSince > 24 * 60 * 60 * 1000)
    return `${differenceInDays(now, date)} Days Ago`;
  else if (millisecondsSince > 60 * 60 * 1000)
    return `${differenceInHours(now, date)} Hours Ago`;
  else if (millisecondsSince > 68 * 1000)
    return `${differenceInMinutes(now, date)} Minutes Ago`;
  else return `Now`;
}

export function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
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
  jobsCompleted: number
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
        (JOB_CARD_WIDTH + JOB_GRID_GAP)
    )
  );
  const rows = Math.max(
    1,
    Math.floor(
      (height - JOB_GRID_RESERVED_HEIGHT + JOB_GRID_GAP) /
        (JOB_CARD_HEIGHT + JOB_GRID_GAP)
    )
  );

  // Leave one row as buffer so rounding and UI chrome do not force a scrollbar
  const safeRows = Math.max(1, rows - 1);
  const fitCount = cols * safeRows;

  return Math.max(
    MIN_JOBS_ON_SCREEN,
    Math.min(fitCount, MAX_JOBS_ON_SCREEN_CAP, jobdata.jobs.length)
  );
}

export function createGibberishJobs(count: number): Job[] {
  const jobs: Job[] = [];
  for (let i = 0; i < count; i++) {
    const name = createRandomString(16);
    const company = createRandomString(12);
    const postDate = randomDate(sub(new Date(), { months: 1 }), new Date());
    const postDateString = getTimeAgoString(postDate);

    jobs.push({
      name: name,
      company: company,
      postDateString: postDateString,
      location: randomLocation(),
      category: "",
    });
  }

  return jobs;
}
