"use client";

import { Header } from "./components/Header";
import { FiltersSection } from "./components/FiltersSection";
import { TreatmentsContent } from "./components/TreatmentsContent";
import { ErrorState } from "./components/ErrorState";
import { useTreatments } from "./hooks/useTreatments";

export default function TreatmentsPage() {
  const {
    items,
    filteredItems,
    paginatedItems,
    isLoading,
    error,
    filters,
    sort,
    pagination,
    handleAddTreatment,
    setSearch,
    setStatus,
    setCurrentPage,
    handleSort,
  } = useTreatments();

  if (error) {
    return (
      <div className="container mx-auto flex flex-col gap-6 py-10">
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col gap-6 py-10">
      <Header />

      <FiltersSection
        search={filters.search}
        onSearchChange={setSearch}
        status={filters.status}
        onStatusChange={setStatus}
        onAddTreatment={handleAddTreatment}
      />

      <TreatmentsContent
        filteredTreatments={filteredItems}
        paginatedTreatments={paginatedItems}
        isLoading={isLoading}
        total={items.length}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
        sortConfig={sort}
        onSort={handleSort}
      />
    </div>
  );
}
