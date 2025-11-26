import { useCallback } from "react";
import { startTransition } from "react";
import { usePathname, useRouter } from "@/routing";
import type { TreatmentStatus, SortConfig, Treatment } from "@/lib/types";

interface UseFiltersProps {
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
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
      setState((prev: any) => {
        startTransition(() => {
          const params = new URLSearchParams();
          if (search?.trim()) {
            params.set("search", search.trim());
          }
          if (prev.filters.status && prev.filters.status !== "all" && Array.isArray(prev.filters.status) && prev.filters.status.length > 0) {
            params.set("status", prev.filters.status.join(","));
          }
          params.set("page", "1");
          params.set("pageSize", String(prev.pagination.pageSize));
          updateUrl(params);
        });

        return {
          ...prev,
          filters: {
            ...prev.filters,
            search: search || "",
          },
          pagination: { ...prev.pagination, page: 1 },
        };
      });
    },
    [setState, updateUrl]
  );

  const setStatus = useCallback(
    (status: TreatmentStatus[] | "all") => {
      setState((prev: any) => {
        startTransition(() => {
          const params = new URLSearchParams();
          if (prev.filters.search?.trim()) {
            params.set("search", prev.filters.search.trim());
          }
          if (status && status !== "all" && status.length > 0) {
            params.set("status", status.join(","));
          }
          params.set("page", "1");
          params.set("pageSize", String(prev.pagination.pageSize));
          updateUrl(params);
        });

        return {
          ...prev,
          filters: { ...prev.filters, status },
          pagination: { ...prev.pagination, page: 1 },
        };
      });
    },
    [setState, updateUrl]
  );

  const setCurrentPage = useCallback(
    (page: number) => {
      setState((prev: any) => {
        startTransition(() => {
          const params = new URLSearchParams();
          if (prev.filters.search?.trim()) {
            params.set("search", prev.filters.search.trim());
          }
          if (prev.filters.status && prev.filters.status !== "all" && Array.isArray(prev.filters.status) && prev.filters.status.length > 0) {
            params.set("status", prev.filters.status.join(","));
          }
          params.set("page", String(page));
          params.set("pageSize", String(prev.pagination.pageSize));
          updateUrl(params);
        });

        return {
          ...prev,
          pagination: { ...prev.pagination, page },
        };
      });
    },
    [setState, updateUrl]
  );

  const handleSort = useCallback(
    (field: string) => {
      setState((prev: any) => ({
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

