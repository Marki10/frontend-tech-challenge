import type { TreatmentsState } from "@/lib/types";

export const ITEMS_PER_PAGE = 10;

export const initialState: Omit<TreatmentsState, "pagination"> & {
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
  isLoading: true,
  error: null,
  filters: {
    search: "",
    status: [],
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

export type TreatmentsStateType = typeof initialState;

