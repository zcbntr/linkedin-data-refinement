import LinkedInSVG from "./assets/linkedin.svg";

import { useDraggable } from "@dnd-kit/core";
import { Job } from "./types";

type LIJobParams = {
  job: Job;
  id: string;
  draggable: boolean;
};

const LIJob = ({ job, id, draggable }: LIJobParams) => {
  // Draggable code
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // Get company initials. Arbitrarily choose to be one or two characters long
  const companyInitials =
    !(job.company.charCodeAt(0) % 2) && job.company.length > 1
      ? job.company
          .split(" ")
          .map((n) => n[0])
          .join("")
      : job.company
          .split(" ")
          .map((n) => n[0] + n[1])
          .join("");

  // Generate company colour using company name modulo 16 (to get a hex value), and some primes for variation
  const hexCharacters = "0123456789abcdef";
  const companyColour: string =
    hexCharacters[(job.company.charCodeAt(0) * 7907) % 16] +
    hexCharacters[(job.company.charCodeAt(1) * 7901) % 16] +
    hexCharacters[(job.company.charCodeAt(2) * 7919) % 16];

  return (
    <div
      ref={draggable ? setNodeRef : undefined}
      style={draggable ? style : undefined}
      {...listeners}
      {...attributes}
      className="w-96 py-2 px-2.5 flex flex-row gap-2 border-1 border-gray-600 min-w-96 select-none"
    >
      <div className="flex flex-col place-content-start pt-1.5">
        {/* Get image from https://dummyimage.com/ by Russell Heimlich */}
        <img
          src={`https://dummyimage.com/64x64/${companyColour}/fff.git&text=${companyInitials}`}
          width={screen.width > 512 ? 64 : 32}
        ></img>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row">
          <span className="text-blue-600 font-semibold">{job.name}</span>
        </div>
        <span className="text-sm">
          <span>{job.company} </span> · <span>{job.location}</span>
        </span>
        <div className="flex flex-row gap-2 text-sm">
          <span className="text-green-900">{job.postDateString}</span> ·
          <img src={LinkedInSVG} width={14}></img>
          <span className="text-gray-500">Easy Apply</span>
        </div>
      </div>
    </div>
  );
};

export default LIJob;
