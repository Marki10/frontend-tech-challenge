import { useCallback } from "react";
import { toast } from "sonner";
import type { Treatment, TreatmentStatus } from "@/lib/types";
import { CreateTreatmentRequest } from "@/lib/api.types";
import type { TreatmentsStateType } from "./types";

interface UseTreatmentActionsProps {
  setState: React.Dispatch<React.SetStateAction<TreatmentsStateType>>;
}

export function useTreatmentActions({ setState }: UseTreatmentActionsProps) {
  const handleAddTreatment = useCallback(
    async (data: CreateTreatmentRequest) => {
      try {
        const newTreatment: Treatment = {
          ...data,
          id: Date.now(),
          status: data.status || "scheduled",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setState((prev) => ({
          ...prev,
          items: [newTreatment, ...prev.items],
        }));

        return true;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to add treatment");
        setState((prev) => ({ ...prev, error }));
        return false;
      }
    },
    [setState]
  );

  const updateTreatmentStatus = useCallback(
    async (id: number, status: TreatmentStatus) => {
      let previousItems: Treatment[] = [];

      setState((prev) => {
        previousItems = prev.items;
        const newUpdatingIds = new Set(prev.updatingStatusIds);
        newUpdatingIds.add(id);

        const updatedItems = prev.items.map((item) =>
          item.id === id ? { ...item, status } : item
        );

        return {
          ...prev,
          items: updatedItems,
          filteredItems: updatedItems,
          paginatedItems: updatedItems,
          updatingStatusIds: newUpdatingIds,
        };
      });

      try {
        const response = await fetch(`/api/treatments/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          setState((prev) => {
            const newUpdatingIds = new Set(prev.updatingStatusIds);
            newUpdatingIds.delete(id);

            return {
              ...prev,
              items: previousItems,
              filteredItems: previousItems,
              paginatedItems: previousItems,
              updatingStatusIds: newUpdatingIds,
            };
          });

          toast.error("Failed to update status", { duration: 3000 });
          return;
        }

        setState((prev) => {
          const newUpdatingIds = new Set(prev.updatingStatusIds);
          newUpdatingIds.delete(id);

          return {
            ...prev,
            updatingStatusIds: newUpdatingIds,
          };
        });

        toast.success("Status updated", { duration: 3000 });
      } catch {
        setState((prev) => {
          const newUpdatingIds = new Set(prev.updatingStatusIds);
          newUpdatingIds.delete(id);

          return {
            ...prev,
            items: previousItems,
            filteredItems: previousItems,
            paginatedItems: previousItems,
            updatingStatusIds: newUpdatingIds,
          };
        });

        toast.error("Failed to update status", { duration: 3000 });
      }
    },
    [setState]
  );

  return {
    handleAddTreatment,
    updateTreatmentStatus,
  };
}

