import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { createAddTreatmentSchema, type AddTreatmentFormValues } from "@/app/components/forms/addTreatmentSchema";
import { createTreatmentApi } from "@/lib/treatmentsApi";

interface UseAddTreatmentFormProps {
  onSuccess: (data: {
    patient: string;
    procedure: string;
    dentist: string;
    date: string;
    notes: string;
  }) => Promise<boolean>;
  onSuccessCallback?: () => void;
}

export function useAddTreatmentForm({
  onSuccess,
  onSuccessCallback,
}: UseAddTreatmentFormProps) {
  const t = useTranslations();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = createAddTreatmentSchema(t);
  const form = useForm<AddTreatmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patient: "",
      procedure: "",
      dentist: "",
      date: "",
      notes: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setServerError(null);

    const result = await createTreatmentApi(values);

    if (!result.success) {
      setServerError(result.error || t("errors-failed-to-save"));
      toast.error(result.error || t("errors-failed-to-save"));
      return;
    }

    const callbackResult = await onSuccess({
      patient: values.patient,
      procedure: values.procedure,
      dentist: values.dentist,
      date: values.date,
      notes: values.notes ?? "",
    });

    if (callbackResult) {
      toast.success(t("success-treatment-added"));
      form.reset();
      onSuccessCallback?.();
    }
  });

  return {
    form,
    handleSubmit,
    serverError,
    isSubmitting: form.formState.isSubmitting,
  };
}
