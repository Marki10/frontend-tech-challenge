import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { TreatmentStatus } from "@/lib/types";
import type { TreatmentsStateType } from "./types";

interface UseUrlSyncProps {
  setState: React.Dispatch<React.SetStateAction<TreatmentsStateType>>;
}

export function useUrlSync({ setState }: UseUrlSyncProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlSearch = (searchParams.get("search") || "").trim();
    const urlStatusParam = searchParams.get("status");
    let urlStatus: TreatmentStatus[] | "all" = "all";
    
    if (urlStatusParam && urlStatusParam !== "all") {
      const statusArray = urlStatusParam.split(",").filter(Boolean) as TreatmentStatus[];
      if (statusArray.length > 0) {
        urlStatus = statusArray;
      }
    }
    
    const urlPage = Number.parseInt(searchParams.get("page") || "1", 10);

    setState((prev) => {
      return {
        ...prev,
        filters: {
          ...prev.filters,
          search: urlSearch || prev.filters.search,
          status: urlStatus || prev.filters.status,
        },
        pagination: {
          ...prev.pagination,
          page: Number.isNaN(urlPage) || urlPage <= 0 ? 1 : urlPage,
        },
      };
    });
  }, [searchParams, setState]);
}

