import { useCallback } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import type { Treatment, TreatmentStatus } from "@/lib/types";
import { CreateTreatmentRequest } from "@/lib/api.types";
import type { TreatmentsStateType } from "./types";

interface UseTreatmentActionsProps {
  setState: React.Dispatch<React.SetStateAction<TreatmentsStateType>>;
}

export function useTreatmentActions({ setState }: UseTreatmentActionsProps) {
  const t = useTranslations();
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

          let errorMessage = t("error-update-status");
          if (response.status === 404) {
            errorMessage = t("error-update-status-404");
          } else if (response.status >= 500) {
            errorMessage = t("error-update-status-500");
          }

          toast.error(errorMessage, { duration: 3000 });
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
      } catch (error) {
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

        const errorMessage =
          error instanceof TypeError && error.message.includes("fetch")
            ? t("error-network")
            : t("error-update-status");

        toast.error(errorMessage, { duration: 3000 });
      }
    },
    [setState, t]
  );

  return {
    handleAddTreatment,
    updateTreatmentStatus,
  };
}

