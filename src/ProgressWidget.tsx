import { useMemo } from "react";
import progressMessages from "./assets/progress-messages.json";
import { shuffleArray } from "./utils";

type ProgressWidgetProps = {
  completionPercentage: number;
  sortedCount: number;
};

const FALLBACK_MESSAGE = "Keep sorting to help us refine your feed.";

function buildMessageSequence(messages: string[]): string[] {
  if (messages.length === 0) return [];
  const [intro, ...rest] = messages;
  return [intro, ...shuffleArray(rest)];
}

function getMessage(sortedCount: number, sequence: string[]): string {
  if (sequence.length === 0) return FALLBACK_MESSAGE;

  const { listingsPerMessage } = progressMessages;
  const milestone = Math.floor(sortedCount / listingsPerMessage);

  if (milestone === 0) return sequence[0];

  const rest = sequence.slice(1);
  if (rest.length === 0) return sequence[0];

  return rest[(milestone - 1) % rest.length];
}

const ProgressWidget = ({
  completionPercentage,
  sortedCount,
}: ProgressWidgetProps) => {
  const messageSequence = useMemo(
    () => buildMessageSequence(progressMessages.messages),
    [],
  );
  const message = getMessage(sortedCount, messageSequence);
  const displayPercent = +completionPercentage.toFixed(10);

  return (
    <div className="bg-white rounded-lg border border-[#e0e0e0] shadow-sm px-6 py-5 mx-auto max-w-2xl w-full">
      <p className="text-base text-[rgba(0,0,0,0.9)] leading-snug mb-4">
        {message}
      </p>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-baseline text-sm">
          <span className="text-[rgba(0,0,0,0.6)]">
            {sortedCount} {sortedCount === 1 ? "listing" : "listings"} sorted
          </span>
          <span className="font-semibold text-[#0a66c2] tabular-nums">
            {displayPercent}%
          </span>
        </div>

        <div
          className="h-1.5 w-full rounded-full bg-[#e0e0e0] overflow-hidden"
          role="progressbar"
          aria-valuenow={displayPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Total progress"
        >
          <div
            className="h-full rounded-full bg-[#0a66c2] transition-all duration-500 ease-out"
            style={{ width: `${Math.min(displayPercent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressWidget;
