import { ReactNode, useState } from "react";
import jobdata from "../src/assets/job-data.json";
import LIJob from "./LIJob";
import JobBin from "./JobBin";

import { DndContext, DragEndEvent } from "@dnd-kit/core";

type BinCount = {
  name: string;
  count: number;
};

function App() {
  const [binCounts, setBinCounts] = useState<BinCount[]>(
    jobdata.jobBins.map((name) => {
      return {
        name: name,
        count: 0,
      };
    })
  );

  const MAX_JOBS_ON_SCREEN = 20;
  const TARGET_COUNT = 100;
  const completion_percentage = Math.round(0 / TARGET_COUNT);

  const jobs: ReactNode[] = [];
  for (let i = 0; i < MAX_JOBS_ON_SCREEN; i++) {
    jobs.push(<LIJob name={"test"} company="test" key={i} id={i.toString()} />);
  }

  const jobBins: ReactNode[] = jobdata.jobBins.map((name) => {
    return (
      <JobBin
        name={name}
        percent={binCounts.find((x) => x.name === name)?.count ?? 0}
        key={name}
        id={name}
      />
    );
  });

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="flex flex-col place-content-between gap-20 bg-zinc-900">
        <div className="flex flex-col place-content-between gap-3 min-h-svh p-3">
          <div className="flex flex-row place-content-between gap-20 mx-auto">
            <h1 className="text-5xl">LinkedIn Data Refinement</h1>
            <h2 className="text-5xl">{completion_percentage}%</h2>
          </div>
          <div className="flex flex-row flex-wrap w-full h-full gap-5 place-content-center">
            {jobs}
          </div>
          <div>
            <div className="md:mx-10 grid grid-cols-5 gap-5 flex-wrap">
              {jobBins}
            </div>
          </div>
        </div>
        <footer className="bg-zinc-950 p-5 flex flex-col gap-2">
          <div className="flex flex-row place-content-center gap-3 text-white">
            <a className="hover:underline" href={"https://zcbn.dev/"}>
              © 2025 Zac Benattar
            </a>
            {"·"}
            <a
              className="hover:underline"
              href={"https://github.com/zcbntr/linkedin-data-refinement"}
            >
              GitHub
            </a>
          </div>
          <div className="text-gray-500 mx-auto p-3 text-center">
            This work is parody. Not affiliated with LinkedIn. The LinkedIn logo
            is property of LinkedIn. Any resemblence to real companies, brands,
            or trademarks is unintentional.
          </div>
        </footer>
      </main>
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;
    if (over) {
      const binCountsCopy = binCounts;
      const index = binCounts.findIndex((x) => x.name === over.id);
      binCountsCopy[index]!.count = binCountsCopy[index]!.count + 1;

      setBinCounts(binCountsCopy);
    }
  }
}

export default App;
