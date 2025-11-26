import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { StatusFilter } from "./StatusFilter";
import { AddTreatmentDialog } from "./AddTreatmentDialog";
import type { TreatmentStatus } from "@/lib/types";
import { useTranslations } from "next-intl";

interface FiltersSectionProps {
  search: string | undefined;
  onSearchChange: (value: string) => void;
  status: TreatmentStatus[] | "all" | undefined;
  onStatusChange: (value: TreatmentStatus[] | "all") => void;
  onAddTreatment: (data: {
    patient: string;
    procedure: string;
    dentist: string;
    date: string;
    notes: string;
  }) => Promise<boolean>;
}

export function FiltersSection({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onAddTreatment,
}: FiltersSectionProps) {
  const t = useTranslations();

  return (
    <section className="flex flex-col gap-4 rounded-lg border bg-card/40 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder={t("search-patients-procedures-dentists")}
          />
          <StatusFilter value={status} onChange={onStatusChange} />
        </div>

        <AddTreatmentDialog onSubmit={onAddTreatment}>
          <Button>{t("treatments-add")}</Button>
        </AddTreatmentDialog>
      </div>
    </section>
  );
}
