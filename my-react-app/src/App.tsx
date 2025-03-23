import { ReactNode, useState } from "react";
import jobdata from "../src/assets/job-data.json";
import LIJob from "./LIJob";

function App() {
  const [count, setCount] = useState(0);

  const jobs: ReactNode[] = jobdata.jobdata.map((job) => {
    return <LIJob name={job.name} company={job.company} />;
  });

  return (
    <main className="flex flex-col place-content-between gap-3 min-h-svh p-3">
      <div className="flex flex-row place-content-between mx-auto">
        <h1 className="text-5xl">LinkedIn Data Refinement</h1>
        <h2 className="text-5xl">{count}</h2>
      </div>
      <div className="flex flex-row flex-wrap w-full h-full gap-3 place-content-center">
        {jobs}
      </div>
      <div>
        <div className="grid grid-cols-5"></div>
      </div>
    </main>
  );
}

export default App;
