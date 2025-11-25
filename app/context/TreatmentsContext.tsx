"use client";

import { createContext, useContext, ReactNode } from "react";
import { useTreatments } from "../hooks/useTreatments";
import type { Treatment, TreatmentStatus, SortConfig } from "@/lib/types";

interface TreatmentsContextType {
  items: Treatment[];
  filteredItems: Treatment[];
  paginatedItems: Treatment[];
  isLoading: boolean;
  error: Error | null;
  filters: {
    search?: string;
    status?: TreatmentStatus | "all";
  };
  sort: SortConfig;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };

  handleAddTreatment: (
    data: Omit<Treatment, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  updateTreatmentStatus: (id: number, status: TreatmentStatus) => Promise<void>;
  setSearch: (search: string) => void;
  setStatus: (status: TreatmentStatus | "all") => void;
  setCurrentPage: (page: number) => void;
  handleSort: (field: string) => void;
}

const TreatmentsContext = createContext<TreatmentsContextType | undefined>(
  undefined
);

export function TreatmentsProvider({ children }: { children: ReactNode }) {
  const value = useTreatments();

  return (
    <TreatmentsContext.Provider value={value}>
      {children}
    </TreatmentsContext.Provider>
  );
}

export function useTreatmentsContext() {
  const context = useContext(TreatmentsContext);
  if (context === undefined) {
    throw new Error(
      "useTreatmentsContext must be used within a TreatmentsProvider"
    );
  }
  return context;
}
