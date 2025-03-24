import {
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import LinkedInSVG from "./assets/linkedin.svg";

type LIJobParams = {
  name: string;
  company: string;
  location?: string;
  postDateString?: string;
};

const LIJob = ({
  name,
  company,
  location,
  postDateString = "",
}: LIJobParams) => {
  if (!location) location = "United Kingdom (Remote)";

  const postDateDate = new Date(postDateString);

  if (isNaN(postDateDate.getTime())) {
    const now = Date.now();
    const millisecondsSince = differenceInMilliseconds(now, postDateDate);
    if (millisecondsSince > 365 * 24 * 60 * 1000)
      postDateString = `${differenceInYears(now, postDateDate)} Years Ago`;
    else if (millisecondsSince > 30 * 24 * 60 * 1000)
      postDateString = `${differenceInMonths(now, postDateDate)} Months Ago`;
    else if (millisecondsSince > 24 * 60 * 1000)
      postDateString = `${differenceInDays(now, postDateDate)} Days Ago`;
    else if (millisecondsSince > 60 * 1000)
      postDateString = `${differenceInHours(now, postDateDate)} Hours Ago`;
    else if (millisecondsSince > 1000)
      postDateString = `${differenceInMinutes(now, postDateDate)} Minutes Ago`;
    else postDateString = `Now`;
  }

  return (
    <div
      className="w-96 py-2 px-2.5 flex flex-row gap-3 border-1 border-gray-600 min-w-96"
      draggable
    >
      <div className="flex flex-col place-content-start pt-1.5">
        <img src={LinkedInSVG} width={64}></img>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row">
          <span className="text-blue-600 font-semibold">{name}</span>
        </div>
        <span className="text-sm">
          <span>{company} </span> · <span>{location}</span>
        </span>
        <div className="flex flex-row gap-2 text-sm">
          <span className="text-green-900">{postDateString}</span> ·
          <img src={LinkedInSVG} width={14}></img>
          <span className="text-gray-500">Easy Apply</span>
        </div>
      </div>
    </div>
  );
};

export default LIJob;
