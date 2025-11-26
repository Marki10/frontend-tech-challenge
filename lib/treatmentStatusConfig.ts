import type { TreatmentStatus } from "./types";

export const TREATMENT_STATUS_CONFIG: Record<
  TreatmentStatus,
  { label: string; className: string }
> = {
  scheduled: {
    label: "Scheduled",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  },
  in_progress: {
    label: "In progress",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  },
  completed: {
    label: "Completed",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  },
};
