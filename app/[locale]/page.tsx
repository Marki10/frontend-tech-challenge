"use client";

import { Suspense } from "react";
import { Header } from "../components/Header";
import { FiltersSection } from "../components/FiltersSection";
import { TreatmentsContent } from "../components/TreatmentsContent";
import { ErrorState } from "../components/ErrorState";
import {
  TreatmentsProvider,
  useTreatmentsContext,
} from "../context/TreatmentsContext";

function TreatmentsPageContent() {
  const {
    filteredItems,
    paginatedItems,
    isLoading,
    error,
    filters,
    sort,
    pagination,
    handleAddTreatment,
    updateTreatmentStatus,
    setSearch,
    setStatus,
    setCurrentPage,
    handleSort,
  } = useTreatmentsContext();

  if (error) {
    return (
      <div className="container mx-auto flex flex-col gap-6 px-2.5 py-10">
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col gap-6 px-2.5 py-10">
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
        total={pagination.total}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
        sortConfig={sort}
        onSort={handleSort}
        onUpdateStatus={updateTreatmentStatus}
      />
    </div>
  );
}

export default function TreatmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex flex-col gap-6 px-2.5 py-10">
          <div className="flex items-center justify-center py-20">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </div>
      }
    >
      <TreatmentsProvider>
        <TreatmentsPageContent />
      </TreatmentsProvider>
    </Suspense>
  );
}
