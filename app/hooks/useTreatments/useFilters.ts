import { useCallback } from "react";
import { startTransition } from "react";
import { usePathname, useRouter } from "@/routing";
import type { TreatmentStatus, Treatment } from "@/lib/types";
import type { TreatmentsStateType } from "./types";

interface UseFiltersProps {
  setState: React.Dispatch<React.SetStateAction<TreatmentsStateType>>;
}

export function useFilters({ setState }: UseFiltersProps) {
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
      let currentStatus: TreatmentStatus[] | "all" = "all";
      let currentPageSize = 10;

      setState((prev) => {
        currentStatus = prev.filters.status || "all";
        currentPageSize = prev.pagination.pageSize;
        
        return {
          ...prev,
          filters: {
            ...prev.filters,
            search: search || "",
          },
          pagination: { ...prev.pagination, page: 1 },
        };
      });

      setTimeout(() => {
        startTransition(() => {
          const params = new URLSearchParams();
          if (search?.trim()) {
            params.set("search", search.trim());
          }
          if (currentStatus && currentStatus !== "all" && Array.isArray(currentStatus) && currentStatus.length > 0) {
            params.set("status", currentStatus.join(","));
          }
          params.set("page", "1");
          params.set("pageSize", String(currentPageSize));
          updateUrl(params);
        });
      }, 0);
    },
    [setState, updateUrl]
  );

  const setStatus = useCallback(
    (status: TreatmentStatus[] | "all") => {
      let currentSearch = "";
      let currentPageSize = 10;

      setState((prev) => {
        currentSearch = prev.filters.search || "";
        currentPageSize = prev.pagination.pageSize;
        
        return {
          ...prev,
          filters: { ...prev.filters, status },
          pagination: { ...prev.pagination, page: 1 },
        };
      });

      setTimeout(() => {
        startTransition(() => {
          const params = new URLSearchParams();
          if (currentSearch?.trim()) {
            params.set("search", currentSearch.trim());
          }
          if (status && status !== "all" && status.length > 0) {
            params.set("status", status.join(","));
          }
          params.set("page", "1");
          params.set("pageSize", String(currentPageSize));
          updateUrl(params);
        });
      }, 0);
    },
    [setState, updateUrl]
  );

  const setCurrentPage = useCallback(
    (page: number) => {
      let currentSearch = "";
      let currentStatus: TreatmentStatus[] | "all" = "all";
      let currentPageSize = 10;

      setState((prev) => {
        currentSearch = prev.filters.search || "";
        currentStatus = prev.filters.status || "all";
        currentPageSize = prev.pagination.pageSize;
        
        return {
          ...prev,
          pagination: { ...prev.pagination, page },
        };
      });

      setTimeout(() => {
        startTransition(() => {
          const params = new URLSearchParams();
          if (currentSearch?.trim()) {
            params.set("search", currentSearch.trim());
          }
          if (currentStatus && currentStatus !== "all" && Array.isArray(currentStatus) && currentStatus.length > 0) {
            params.set("status", currentStatus.join(","));
          }
          params.set("page", String(page));
          params.set("pageSize", String(currentPageSize));
          updateUrl(params);
        });
      }, 0);
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

