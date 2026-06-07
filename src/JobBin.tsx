import { useDroppable } from "@dnd-kit/core";

type JobBinParams = {
  name: string;
  percent: number;
  id: string;
  disabled?: boolean;
};

const JobBin = ({ name, percent, id, disabled = false }: JobBinParams) => {
  // Draggable code
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = isOver
    ? disabled
      ? {
          borderColor: "#c7c7c7",
          backgroundColor: "#ebebeb",
          opacity: 0.55,
        }
      : {
          borderColor: "#0a66c2",
          backgroundColor: "#eef3f8",
        }
    : undefined;

  // Completion code
  const completionStyle =
    percent >= 100 ? "text-[rgba(0,0,0,0.4)] bg-[#f3f2ef]" : "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${completionStyle} ${disabled ? "cursor-not-allowed" : ""} select-none w-full p-3 flex text-base md:text-lg flex-row gap-3 bg-white rounded-lg border border-[#e0e0e0] shadow-sm min-w-52 place-content-center transition-colors`}
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
