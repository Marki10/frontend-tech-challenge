import { useCallback } from "react";
import { startTransition } from "react";
import { usePathname, useRouter } from "@/routing";
import type { TreatmentStatus, Treatment } from "@/lib/types";
import type { TreatmentsStateType } from "./types";

interface UseFiltersProps {
  state: TreatmentsStateType;
  setState: React.Dispatch<React.SetStateAction<TreatmentsStateType>>;
}

export function useFilters({ state, setState }: UseFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const updateUrl = useCallback(
    (params: URLSearchParams) => {
      const queryString = params.toString();
      const fullPath = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(fullPath, { scroll: false });
    },
    [pathname, router]
  );

  const setSearch = useCallback(
    (search: string) => {
      setState((prev) => {
        const newState = {
          ...prev,
          filters: {
            ...prev.filters,
            search: search || "",
          },
          pagination: { ...prev.pagination, page: 1 },
        };

        startTransition(() => {
          const params = new URLSearchParams();
          if (search?.trim()) {
            params.set("search", search.trim());
          }
          if (newState.filters.status && newState.filters.status !== "all" && Array.isArray(newState.filters.status) && newState.filters.status.length > 0) {
            params.set("status", newState.filters.status.join(","));
          }
          params.set("page", "1");
          params.set("pageSize", String(newState.pagination.pageSize));
          updateUrl(params);
        });

        return newState;
      });
    },
    [setState, updateUrl]
  );

  const setStatus = useCallback(
    (status: TreatmentStatus[] | "all") => {
      setState((prev) => {
        const newState = {
          ...prev,
          filters: { ...prev.filters, status },
          pagination: { ...prev.pagination, page: 1 },
        };

        startTransition(() => {
          const params = new URLSearchParams();
          if (newState.filters.search?.trim()) {
            params.set("search", newState.filters.search.trim());
          }
          if (status && status !== "all" && status.length > 0) {
            params.set("status", status.join(","));
          }
          params.set("page", "1");
          params.set("pageSize", String(newState.pagination.pageSize));
          updateUrl(params);
        });

        return newState;
      });
    },
    [setState, updateUrl]
  );

  const setCurrentPage = useCallback(
    (page: number) => {
      setState((prev) => {
        const newState = {
          ...prev,
          pagination: { ...prev.pagination, page },
        };

        startTransition(() => {
          const params = new URLSearchParams();
          if (newState.filters.search?.trim()) {
            params.set("search", newState.filters.search.trim());
          }
          if (newState.filters.status && newState.filters.status !== "all" && Array.isArray(newState.filters.status) && newState.filters.status.length > 0) {
            params.set("status", newState.filters.status.join(","));
          }
          params.set("page", String(page));
          params.set("pageSize", String(newState.pagination.pageSize));
          updateUrl(params);
        });

        return newState;
      });
    },
    [setState, updateUrl]
  );

  const handleSort = useCallback(
    (field: string) => {
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
    },
    [setState]
  );

  return {
    setSearch,
    setStatus,
    setCurrentPage,
    handleSort,
  };
}

