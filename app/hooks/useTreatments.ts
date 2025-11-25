import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Treatment, TreatmentStatus, TreatmentsState } from "@/lib/types";
import { CreateTreatmentRequest } from "@/lib/api.types";
import { toast } from "sonner";
import { z } from "zod";

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

const treatmentsResponseSchema = z.object({
  data: z
    .array(
      z.object({
        id: z.number(),
        patient: z.string(),
        procedure: z.string(),
        dentist: z.string(),
        date: z.string(),
        status: z
          .enum(["scheduled", "in_progress", "completed", "cancelled"])
          .optional(),
        notes: z.string().optional(),
        cost: z.number().optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
      })
    )
    .optional(),
  total: z.number().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
  totalPages: z.number().optional(),
});

export function useTreatments() {
  const [state, setState] = useState(initialState);

  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<
    Map<
      string,
      {
        items: Treatment[];
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
      }
    >
  >(new Map());

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

        const response = await fetch(`/api/treatments?${queryString}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load treatments");
        }

        const text = await response.text();
        const json = text ? JSON.parse(text) : {};
        const parsed = treatmentsResponseSchema.safeParse(json);

        if (!parsed.success) {
          throw new Error("Invalid treatments response");
        }

        const data = parsed.data;
        const rawItems = Array.isArray(data.data) ? data.data : [];

        const items = [...rawItems].sort((a: Treatment, b: Treatment) => {
          const aValue = a[sort.field]?.toString().toLowerCase() || "";
          const bValue = b[sort.field]?.toString().toLowerCase() || "";

          if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
          return 0;
        });

        const nextPagination = {
          page: data.page ?? pagination.page,
          pageSize: data.pageSize ?? pagination.pageSize,
          total: data.total ?? items.length,
          totalPages: data.totalPages ?? state.pagination.totalPages,
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
        if ((err as { name?: string } | null)?.name === "AbortError") {
          return;
        }

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

  const updateTreatmentStatus = useCallback(
    async (id: number, status: TreatmentStatus) => {
      let previousItems: Treatment[] = [];

      setState((prev) => {
        previousItems = prev.items;

        const updatedItems = prev.items.map((item) =>
          item.id === id ? { ...item, status } : item
        );

        return {
          ...prev,
          items: updatedItems,
          filteredItems: updatedItems,
          paginatedItems: updatedItems,
        };
      });

      try {
        const response = await fetch(`/api/treatments/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          setState((prev) => ({
            ...prev,
            items: previousItems,
            filteredItems: previousItems,
            paginatedItems: previousItems,
          }));

          toast.error("Failed to update status");
          return;
        }

        toast.success("Status updated");
      } catch {
        setState((prev) => ({
          ...prev,
          items: previousItems,
          filteredItems: previousItems,
          paginatedItems: previousItems,
        }));

        toast.error("Failed to update status");
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
    updateTreatmentStatus,
    setSearch,
    setStatus,
    setCurrentPage,
    handleSort,
  };
}
