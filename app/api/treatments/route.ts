import { NextResponse } from "next/server";

import type { Treatment, TreatmentStatus } from "@/lib/types";
import {
  getNextTreatmentId,
  getTreatments,
  insertTreatment,
} from "@/mock/data";
import { withSimulate } from "@/mock/simulate";

const REQUIRED_FIELDS = ["patient", "procedure", "dentist", "date"] as const;

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 9;
const MAX_PAGE_SIZE = 100;

function parsePositiveInteger(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export async function GET(request: Request) {
  try {
    return await withSimulate(
      async () => {
        const treatments = await getTreatments();

        const { searchParams } = new URL(request.url);

        const search = (searchParams.get("search") || "").trim().toLowerCase();
        const page = parsePositiveInteger(searchParams.get("page"), DEFAULT_PAGE);
        const pageSize = Math.min(
          parsePositiveInteger(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE),
          MAX_PAGE_SIZE
        );
        const statusParam = searchParams.get("status");
        let filteredByStatus = treatments;
        
        if (statusParam && statusParam !== "all") {
          const statusArray = statusParam.split(",").filter(Boolean) as TreatmentStatus[];
          if (statusArray.length > 0) {
            filteredByStatus = treatments.filter((item) => 
              item.status && statusArray.includes(item.status)
            );
          }
        }

        const filtered = search
          ? filteredByStatus.filter((item) => {
              const patient = (item.patient || "").toLowerCase();
              const procedure = (item.procedure || "").toLowerCase();
              const dentist = (item.dentist || "").toLowerCase();

              return (
                patient.includes(search) ||
                procedure.includes(search) ||
                dentist.includes(search)
              );
            })
          : filteredByStatus;

        const total = filtered.length;
        const totalPages = Math.ceil(total / pageSize);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const data = filtered.slice(start, end);

        return NextResponse.json({
          data,
          total,
          page,
          pageSize,
          totalPages,
        });
      },
      {
        allowFailure: true,
      }
    );
  } catch (error) {
    console.error("Error fetching treatments:", error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to fetch treatments",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return withSimulate(
    async () => {
      const payload = await request.json();

      const missingField = REQUIRED_FIELDS.find((field) => {
        const value = payload?.[field];
        return typeof value !== "string" || value.trim().length === 0;
      });

      if (missingField) {
        return NextResponse.json(
          {
            message: `Missing required field: ${missingField}`,
          },
          { status: 422 }
        );
      }

      const treatment: Treatment = {
        id: await getNextTreatmentId(),
        patient: payload.patient.trim(),
        procedure: payload.procedure.trim(),
        dentist: payload.dentist.trim(),
        date: payload.date,
        status: (payload.status ?? "scheduled") as Treatment["status"],
        notes: payload.notes,
        cost: typeof payload.cost === "number" ? payload.cost : undefined,
      };

      await insertTreatment(treatment);

      return NextResponse.json(treatment, { status: 201 });
    },
    {
      allowFailure: true,
    }
  );
}
