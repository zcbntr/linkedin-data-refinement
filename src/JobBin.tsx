import { useDroppable } from "@dnd-kit/core";

type JobBinParams = {
  name: string;
  percent: number;
  id: string;
};

const JobBin = ({ name, percent, id }: JobBinParams) => {
  // Draggable code
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  // Completion code
  const completionStyle = percent >= 100 ? "text-gray-500" : "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${completionStyle} select-none w-full p-2 flex text-lg md:text-xl flex-row gap-3 border-1 border-gray-600 min-w-52 place-content-between`}
    >
      <div className="flex flex-col place-content-center font-semibold">
        {name}
      </div>
      <div className="flex flex-col place-content-center font-semibold">
        {percent}%
      </div>
    </div>
  );
};

export default JobBin;
