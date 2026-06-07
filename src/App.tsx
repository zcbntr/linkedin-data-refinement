import { ReactNode, useEffect, useMemo, useState } from "react";
import jobdata from "./assets/job-data.json";
import LIJob from "./LIJob";
import JobBin from "./JobBin";
import ProgressWidget from "./ProgressWidget";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  addCompletionProgress,
  COMPLETION_MAX,
  createGibberishJobs,
  getMaxJobsOnScreen,
  getTimeAgoString,
  randomApplyLabel,
  randomLocation,
  randomPostDate,
} from "./utils";
import { Job } from "./types";

function App() {
  const MAX_JOBS_ON_SCREEN = getMaxJobsOnScreen();

  const [jobListingArray] = useState<Job[]>(
    createGibberishJobs(MAX_JOBS_ON_SCREEN),
  );

  const [completionPercentage, setCompletionPercentage] = useState<number>(0);

  const [specialJobIndex, setSpecialJobIndex] = useState<number>(0);
  const [specialJob, setSpecialJob] = useState<Job | null>(null);
  const [specialJobInstanceId, setSpecialJobInstanceId] = useState(0);

  const [, setUsedJobs] = useState<number[]>([]);

  const [binCounts, setBinCounts] = useState<number[]>([0, 0, 0, 0, 0]);
  const binLookup = [...jobdata.jobBins];
  const sortedCount = binCounts.reduce((sum, count) => sum + count, 0);

  useEffect(() => {
    let chosenJobDataNumber = Math.floor(
      Math.random() * jobdata.jobs.length,
    );
    setUsedJobs((prev) => {
      while (
        prev.includes(chosenJobDataNumber) &&
        prev.length < jobdata.jobs.length
      ) {
        chosenJobDataNumber = Math.floor(
          Math.random() * jobdata.jobs.length,
        );
      }
      return [...prev, chosenJobDataNumber];
    });

    const postDateString = getTimeAgoString(randomPostDate());

    const chosenJobData: Job = {
      name: jobdata.jobs[chosenJobDataNumber].name,
      company: jobdata.jobs[chosenJobDataNumber].company,
      location: jobdata.jobs[chosenJobDataNumber].location ?? randomLocation(),
      postDateString:
        jobdata.jobs[chosenJobDataNumber].postDateString ?? postDateString,
      category: "",
      applyLabel: randomApplyLabel(),
    };

    const chosenJobNodeNumber = Math.floor(
      Math.random() * MAX_JOBS_ON_SCREEN,
    );

    setSpecialJobInstanceId((id) => id + 1);
    setSpecialJobIndex(chosenJobNodeNumber);
    setSpecialJob(chosenJobData);
  }, [completionPercentage, MAX_JOBS_ON_SCREEN]);

  const jobListingNodes: ReactNode[] = useMemo(() => {
    return jobListingArray.map((job, i) => {
      const isSpecial = i === specialJobIndex && specialJob !== null;
      return (
        <LIJob
          job={isSpecial ? specialJob : job}
          draggable={isSpecial}
          key={isSpecial ? `special-${specialJobInstanceId}` : i}
          id={isSpecial ? `special-${specialJobInstanceId}` : i.toString()}
        />
      );
    });
  }, [jobListingArray, specialJobIndex, specialJob, specialJobInstanceId]);

  const jobBinNodes: ReactNode[] = useMemo(() => {
    return jobdata.jobBins.map((name, i) => {
      return (
        <JobBin
          name={name}
          percent={binCounts[i] * 10}
          key={name}
          id={name}
          disabled={name === "Apply"}
        />
      );
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...binCounts]);

  return (
    <main className="flex flex-col place-content-between bg-[#f3f2ef] min-h-svh w-full max-w-screen">
      <div className="flex flex-col place-content-between gap-6 h-full grow pb-10 w-full">
        <DndContext onDragEnd={handleDragEnd} autoScroll={false}>
          <div className="flex flex-col place-content-between mx-auto select-none pt-6 text-center gap-4">
            <h1 className="text-3xl font-semibold text-[rgba(0,0,0,0.9)]">
              LinkedIn Data Refinement
            </h1>
            <ProgressWidget
              completionPercentage={completionPercentage}
              sortedCount={sortedCount}
            />
          </div>
          <div className="flex flex-row flex-wrap w-full h-full gap-3 place-content-center px-4">
            {jobListingNodes}
          </div>

          <div className="md:mx-10 md:grid md:grid-cols-5 gap-3 flex flex-row flex-wrap h-20 px-4">
            {jobBinNodes}
          </div>
        </DndContext>
      </div>
      <footer className="bg-white border-t border-[#e0e0e0] p-4 flex flex-col gap-2">
        <div className="flex flex-row place-content-center gap-1 text-[#0a66c2]">
          <a
            className="hover:underline font-semibold"
            href={"https://zcbn.dev/"}
          >
            © 2026 Zac Benattar
          </a>
          {"·"}
          <a
            className="hover:underline font-semibold"
            href={"https://github.com/zcbntr/linkedin-data-refinement"}
          >
            GitHub
          </a>
        </div>
        <div className="text-[rgba(0,0,0,0.6)] mx-auto text-center text-sm">
          This work is parody. Not affiliated with LinkedIn. The LinkedIn logo
          is property of LinkedIn. Any resemblence to real companies, brands, or
          trademarks is unintentional.
        </div>
      </footer>
    </main>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;
    if (over && over.id !== "Apply") {
      const index = binLookup.findIndex((x) => x === over.id);
      const newBinCounts = [...binCounts];
      newBinCounts[index] = newBinCounts[index] + 1;
      const totalJobsClassified = newBinCounts.reduce(
        (sum, count) => sum + count,
        0,
      );

      setBinCounts(newBinCounts);
      setCompletionPercentage((current) => {
        const next = addCompletionProgress(current, totalJobsClassified);
        if (next >= COMPLETION_MAX && current < COMPLETION_MAX) {
          console.log(
            "Congratulations! You cheated your way to the completion cap. LinkedIn would be proud.",
          );
        }
        return next;
      });
    }
  }
}

export default App;
