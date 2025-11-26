import { z } from "zod";
import type { Treatment } from "./types";
import type { CreateTreatmentRequest } from "./api.types";

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

export interface TreatmentsApiResult {
  items: Treatment[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export async function fetchTreatmentsApi(
  queryString: string,
  fallbackPage: number,
  fallbackPageSize: number,
  signal?: AbortSignal
): Promise<TreatmentsApiResult> {
  const response = await fetch(`/api/treatments?${queryString}`, { signal });

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

  return {
    items: rawItems,
    page: data.page ?? fallbackPage,
    pageSize: data.pageSize ?? fallbackPageSize,
    total: data.total ?? rawItems.length,
    totalPages: data.totalPages ?? 0,
  };
}

export interface CreateTreatmentApiResult {
  success: boolean;
  error?: string;
  treatment?: Treatment;
}

export async function createTreatmentApi(
  data: CreateTreatmentRequest
): Promise<CreateTreatmentApiResult> {
  try {
    const response = await fetch("/api/treatments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 422) {
      const errorData = await response.json().catch(() => null);
      const message =
        (errorData && typeof errorData.message === "string" && errorData.message) ||
        "Validation error";
      return { success: false, error: message };
    }

    if (!response.ok) {
      return { success: false, error: "Failed to save treatment" };
    }

    const treatment = await response.json().catch(() => null);
    return { success: true, treatment };
  } catch {
    return { success: false, error: "Failed to save treatment" };
  }
}
