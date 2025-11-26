import type { Treatment } from "@/lib/types";

export type CacheEntry = {
  items: Treatment[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

