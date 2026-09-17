

export type OpenPosition = {
  title: string;
  department: string;
  location: string;
  type: string;
  /** ISO date `YYYY-MM-DD`. */
  deadline?: string;
  responsibilities: string[];
  requirements: string[];
};

export const openPositions: OpenPosition[] = [];
