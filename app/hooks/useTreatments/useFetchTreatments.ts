import { useEffect, useRef } from "react";
import type { Treatment, SortConfig, FilterParams, PaginationParams } from "@/lib/types";
import { fetchTreatmentsApi } from "@/lib/treatmentsApi";
import type { CacheEntry } from "./types";

interface UseFetchTreatmentsProps {
  filters: FilterParams;
  sort: SortConfig;
  pagination: PaginationParams & { total: number; totalPages: number };
  setState: React.Dispatch<React.SetStateAction<any>>;
}

export function useFetchTreatments({
  filters,
  sort,
  pagination,
  setState,
}: UseFetchTreatmentsProps) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  useEffect(() => {
    const fetchTreatments = async () => {
      setState((prev: any) => ({ ...prev, isLoading: true }));

      try {
        const params = new URLSearchParams();

        if (filters.search?.trim()) {
          params.set("search", filters.search.trim());
        }

        if (filters.status && filters.status !== "all" && Array.isArray(filters.status) && filters.status.length > 0) {
          params.set("status", filters.status.join(","));
        }

        params.set("page", String(pagination.page));
        params.set("pageSize", String(pagination.pageSize));

        const queryString = params.toString();

        const cached = cacheRef.current.get(queryString);
        if (cached) {
          setState((prev: any) => ({
            ...prev,
            items: cached.items,
            filteredItems: cached.items,
            paginatedItems: cached.items,
            isLoading: false,
            pagination: {
              ...prev.pagination,
              page: cached.page,
              pageSize: cached.pageSize,
              total: cached.total,
              totalPages: cached.totalPages,
            },
          }));
          return;
        }

        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const result = await fetchTreatmentsApi(
          queryString,
          pagination.page,
          pagination.pageSize,
          controller.signal
        );

        const items = [...result.items].sort((a: Treatment, b: Treatment) => {
          const aValue = a[sort.field]?.toString().toLowerCase() || "";
          const bValue = b[sort.field]?.toString().toLowerCase() || "";

          if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
          return 0;
        });

        const nextPagination = {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
          totalPages: result.totalPages ?? pagination.totalPages,
        };

        cacheRef.current.set(queryString, {
          items,
          ...nextPagination,
        });

        setState((prev: any) => ({
          ...prev,
          items,
          filteredItems: items,
          paginatedItems: items,
          isLoading: false,
          pagination: {
            ...prev.pagination,
            ...nextPagination,
          },
        }));
      } catch (err) {
        if ((err as { name?: string } | null)?.name === "AbortError") {
          return;
        }

        const error =
          err instanceof Error ? err : new Error("Failed to load treatments");
        setState((prev: any) => ({ ...prev, error, isLoading: false }));
      }
    };

    fetchTreatments();
  }, [filters, sort, pagination.page, pagination.pageSize, setState]);
}

