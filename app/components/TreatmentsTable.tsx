import { TreatmentRow } from "./TreatmentRow";
import type { TreatmentsTableProps } from "@/lib/component.types";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export function TreatmentsTable({
  treatments,
  isLoading,
  total,
  filteredCount,
  onUpdateStatus,
}: TreatmentsTableProps) {
  const t = useTranslations();
  if (isLoading) {
    return (
      <>
        <div className="mb-4" role="status" aria-live="polite" aria-label={t("aria-loading-treatments")}>
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" role="list" aria-label={t("aria-loading-treatments")}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2 rounded-md border bg-card p-3" role="listitem" aria-hidden="true">
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
      </>
    );
  }

  return (
    <>
      <div
        className="mb-4 text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
        aria-label={t("aria-treatments-loaded", { count: filteredCount })}
      >
        {t("showing-x-of-y-treatments", { filteredCount, total })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" role="list" aria-label={t("treatments-title")}>
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
