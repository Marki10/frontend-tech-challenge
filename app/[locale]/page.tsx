"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
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
    pagination,
    updatingStatusIds,
    handleAddTreatment,
    updateTreatmentStatus,
    setSearch,
    setStatus,
    setCurrentPage,
    retry,
    clearFilters,
  } = useTreatmentsContext();

  const t = useTranslations();

  if (error) {
    return (
      <div className="container mx-auto flex flex-col gap-6 px-2.5 py-10">
        <ErrorState error={error} onRetry={retry} />
      </div>
    );
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {t("aria-skip-to-main")}
      </a>
      <div className="container mx-auto flex flex-col gap-6 px-2.5 py-10">
        <Header />

        <main id="main-content" tabIndex={-1}>
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
            onUpdateStatus={updateTreatmentStatus}
            updatingStatusIds={updatingStatusIds}
            clearFilters={clearFilters}
          />
        </main>
      </div>
    </>
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
