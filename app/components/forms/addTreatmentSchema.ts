import { z } from "zod";

export function createAddTreatmentSchema(t: (key: string) => string) {
  return z.object({
    patient: z.string().min(1, t("validation-patient-required")),
    procedure: z.string().min(1, t("validation-procedure-required")),
    dentist: z.string().min(1, t("validation-dentist-required")),
    date: z.string().min(1, t("validation-date-required")),
    notes: z.string().optional(),
  });
}

export type AddTreatmentFormValues = {
  patient: string;
  procedure: string;
  dentist: string;
  date: string;
  notes?: string;
};

