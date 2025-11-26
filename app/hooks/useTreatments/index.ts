import { useState, useCallback, useRef } from "react";
import { initialState } from "./constants";
import { useUrlSync } from "./useUrlSync";
import { useFetchTreatments } from "./useFetchTreatments";
import { useFilters } from "./useFilters";
import { useTreatmentActions } from "./useTreatmentActions";

export function useTreatments() {
  const [state, setState] = useState<typeof initialState>(initialState);
  const [retryKey, setRetryKey] = useState<number>(0);
  const clearCacheRef = useRef<((queryString: string) => void) | null>(null);

  useUrlSync({ setState });

  useFetchTreatments({
    filters: state.filters,
    sort: state.sort,
    pagination: state.pagination,
    setState,
    retryKey,
    onCacheClear: (clearFn) => {
      clearCacheRef.current = clearFn;
    },
  });

  const { setSearch, setStatus, setCurrentPage, handleSort } = useFilters({
    setState,
  });

  const { handleAddTreatment, updateTreatmentStatus } = useTreatmentActions({
    setState,
  });

  const retry = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
    
    const params = new URLSearchParams();
    if (state.filters.search?.trim()) {
      params.set("search", state.filters.search.trim());
    }
    if (state.filters.status && state.filters.status !== "all" && Array.isArray(state.filters.status) && state.filters.status.length > 0) {
      params.set("status", state.filters.status.join(","));
    }
    params.set("page", String(state.pagination.page));
    params.set("pageSize", String(state.pagination.pageSize));
    
    const queryString = params.toString();
    clearCacheRef.current?.(queryString);
    setRetryKey((prev) => prev + 1);
  }, [state.filters, state.pagination.page, state.pagination.pageSize, setState]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatus("all");
    setCurrentPage(1);
  }, [setSearch, setStatus, setCurrentPage]);

  return {
    ...state,
    handleAddTreatment,
    updateTreatmentStatus,
    setSearch,
    setStatus,
    setCurrentPage,
    handleSort,
    retry,
    clearFilters,
  };
}

