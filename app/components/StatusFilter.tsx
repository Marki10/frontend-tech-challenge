import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TreatmentStatus } from "@/lib/types";
import { useTranslations } from "next-intl";

interface StatusFilterProps {
  value: TreatmentStatus | "all" | undefined;
  onChange: (value: TreatmentStatus | "all") => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  const t = useTranslations();

  const STATUS_OPTIONS = [
    { label: t("status-all"), value: "all" },
    { label: t("status-scheduled"), value: "scheduled" },
    { label: t("status-in-progress"), value: "in_progress" },
    { label: t("status-completed"), value: "completed" },
    { label: t("status-cancelled"), value: "cancelled" },
  ] as const;
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="md:w-[220px]">
        <SelectValue placeholder={t("filter-by-status")} />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
