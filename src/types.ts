export type BinCount = {
  name: string;
  count: number;
};

export type ApplyLabel = "easy" | "difficult" | null;

export type Job = {
  name: string;
  company: string;
  location: string;
  postDateString: string;
  category: string;
  applyLabel: ApplyLabel;
};
