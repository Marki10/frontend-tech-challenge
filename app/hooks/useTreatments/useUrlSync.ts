import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { TreatmentStatus } from "@/lib/types";
import type { TreatmentsStateType } from "./types";

interface UseUrlSyncProps {
  setState: React.Dispatch<React.SetStateAction<TreatmentsStateType>>;
}

function normalizeStatus(status: TreatmentStatus[] | "all" | undefined): TreatmentStatus[] {
  if (status === "all" || !status) return [];
  return Array.isArray(status) ? [...status].sort() : [];
}

export function useUrlSync({ setState }: UseUrlSyncProps) {
  const searchParams = useSearchParams();
  const lastUrlRef = useRef<string>("");

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
    const urlKey = `${urlSearch}|${JSON.stringify(normalizeStatus(urlStatus))}|${urlPage}`;

    if (urlKey === lastUrlRef.current) {
      return;
    }

    lastUrlRef.current = urlKey;

    setState((prev) => {
      const normalizedUrlSearch = urlSearch || "";
      const normalizedPrevSearch = prev.filters.search || "";
      
      const urlStatusNormalized = normalizeStatus(urlStatus);
      const prevStatusNormalized = normalizeStatus(prev.filters.status);
      
      const searchChanged = normalizedUrlSearch !== normalizedPrevSearch;
      const statusChanged = JSON.stringify(urlStatusNormalized) !== JSON.stringify(prevStatusNormalized);
      const pageChanged = (Number.isNaN(urlPage) || urlPage <= 0 ? 1 : urlPage) !== prev.pagination.page;
      
      if (!searchChanged && !statusChanged && !pageChanged) {
        return prev;
      }

      return {
        ...prev,
        filters: {
          ...prev.filters,
          search: normalizedUrlSearch,
          status: urlStatus,
        },
        pagination: {
          ...prev.pagination,
          page: Number.isNaN(urlPage) || urlPage <= 0 ? 1 : urlPage,
        },
      };
    });
  }, [searchParams, setState]);
}

