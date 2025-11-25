import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { filters, sort, pagination } = state;

  useEffect(() => {
    setState((prev) => {
      if (!searchParams) return prev;

      const urlSearch = (searchParams.get("search") || "").trim();
      const urlStatus = (searchParams.get("status") || "all") as
        | TreatmentStatus
        | "all";
      const urlPage = Number.parseInt(searchParams.get("page") || "1", 10);

      return {
        ...prev,
        filters: {
          ...prev.filters,
          search: urlSearch || prev.filters.search,
          status: (urlStatus || prev.filters.status) as TreatmentStatus | "all",
        },
        pagination: {
          ...prev.pagination,
          page: Number.isNaN(urlPage) || urlPage <= 0 ? 1 : urlPage,
        },
      };
    });
  }, []);

  useEffect(() => {
    const fetchTreatments = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const params = new URLSearchParams();

        if (filters.search?.trim()) {
          params.set("search", filters.search.trim());
        }

        if (filters.status && filters.status !== "all") {
          params.set("status", filters.status);
        }

        params.set("page", String(pagination.page));
        params.set("pageSize", String(pagination.pageSize));

        const queryString = params.toString();

        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
          scroll: false,
        });

        const response = await fetch(`/api/treatments?${queryString}`);

        if (!response.ok) {
          throw new Error("Failed to load treatments");
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        const rawItems = Array.isArray(data?.data) ? data.data : [];

        const items = [...rawItems].sort((a: Treatment, b: Treatment) => {
          const aValue = a[sort.field]?.toString().toLowerCase() || "";
          const bValue = b[sort.field]?.toString().toLowerCase() || "";

          if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
          return 0;
        });

        setState((prev) => ({
          ...prev,
          items,
          filteredItems: items,
          paginatedItems: items,
          isLoading: false,
          pagination: {
            ...prev.pagination,
            page: data?.page ?? pagination.page,
            pageSize: data?.pageSize ?? pagination.pageSize,
            total: data?.total ?? items.length,
            totalPages: data?.totalPages ?? prev.pagination.totalPages,
          },
        }));
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to load treatments");
        setState((prev) => ({ ...prev, error, isLoading: false }));
      }
    };

    fetchTreatments();
  }, [filters, sort, pagination.page, pagination.pageSize, pathname, router]);

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
      filters: {
        ...prev.filters,
        search: search || "",
      },
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
