"use client";

import { Header } from "./components/Header";
import { FiltersSection } from "./components/FiltersSection";
import { TreatmentsContent } from "./components/TreatmentsContent";
import { ErrorState } from "./components/ErrorState";
import { useTreatments } from "./hooks/useTreatments";

export default function TreatmentsPage() {
  const {
    search,
    status,
    isLoading,
    error,
    filteredTreatments,
    paginatedTreatments,
    currentPage,
    totalPages,
    totalCount,
    setSearch,
    setStatus,
    setCurrentPage,
    handleAddTreatment,
  } = useTreatments();

  if (error) {
    return (
      <div className="container mx-auto flex flex-col gap-6 py-10">
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col gap-6 py-10">
      <Header />

      <FiltersSection
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        onAddTreatment={handleAddTreatment}
      />

      <TreatmentsContent
        filteredTreatments={filteredTreatments}
        paginatedTreatments={paginatedTreatments}
        isLoading={isLoading}
        total={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
