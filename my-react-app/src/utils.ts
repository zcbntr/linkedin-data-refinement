import {
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

export function getTimeAgoString(date: Date): string {
  const now = Date.now();
  const millisecondsSince = differenceInMilliseconds(now, date);
  console.log(millisecondsSince);
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
