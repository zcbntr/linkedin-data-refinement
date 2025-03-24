type JobBinParams = {
  name: string;
  percent: number;
};

const JobBin = ({ name, percent }: JobBinParams) => {
  return (
    <div className="w-72 p-2 flex flex-row gap-3 border-1 border-gray-600 min-w-64">
      <div className={name}></div>
      <div>{percent}%</div>
    </div>
  );
};

export default JobBin;
