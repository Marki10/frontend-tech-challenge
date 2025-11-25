import { useState, useEffect, useCallback } from "react";
import type { Treatment, TreatmentStatus } from "@/lib/types";

const ITEMS_PER_PAGE = 10;

export function useTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [filtered, setFiltered] = useState<Treatment[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TreatmentStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1);
  }, [search, status, treatments]);

  const handleAddTreatment = useCallback(
    async (data: {
      patient: string;
      procedure: string;
      dentist: string;
      date: string;
      notes: string;
    }) => {
      try {
        const newTreatment: Treatment = {
          ...data,
          id: Date.now(),
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
    },
    []
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedTreatments = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    search,
    status,
    isLoading,
    error,
    filteredTreatments: filtered,
    paginatedTreatments,
    currentPage,
    totalPages,
    totalCount: treatments.length,
    setSearch,
    setStatus,
    setCurrentPage,
    handleAddTreatment,
  };
}
