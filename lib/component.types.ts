import { Treatment, TreatmentStatus, SortConfig } from "./types";
import { ReactNode } from "react";

export interface TreatmentsTableProps {
  treatments: Treatment[];
  isLoading: boolean;
  total: number;
  filteredCount: number;
  sortConfig?: SortConfig;
  onSort?: (field: string) => void;
  className?: string;
  onUpdateStatus?: (id: number, status: TreatmentStatus) => void;
}

export interface TreatmentRowProps {
  treatment: Treatment;
  onUpdateStatus?: (id: number, status: TreatmentStatus) => void;
  className?: string;
}

export interface StatusBadgeProps {
  status: TreatmentStatus;
  className?: string;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface StatusFilterProps {
  value: TreatmentStatus | "all";
  onChange: (value: TreatmentStatus | "all") => void;
  className?: string;
}

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  disabled?: boolean;
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export interface ErrorStateProps {
  error: Error | null;
  onRetry?: () => void;
  className?: string;
}

export interface AddTreatmentFormValues {
  patient: string;
  procedure: string;
  dentist: string;
  date: string;
  notes?: string;
  cost?: number;
  status?: TreatmentStatus;
}
