"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormTextField } from "./forms/FormTextField";
import { FormDateField } from "./forms/FormDateField";
import { FormTextareaField } from "./forms/FormTextareaField";
import { useTranslations } from "next-intl";
import { useAddTreatmentForm } from "@/app/hooks/useAddTreatmentForm";

interface AddTreatmentDialogProps {
  children: React.ReactNode;
  onSubmit: (data: {
    patient: string;
    procedure: string;
    dentist: string;
    date: string;
    notes: string;
  }) => Promise<boolean>;
}

export function AddTreatmentDialog({
  children,
  onSubmit,
}: AddTreatmentDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  const { form, handleSubmit, serverError, isSubmitting } = useAddTreatmentForm({
    onSuccess: onSubmit,
    onSuccessCallback: () => setOpen(false),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t("treatments-add-dialog-title")}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <FormTextField
                control={form.control}
                name="patient"
                label={t("form-patient")}
                placeholder={t("placeholders-patient")}
              />

              <FormTextField
                control={form.control}
                name="procedure"
                label={t("form-procedure")}
                placeholder={t("placeholders-procedure")}
              />

              <FormTextField
                control={form.control}
                name="dentist"
                label={t("form-dentist")}
                placeholder={t("placeholders-dentist")}
              />

              <FormDateField
                control={form.control}
                name="date"
                label={t("form-date")}
              />

              <FormTextareaField
                control={form.control}
                name="notes"
                label={t("form-notes")}
                placeholder={t("placeholders-notes")}
              />

              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("form-saving") : t("form-save-treatment")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
