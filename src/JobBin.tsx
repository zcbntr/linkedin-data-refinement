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
    borderColor: isOver ? "#0a66c2" : undefined,
    backgroundColor: isOver ? "#eef3f8" : undefined,
  };

  // Completion code
  const completionStyle =
    percent >= 100 ? "text-[rgba(0,0,0,0.4)] bg-[#f3f2ef]" : "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${completionStyle} select-none w-full p-3 flex text-base md:text-lg flex-row gap-3 bg-white rounded-lg border border-[#e0e0e0] shadow-sm min-w-52 place-content-between transition-colors`}
    >
      <div className="flex flex-col place-content-center font-semibold text-[rgba(0,0,0,0.9)]">
        {name}
      </div>
      <div className="flex flex-col place-content-center font-semibold text-[#0a66c2]">
        {percent}%
      </div>
    </div>
  );
};

export default JobBin;
