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
