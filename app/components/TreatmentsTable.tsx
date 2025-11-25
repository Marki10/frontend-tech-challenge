import type { Treatment } from "@/lib/types";
import { TreatmentRow } from "./TreatmentRow";

interface TreatmentsTableProps {
  treatments: Treatment[];
  isLoading: boolean;
  total: number;
  filteredCount: number;
}

export function TreatmentsTable({
  treatments,
  isLoading,
  total,
  filteredCount,
}: TreatmentsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        Loading treatments...
      </div>
    );
  }

  return (
    <>
      <div className="text-sm text-muted-foreground">
        Showing {filteredCount} of {total} treatments
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {treatments.map((treatment, index) => (
          <TreatmentRow key={treatment.id || index} treatment={treatment} />
        ))}
      </div>
    </>
  );
}
