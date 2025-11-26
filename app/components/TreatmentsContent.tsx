import { TreatmentsTable } from "./TreatmentsTable";
import { EmptyState } from "./EmptyState";
import { PaginationControls } from "./PaginationControls";
import { Button } from "@/components/ui/button";
import type { Treatment, TreatmentStatus, SortConfig } from "@/lib/types";
import { useTranslations } from "next-intl";

interface TreatmentsContentProps {
  filteredTreatments: Treatment[];
  paginatedTreatments: Treatment[];
  isLoading: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortConfig?: SortConfig;
  onSort?: (field: string) => void;
  onUpdateStatus?: (id: number, status: TreatmentStatus) => void;
  updatingStatusIds: Set<number>;
  clearFilters: () => void;
}

export function TreatmentsContent({
  filteredTreatments,
  paginatedTreatments,
  isLoading,
  total,
  currentPage,
  totalPages,
  onPageChange,
  sortConfig,
  onSort,
  onUpdateStatus,
  updatingStatusIds,
  clearFilters,
}: TreatmentsContentProps) {
  const t = useTranslations();

  if (isLoading) {
    return (
      <TreatmentsTable
        treatments={[]}
        isLoading={true}
        total={0}
        filteredCount={0}
        sortConfig={sortConfig}
        onSort={onSort}
        onUpdateStatus={onUpdateStatus}
        updatingStatusIds={updatingStatusIds}
      />
    );
  }

  if (filteredTreatments.length === 0) {
    return (
      <EmptyState>
        <Button variant="outline" onClick={clearFilters}>
          {t("treatments-clear-filters")}
        </Button>
      </EmptyState>
    );
  }

  return (
    <>
      <TreatmentsTable
        treatments={paginatedTreatments}
        isLoading={isLoading}
        total={total}
        filteredCount={filteredTreatments.length}
        sortConfig={sortConfig}
        onSort={onSort}
        onUpdateStatus={onUpdateStatus}
        updatingStatusIds={updatingStatusIds}
      />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        disabled={isLoading}
        className="mt-4"
      />
    </>
  );
}
