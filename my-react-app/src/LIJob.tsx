import LinkedInSVG from "./assets/linkedin.svg";

type LIJobParams = {
  name: string;
  company: string;
};

const LIJob = ({ name, company }: LIJobParams) => {
  const location = "United Kingdom (Remote)";

  const postTimeString = "23 hours ago";

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
          <span className="text-green-900">{postTimeString}</span> ·
          <img src={LinkedInSVG} width={14}></img>
          <span className="text-gray-500">Easy Apply</span>
        </div>
      </div>
    </div>
  );
};

export default LIJob;
