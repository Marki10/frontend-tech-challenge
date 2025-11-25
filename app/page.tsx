"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TreatmentsTable } from "@/app/components/TreatmentsTable";
import { SearchBar } from "@/app/components/SearchBar";
import { StatusFilter } from "@/app/components/StatusFilter";
import { AddTreatmentDialog } from "@/app/components/AddTreatmentDialog";
import { EmptyState } from "@/app/components/EmptyState";
import { ErrorState } from "@/app/components/ErrorState";
import { PaginationControls } from "@/app/components/PaginationControls";
import type { Treatment, TreatmentStatus } from "@/lib/types";

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [filtered, setFiltered] = useState<Treatment[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TreatmentStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const response = await fetch("/api/treatments");
      const data = await response.json();
      const items = data.data ?? [];

      setTreatments(items);
      setFiltered(items);
      setTotal(items.length);
      setIsLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    let next = [...treatments];

    if (search.trim()) {
      const query = search.toLowerCase();
      next = next.filter((item) => {
        return (
          item.patient.toLowerCase().includes(query) ||
          item.procedure.toLowerCase().includes(query) ||
          item.dentist.toLowerCase().includes(query)
        );
      });
    }

    if (status !== "all") {
      next = next.filter((item) => (item.status || "unknown") === status);
    }

    // eslint-disable-next-line
    setFiltered(next);
  }, [search, status, treatments]);

  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleAddTreatment = async (data: {
    patient: string;
    procedure: string;
    dentist: string;
    date: string;
    notes: string;
  }) => {
    try {
      // Here you would typically make an API call to add the treatment
      const newTreatment = {
        ...data,
        id: Date.now().toString(),
        status: "scheduled" as const,
      };

      setTreatments((prev) => [newTreatment, ...prev]);
      // Reset the form and close the dialog
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to add treatment")
      );
      return false;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedTreatments = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (error) {
    return (
      <div className="container mx-auto flex flex-col gap-6 py-10">
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col gap-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">DentalDesk</h1>
        <p className="text-sm text-muted-foreground">
          Track dental treatments and their status.
        </p>
      </header>

      <section className="flex flex-col gap-4 rounded-lg border bg-card/40 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search patients, procedures, dentists..."
            />
            <StatusFilter
              value={status}
              onChange={setStatus as (value: TreatmentStatus | "all") => void}
            />
          </div>

          <AddTreatmentDialog onSubmit={handleAddTreatment}>
            <Button>Add treatment</Button>
          </AddTreatmentDialog>
        </div>
      </section>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <TreatmentsTable
            treatments={paginatedTreatments}
            isLoading={isLoading}
            total={total}
            filteredCount={filtered.length}
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-4"
          />
        </>
      )}
    </div>
  );
}
