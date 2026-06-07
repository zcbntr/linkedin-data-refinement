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
      className="w-96 py-3 px-4 flex flex-row gap-3 bg-white rounded-lg border border-[#e0e0e0] shadow-sm min-w-96 select-none hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex flex-col place-content-start pt-0.5">
        {/* Get image from https://dummyimage.com/ by Russell Heimlich */}
        <img
          src={`https://dummyimage.com/64x64/${companyColour}/fff.git&text=${companyInitials}`}
          width={screen.width > 512 ? 48 : 32}
          className="rounded"
        ></img>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex flex-row">
          <span className="text-[#0a66c2] font-semibold hover:underline">
            {job.name}
          </span>
        </div>
        <span className="text-sm text-[rgba(0,0,0,0.9)]">
          <span>{job.company} </span> · <span>{job.location}</span>
        </span>
        <div className="flex flex-row gap-1.5 items-center text-sm">
          <span className="text-[#057642] font-medium">{job.postDateString}</span>
          <span className="text-[rgba(0,0,0,0.6)]">·</span>
          <img src={LinkedInSVG} width={14}></img>
          <span className="text-[rgba(0,0,0,0.6)]">Easy Apply</span>
        </div>
      </div>
    </div>
  );
};

export default LIJob;
