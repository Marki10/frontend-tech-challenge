import { TreatmentRow } from "./TreatmentRow";
import type { TreatmentsTableProps } from "@/lib/component.types";
import { Skeleton } from "@/components/ui/skeleton";

export function TreatmentsTable({
  treatments,
  isLoading,
  total,
  filteredCount,
  onUpdateStatus,
}: TreatmentsTableProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-md border bg-card p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
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
          <TreatmentRow
            key={treatment.id || index}
            treatment={treatment}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </>
  );
}
