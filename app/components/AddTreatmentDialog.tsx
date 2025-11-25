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

const addTreatmentSchema = z.object({
  patient: z.string().min(1, "Patient is required"),
  procedure: z.string().min(1, "Procedure is required"),
  dentist: z.string().min(1, "Dentist is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

type AddTreatmentFormValues = z.infer<typeof addTreatmentSchema>;

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
        const data = await response.json().catch(() => null as any);
        const message =
          (data && typeof data.message === "string" && data.message) ||
          "Validation error";
        setServerError(message);
        toast.error(message);
        return;
      }

      if (!response.ok) {
        setServerError("Failed to save treatment");
        toast.error("Failed to save treatment");
        return;
      }

      await response.json().catch(() => null as any);

      await onSubmit({
        patient: values.patient,
        procedure: values.procedure,
        dentist: values.dentist,
        date: values.date,
        notes: values.notes ?? "",
      });

      toast.success("Treatment added successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      setServerError("Failed to save treatment");
      toast.error("Failed to save treatment");
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add treatment</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="patient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
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
                    <FormLabel>Procedure</FormLabel>
                    <FormControl>
                      <Input placeholder="Filling" {...field} />
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
                    <FormLabel>Dentist</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Smith" {...field} />
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
                    <FormLabel>Date</FormLabel>
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
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any treatment notes"
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
                {isSubmitting ? "Saving..." : "Save treatment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
