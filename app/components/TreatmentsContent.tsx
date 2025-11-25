import { TreatmentsTable } from "./TreatmentsTable";
import { EmptyState } from "./EmptyState";
import { PaginationControls } from "./PaginationControls";
import type { Treatment, SortConfig } from "@/lib/types";

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
}: TreatmentsContentProps) {
  if (filteredTreatments.length === 0) {
    return <EmptyState />;
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
      />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-4"
      />
    </>
  );
}
