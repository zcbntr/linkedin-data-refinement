import { ReactNode, useEffect, useMemo, useState } from "react";
import jobdata from "../src/assets/job-data.json";
import LIJob from "./LIJob";
import JobBin from "./JobBin";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { createRandomString, getTimeAgoString, randomDate } from "./utils";
import { sub } from "date-fns";
import { Job } from "./types";

function App() {
  const MAX_JOBS_ON_SCREEN = Math.max(
    Math.min(
      Math.round(
        Math.floor((screen.width - 100) / 400) *
          Math.floor((screen.height - 400) / 100)
      ),
      jobdata.jobData.length
    ),
    12
  );
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);

  // Should be a hashmap for better performance
  const [usedJobs, setUsedJobs] = useState<number[]>([]);

  const [binCounts, setBinCounts] = useState<number[]>([0, 0, 0, 0, 0]);
  const binLookup = [...jobdata.jobBins];

  // Probably needs to be a state rather than a variable
  const jobListingNodesVariable: ReactNode[] = [];
  for (let i = 0; i < MAX_JOBS_ON_SCREEN; i++) {
    const name = createRandomString(16);
    const company = createRandomString(16);
    const postDate = randomDate(sub(new Date(), { months: 1 }), new Date());
    const postDateString = getTimeAgoString(postDate);

    jobListingNodesVariable.push(
      <LIJob
        name={name}
        company={company}
        postDateString={postDateString}
        location={"UK (Remote)"}
        category={0}
        draggable={false}
        key={i}
        id={i.toString()}
      />
    );
  }
  const [jobListingNodes, setJobListingNodes] = useState<ReactNode[]>(
    jobListingNodesVariable
  );

  useEffect(() => {
    // Get random job data
    let chosenJobDataNumber: number = Math.round(
      Math.min(
        Math.random() * jobdata.jobData.length,
        jobdata.jobData.length - 1
      )
    );
    while (
      usedJobs.includes(chosenJobDataNumber) &&
      usedJobs.length < jobdata.jobData.length
    ) {
      chosenJobDataNumber = Math.round(
        Math.min(
          Math.random() * jobdata.jobData.length,
          jobdata.jobData.length - 1
        )
      );
    }
    setUsedJobs([...usedJobs, chosenJobDataNumber]);

    // For use if the job doesnt have a post date string attribute
    const postDate = randomDate(sub(new Date(), { months: 1 }), new Date());
    const postDateString = getTimeAgoString(postDate);

    const chosenJobData: Job = {
      name: jobdata.jobData[chosenJobDataNumber].name,
      company: jobdata.jobData[chosenJobDataNumber].company,
      location: "UK (Remote)",
      postDateString:
        jobdata.jobData[chosenJobDataNumber].postDateString ?? postDateString,
      category: "",
    };

    const chosenJobNodeNumber = Math.round(
      Math.min(Math.random() * MAX_JOBS_ON_SCREEN, MAX_JOBS_ON_SCREEN - 1)
    );

    jobListingNodes[chosenJobNodeNumber] = (
      <LIJob
        name={chosenJobData.name}
        company={chosenJobData.company}
        postDateString={chosenJobData.postDateString}
        location={chosenJobData.location}
        category={0}
        draggable={true}
        key={chosenJobData.name}
        id={chosenJobData.name + chosenJobData.category}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completionPercentage]);

  const jobBinNodes: ReactNode[] = useMemo(() => {
    return jobdata.jobBins.map((name, i) => {
      return (
        <JobBin name={name} percent={binCounts[i] * 10} key={name} id={name} />
      );
    });
  }, [binCounts]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="flex flex-col place-content-between bg-zinc-900 min-h-svh w-full">
        <div className="flex flex-col place-content-between gap-6 h-full grow pb-10 w-full">
          <div className="flex flex-row place-content-between gap-20 mx-auto select-none">
            <h1 className="text-5xl pt-2">LinkedIn Data Refinement</h1>
            <h2 className="text-5xl">{completionPercentage}%</h2>
          </div>
          <div className="flex flex-row flex-wrap w-full h-full gap-5 place-content-center">
            {jobListingNodes}
          </div>

          <div className="md:mx-10 md:grid md:grid-cols-5 gap-5 flex flex-row flex-wrap h-20">
            {jobBinNodes}
          </div>
        </div>
        <footer className="bg-zinc-950 p-2 flex flex-col gap-2">
          <div className="flex flex-row place-content-center gap-1 text-white">
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
          <div className="text-gray-500 mx-auto text-center">
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
      const index = binLookup.findIndex((x) => x === over.id);
      binCountsCopy[index] = binCountsCopy[index] + 1;

      setBinCounts(binCountsCopy);
      setCompletionPercentage(completionPercentage + 2);
    }
  }
}

export default App;
