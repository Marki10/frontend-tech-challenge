"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
  const [open, setOpen] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const t = useTranslations();

  const addTreatmentSchema = z.object({
    patient: z.string().min(1, t("validation-patient-required")),
    procedure: z.string().min(1, t("validation-procedure-required")),
    dentist: z.string().min(1, t("validation-dentist-required")),
    date: z.string().min(1, t("validation-date-required")),
    notes: z.string().optional(),
  });

  type AddTreatmentFormValues = z.infer<typeof addTreatmentSchema>;

  const form = useForm<AddTreatmentFormValues>({
    resolver: zodResolver(addTreatmentSchema),
    defaultValues: {
      patient: "",
      procedure: "",
      dentist: "",
      date: "",
      notes: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = form.handleSubmit(async (values) => {
    setServerError(null);

    try {
      const response = await fetch("/api/treatments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.status === 422) {
        const data = await response.json().catch(() => null as unknown);
        const message =
          (data && typeof data.message === "string" && data.message) ||
          t("errors-validation");
        setServerError(message);
        toast.error(message);
        return;
      }

      if (!response.ok) {
        setServerError(t("errors-failed-to-save"));
        toast.error(t("errors-failed-to-save"));
        return;
      }

      await response.json().catch(() => null as unknown);

      await onSubmit({
        patient: values.patient,
        procedure: values.procedure,
        dentist: values.dentist,
        date: values.date,
        notes: values.notes ?? "",
      });

      toast.success(t("success-treatment-added"));
      setOpen(false);
      form.reset();
    } catch {
      setServerError(t("errors-failed-to-save"));
      toast.error(t("errors-failed-to-save"));
    }
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
              <FormField
                control={form.control}
                name="patient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form-patient")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("placeholders-patient")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="procedure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form-procedure")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("placeholders-procedure")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dentist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form-dentist")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("placeholders-dentist")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form-date")}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form-notes")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("placeholders-notes")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
