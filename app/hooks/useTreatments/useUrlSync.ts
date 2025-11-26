import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { TreatmentStatus } from "@/lib/types";

interface UseUrlSyncProps {
  setState: React.Dispatch<React.SetStateAction<any>>;
}

export function useUrlSync({ setState }: UseUrlSyncProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlSearch = (searchParams.get("search") || "").trim();
    const urlStatus = (searchParams.get("status") || "all") as
      | TreatmentStatus
      | "all";
    const urlPage = Number.parseInt(searchParams.get("page") || "1", 10);

    setState((prev: any) => {
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
  }, [searchParams, setState]);
}

