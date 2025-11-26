export type TreatmentStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Treatment {
  id: number;
  patient: string;
  procedure: string;
  dentist: string;
  date: string;
  status?: TreatmentStatus;
  notes?: string;
  cost?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type SortDirection = "asc" | "desc";

export type SortField = keyof Omit<
  Treatment,
  "id" | "notes" | "createdAt" | "updatedAt"
>;

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface FilterParams {
  search?: string;
  status?: TreatmentStatus[] | "all";
  dateFrom?: string;
  dateTo?: string;
}

import type { ApiError } from "./errors";

export interface TreatmentsState {
  items: Treatment[];
  filteredItems: Treatment[];
  paginatedItems: Treatment[];
  isLoading: boolean;
  error: Error | ApiError | null;
  filters: FilterParams;
  sort: SortConfig;
  pagination: PaginationParams & {
    total: number;
    totalPages: number;
  };
}
