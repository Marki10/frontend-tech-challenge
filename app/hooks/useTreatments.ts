import { useState, useEffect, useCallback, useMemo } from "react";
import type { Treatment, TreatmentStatus, TreatmentsState } from "@/lib/types";
import { CreateTreatmentRequest } from "@/lib/api.types";

const ITEMS_PER_PAGE = 10;

const initialState: Omit<TreatmentsState, "pagination"> & {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
} = {
  items: [],
  filteredItems: [],
  paginatedItems: [],
  isLoading: false,
  error: null,
  filters: {
    search: "",
    status: "all",
  },
  sort: {
    field: "date",
    direction: "desc",
  },
  pagination: {
    page: 1,
    pageSize: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  },
};

export function useTreatments() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const loadTreatments = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await fetch("/api/treatments");
        const data = await response.json();
        const items = Array.isArray(data?.data) ? data.data : [];

        setState((prev) => ({
          ...prev,
          items,
          filteredItems: items,
          isLoading: false,
          pagination: {
            ...prev.pagination,
            total: items.length,
            totalPages: Math.ceil(items.length / prev.pagination.pageSize),
          },
        }));
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to load treatments");
        setState((prev) => ({ ...prev, error, isLoading: false }));
      }
    };

    loadTreatments();
  }, []);

  useEffect(() => {
    setState((prev) => {
      let filteredItems = [...prev.items];

      if (prev.filters.search?.trim()) {
        const query = prev.filters.search.toLowerCase();
        filteredItems = filteredItems.filter(
          (item) =>
            item.patient.toLowerCase().includes(query) ||
            item.procedure.toLowerCase().includes(query) ||
            item.dentist.toLowerCase().includes(query)
        );
      }

      if (prev.filters.status && prev.filters.status !== "all") {
        filteredItems = filteredItems.filter(
          (item) => (item.status || "unknown") === prev.filters.status
        );
      }

      filteredItems.sort((a, b) => {
        const aValue = a[prev.sort.field]?.toString().toLowerCase() || "";
        const bValue = b[prev.sort.field]?.toString().toLowerCase() || "";

        if (aValue < bValue) return prev.sort.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return prev.sort.direction === "asc" ? 1 : -1;
        return 0;
      });

      const startIndex = (prev.pagination.page - 1) * prev.pagination.pageSize;
      const paginatedItems = filteredItems.slice(
        startIndex,
        startIndex + prev.pagination.pageSize
      );

      return {
        ...prev,
        filteredItems,
        paginatedItems,
        pagination: {
          ...prev.pagination,
          total: filteredItems.length,
          totalPages: Math.ceil(
            filteredItems.length / prev.pagination.pageSize
          ),
        },
      };
    });
  }, [
    state.items,
    state.filters,
    state.sort,
    state.pagination.page,
    state.pagination.pageSize,
  ]);

  const handleAddTreatment = useCallback(
    async (data: CreateTreatmentRequest) => {
      try {
        const newTreatment: Treatment = {
          ...data,
          id: Date.now(),
          status: data.status || "scheduled",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setState((prev) => ({
          ...prev,
          items: [newTreatment, ...prev.items],
        }));

        return true;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to add treatment");
        setState((prev) => ({ ...prev, error }));
        return false;
      }
    },
    []
  );

  const setSearch = useCallback((search: string) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, search },
      pagination: { ...prev.pagination, page: 1 },
    }));
  }, []);

  const setStatus = useCallback((status: TreatmentStatus | "all") => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, status },
      pagination: { ...prev.pagination, page: 1 },
    }));
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, page },
    }));
  }, []);

  const handleSort = useCallback((field: string) => {
    setState((prev) => ({
      ...prev,
      sort: {
        field: field as keyof Omit<
          Treatment,
          "id" | "notes" | "createdAt" | "updatedAt"
        >,
        direction:
          prev.sort.field === field && prev.sort.direction === "asc"
            ? "desc"
            : "asc",
      },
    }));
  }, []);

  return {
    ...state,
    handleAddTreatment,
    setSearch,
    setStatus,
    setCurrentPage,
    handleSort,
  };
}
