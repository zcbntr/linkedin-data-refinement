import { useDroppable } from "@dnd-kit/core";

type JobBinParams = {
  name: string;
  percent: number;
  id: string;
};

const JobBin = ({ name, percent, id }: JobBinParams) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full p-2 flex flex-row gap-3 border-1 border-gray-600 min-w-48 place-content-between"
    >
      <div className="font-semibold">{name}</div>
      <div className="font-semibold">{percent}%</div>
    </div>
  );
};

export default JobBin;
