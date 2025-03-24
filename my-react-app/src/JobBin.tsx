type JobBinParams = {
  name: string;
  percent: number;
};

const JobBin = ({ name, percent }: JobBinParams) => {
  return (
    <div className="w-full p-2 flex flex-row gap-3 border-1 border-gray-600 min-w-48 place-content-between">
      <div className="font-semibold">{name}</div>
      <div className="font-semibold">{percent}%</div>
    </div>
  );
};

export default JobBin;
