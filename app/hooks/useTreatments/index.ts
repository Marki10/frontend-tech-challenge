import { useState } from "react";
import { initialState } from "./constants";
import { useUrlSync } from "./useUrlSync";
import { useFetchTreatments } from "./useFetchTreatments";
import { useFilters } from "./useFilters";
import { useTreatmentActions } from "./useTreatmentActions";

export function useTreatments() {
  const [state, setState] = useState(initialState);

  useUrlSync({ setState });
  
  useFetchTreatments({
    filters: state.filters,
    sort: state.sort,
    pagination: state.pagination,
    setState,
  });

  const { setSearch, setStatus, setCurrentPage, handleSort } = useFilters({
    state,
    setState,
  });

  const { handleAddTreatment, updateTreatmentStatus } = useTreatmentActions({
    setState,
  });

  return {
    ...state,
    handleAddTreatment,
    updateTreatmentStatus,
    setSearch,
    setStatus,
    setCurrentPage,
    handleSort,
  };
}

