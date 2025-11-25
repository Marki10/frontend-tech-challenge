"use client";

import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { FiltersSection } from "./components/FiltersSection";
import { TreatmentsContent } from "./components/TreatmentsContent";
import { ErrorState } from "./components/ErrorState";
import type { Treatment, TreatmentStatus } from "@/lib/types";

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [filtered, setFiltered] = useState<Treatment[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TreatmentStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/treatments");
        const data = await response.json();
        const items = data.data ?? [];
        setTreatments(items);
        setFiltered(items);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load treatments")
        );
      } finally {
        setIsLoading(false);
      }
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

    setFiltered(next);
    setCurrentPage(1); // Reset to first page when filters change
  }, [search, status, treatments]);

  const handleAddTreatment = async (data: {
    patient: string;
    procedure: string;
    dentist: string;
    date: string;
    notes: string;
  }) => {
    try {
      // Create a new treatment with a numeric ID to match the Treatment type
      const newTreatment: Treatment = {
        ...data,
        id: Date.now(), // Changed to number to match Treatment type
        status: "scheduled" as const,
      };

      setTreatments((prev) => [newTreatment, ...prev]);
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
      <Header />

      <FiltersSection
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        onAddTreatment={handleAddTreatment}
      />

      <TreatmentsContent
        filteredTreatments={filtered}
        paginatedTreatments={paginatedTreatments}
        isLoading={isLoading}
        total={treatments.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
