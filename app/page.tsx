"use client";

import { useEffect, useState } from "react";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TreatmentsTable } from "@/app/components/TreatmentsTable";
import type { Treatment, TreatmentStatus } from "@/lib/types";

const STATUS_OPTIONS: Array<{ label: string; value: TreatmentStatus | "all" }> =
  [
    { label: "All", value: "all" },
    { label: "Scheduled", value: "scheduled" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [filtered, setFiltered] = useState<Treatment[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TreatmentStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const response = await fetch("/api/treatments");
      const data = await response.json();
      const items = data.data ?? [];

      setTreatments(items);
      setFiltered(items);
      setTotal(items.length);
      setIsLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    let next = [...treatments];

    if (search.trim()) {
      const query = search.toLowerCase();
      next = next.filter((item) => {
        return (
          item.patient.toLowerCase().includes(query) ||
          item.procedure.toLowerCase().includes(query) ||
          item.dentist.toLowerCase().includes(query)
        );
      });
    }

    if (status !== "all") {
      next = next.filter((item) => (item.status || "unknown") === status);
    }

    // eslint-disable-next-line
    setFiltered(next);
  }, [search, status, treatments]);

  return (
    <div className="container mx-auto flex flex-col gap-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">DentalDesk</h1>
        <p className="text-sm text-muted-foreground">
          Track dental treatments and their status.
        </p>
      </header>

      <section className="flex flex-col gap-4 rounded-lg border bg-card/40 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
            <Input
              placeholder="Search patients, procedures, dentists..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as TreatmentStatus | "all")
              }
            >
              <SelectTrigger className="md:w-[220px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Add treatment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add treatment</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Input id="patient" name="patient" placeholder="Jane Doe" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="procedure">Procedure</Label>
                  <Input
                    id="procedure"
                    name="procedure"
                    placeholder="Filling"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dentist">Dentist</Label>
                  <Input id="dentist" name="dentist" placeholder="Dr. Smith" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Add any treatment notes"
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">Save treatment</Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <TreatmentsTable
        treatments={filtered}
        isLoading={isLoading}
        total={total}
        filteredCount={filtered.length}
      />
    </div>
  );
}
