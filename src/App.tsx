import { ReactNode, useEffect, useMemo, useState } from "react";
import jobdata from "./assets/job-data.json";
import LIJob from "./LIJob";
import JobBin from "./JobBin";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  createGibberishJobs,
  getTimeAgoString,
  randomDate,
  randomLocation,
} from "./utils";
import { sub } from "date-fns";
import { Job } from "./types";

function App() {
  const MAX_JOBS_ON_SCREEN = Math.max(
    Math.min(
      Math.round(
        Math.floor((screen.width - 200) / 400) *
          Math.floor((screen.height - 400) / 100)
      ),
      jobdata.jobs.length
    ) - 4,
    12
  );

  const [jobListingArray, setJobListingArray] = useState<Job[]>(
    createGibberishJobs(MAX_JOBS_ON_SCREEN)
  );

  const [completionPercentage, setCompletionPercentage] = useState<number>(0);

  // Holds current special job node and its index to track where it is
  const [currentSpecialJobNodeIndex, setCurrentSpecialJobNodeIndex] =
    useState<number>(0);

  // Should be a hashmap for better performance
  const [usedJobs, setUsedJobs] = useState<number[]>([]);

  const [binCounts, setBinCounts] = useState<number[]>([0, 0, 0, 0, 0]);
  const binLookup = [...jobdata.jobBins];

  // Probably needs to be a state rather than a variable
  const jobListingNodes: ReactNode[] = useMemo(() => {
    return jobListingArray.map((x, i) => {
      return <LIJob job={x} draggable={false} key={i} id={i.toString()} />;
    });
  }, [jobListingArray]);

  useEffect(() => {
    // Reset previous special job
    if (currentSpecialJobNodeIndex >= 0) {
      jobListingNodes[currentSpecialJobNodeIndex] = (
        <LIJob
          job={jobListingArray[currentSpecialJobNodeIndex]}
          draggable={false}
          key={currentSpecialJobNodeIndex}
          id={currentSpecialJobNodeIndex.toString()}
        />
      );

      if (completionPercentage >= 100) {
        return;
      }
    }

    // Get random job data
    let chosenJobDataNumber: number = Math.round(
      Math.min(Math.random() * jobdata.jobs.length, jobdata.jobs.length - 1)
    );
    while (
      usedJobs.includes(chosenJobDataNumber) &&
      usedJobs.length < jobdata.jobs.length
    ) {
      chosenJobDataNumber = Math.round(
        Math.min(Math.random() * jobdata.jobs.length, jobdata.jobs.length - 1)
      );
    }
    setUsedJobs([...usedJobs, chosenJobDataNumber]);

    // For use if the job doesnt have a post date string attribute
    const postDate = randomDate(sub(new Date(), { months: 1 }), new Date());
    const postDateString = getTimeAgoString(postDate);

    const chosenJobData: Job = {
      name: jobdata.jobs[chosenJobDataNumber].name,
      company: jobdata.jobs[chosenJobDataNumber].company,
      location: jobdata.jobs[chosenJobDataNumber].location ?? randomLocation(),
      postDateString:
        jobdata.jobs[chosenJobDataNumber].postDateString ?? postDateString,
      category: "",
    };

    const chosenJobNodeNumber = Math.round(
      Math.min(Math.random() * MAX_JOBS_ON_SCREEN, MAX_JOBS_ON_SCREEN - 1)
    );

    setCurrentSpecialJobNodeIndex(chosenJobNodeNumber);
    jobListingNodes[chosenJobNodeNumber] = (
      <LIJob
        job={chosenJobData}
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...binCounts]);

  return (
    <main className="flex flex-col place-content-between bg-zinc-900 min-h-svh w-full max-w-screen ">
      <div className="flex flex-col place-content-between gap-6 h-full grow pb-10 w-full">
        <DndContext onDragEnd={handleDragEnd} autoScroll={false}>
          <div className="flex flex-row place-content-between gap-20 mx-auto select-none pt-2">
            <h1 className="text-5xl">LinkedIn Data Refinement</h1>
            <h2 className="text-5xl">{+completionPercentage.toFixed(10)}%</h2>
          </div>
          <div className="flex flex-row flex-wrap w-full h-full gap-5 place-content-center">
            {jobListingNodes}
          </div>

          <div className="md:mx-10 md:grid md:grid-cols-5 gap-5 flex flex-row flex-wrap h-20">
            {jobBinNodes}
          </div>
        </DndContext>
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
          is property of LinkedIn. Any resemblence to real companies, brands, or
          trademarks is unintentional.
        </div>
      </footer>
    </main>
  );

  function handleDragEnd(event: DragEndEvent) {
    if (completionPercentage >= 100) return;

    const { over } = event;
    if (over) {
      const binCountsCopy = binCounts;
      const index = binLookup.findIndex((x) => x === over.id);
      binCountsCopy[index] = binCountsCopy[index] + 1;

      setBinCounts(binCountsCopy);
      // Add to completion percentage - with scaling
      if (completionPercentage >= 99.999)
        setCompletionPercentage(completionPercentage + 0.000015);
      else if (completionPercentage >= 99.99)
        setCompletionPercentage(completionPercentage + 0.0001);
      else if (completionPercentage >= 99.9)
        setCompletionPercentage(completionPercentage + 0.005);
      else if (completionPercentage >= 99)
        setCompletionPercentage(completionPercentage + 0.1);
      else if (completionPercentage >= 90)
        setCompletionPercentage(completionPercentage + 1);
      else if (completionPercentage >= 50)
        setCompletionPercentage(completionPercentage + 2);
      else setCompletionPercentage(completionPercentage + 5);

      if (completionPercentage >= 100) {
        setJobListingArray([]);
        alert(
          "I completed LinkedIn Data Refinement and all I got was this stupid alert message"
        );
        console.log(
          "I completed LinkedIn Data Refinement but I also got this stupid console message"
        );
      }
    }
  }
}

export default App;
