import { Treatment, TreatmentStatus } from "./types";

export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

export type TreatmentsResponse = ApiResponse<Treatment[]>;

export type CreateTreatmentRequest = Omit<Treatment, "id" | "status"> & {
  status?: TreatmentStatus;
};

export type UpdateTreatmentRequest = Partial<Omit<Treatment, "id">> & {
  id: number;
};

export type DeleteTreatmentResponse = {
  success: boolean;
  message?: string;
};
