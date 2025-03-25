import LinkedInSVG from "./assets/linkedin.svg";

import { useDraggable } from "@dnd-kit/core";

type LIJobParams = {
  name: string;
  company: string;
  location?: string;
  postDateString: string;
  category: number;
  id: string;
  draggable: boolean;
};

const LIJob = ({
  name,
  company,
  location = "United Kingdom (Remote)",
  postDateString,
  id,
  draggable,
}: LIJobParams) => {
  // Draggable code
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={draggable ? setNodeRef : undefined}
      style={draggable ? style : undefined}
      {...listeners}
      {...attributes}
      className="w-96 py-2 px-2.5 flex flex-row gap-2 border-1 border-gray-600 min-w-96"
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
