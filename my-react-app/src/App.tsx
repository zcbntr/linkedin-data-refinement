import { ReactNode, useState } from "react";
import jobdata from "../src/assets/job-data.json";
import LIJob from "./LIJob";
import JobBin from "./JobBin";

function App() {
  const [count, setCount] = useState(0);
  const TOTAL_JOBS = 24;
  const TARGET_COUNT = 100;
  const completion_percentage = Math.round(count / TARGET_COUNT);

  const jobs: ReactNode[] = [];
  for (let i = 0; i < TOTAL_JOBS; i++) {
    jobs.push(<LIJob name={"test"} company="test" />);
  }

  const jobBins: ReactNode[] = jobdata.jobBins.map((name) => {
    return <JobBin name={name} percent={0} />;
  });

  return (
    <main className="flex flex-col place-content-between gap-3 min-h-svh p-3">
      <div className="flex flex-row place-content-between gap-20 mx-auto">
        <h1 className="text-5xl">LinkedIn Data Refinement</h1>
        <h2 className="text-5xl">{completion_percentage}%</h2>
      </div>
      <div className="flex flex-row flex-wrap w-full h-full gap-5 place-content-center">
        {jobs}
      </div>
      <div>
        <div className="md:mx-10 grid grid-cols-5">{jobBins}</div>
      </div>
    </main>
  );
}

export default App;
