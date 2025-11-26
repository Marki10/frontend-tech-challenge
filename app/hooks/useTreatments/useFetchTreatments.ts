import { useEffect, useRef } from "react";
import type { Treatment, SortConfig, FilterParams, PaginationParams } from "@/lib/types";
import { fetchTreatmentsApi } from "@/lib/treatmentsApi";
import type { CacheEntry, TreatmentsStateType } from "./types";

interface UseFetchTreatmentsProps {
  filters: FilterParams;
  sort: SortConfig;
  pagination: PaginationParams & { total: number; totalPages: number };
  setState: React.Dispatch<React.SetStateAction<TreatmentsStateType>>;
  retryKey?: number;
  onCacheClear?: (clearFn: (queryString: string) => void) => void;
}

export function useFetchTreatments({
  filters,
  sort,
  pagination,
  setState,
  retryKey,
  onCacheClear,
}: UseFetchTreatmentsProps) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const clearCacheFnRef = useRef<((queryString: string) => void) | null>(null);

  useEffect(() => {
    if (onCacheClear) {
      clearCacheFnRef.current = (queryString: string) => {
        cacheRef.current.delete(queryString);
      };
      onCacheClear(clearCacheFnRef.current);
    }
  }, [onCacheClear]);

  useEffect(() => {
    const fetchTreatments = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

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
          setState((prev) => ({
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

        setState((prev) => ({
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
        const isAbort =
          err instanceof DOMException && err.name === "AbortError" ||
          err instanceof Error && err.name === "AbortError" ||
          (err && typeof err === "object" && "name" in err && err.name === "AbortError") ||
          (err && typeof err === "object" && "message" in err && typeof err.message === "string" && err.message.includes("aborted"));

        if (isAbort) {
          return;
        }

        const error =
          err instanceof Error
            ? err
            : new Error("Failed to load treatments");
        setState((prev) => ({ ...prev, error, isLoading: false }));
      }
    };

    fetchTreatments();
  }, [filters, sort, pagination.page, pagination.pageSize, pagination.totalPages, setState, retryKey]);
}

