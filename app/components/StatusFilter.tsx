import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TreatmentStatus } from "@/lib/types";
import { useTranslations } from "next-intl";

interface StatusFilterProps {
  value: TreatmentStatus[] | "all" | undefined;
  onChange: (value: TreatmentStatus[] | "all") => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  const t = useTranslations();

  const STATUS_OPTIONS: { label: string; value: TreatmentStatus }[] = [
    { label: t("status-scheduled"), value: "scheduled" },
    { label: t("status-in-progress"), value: "in_progress" },
    { label: t("status-completed"), value: "completed" },
    { label: t("status-cancelled"), value: "cancelled" },
  ];

  const selectedStatuses = value === "all" || !value ? [] : value;
  const isAllSelected = value === "all" || selectedStatuses.length === 0;

  const getDisplayText = () => {
    if (isAllSelected) {
      return t("status-all");
    }
    if (selectedStatuses.length === 1) {
      const option = STATUS_OPTIONS.find((opt) => opt.value === selectedStatuses[0]);
      return option?.label || t("status-all");
    }
    return `${selectedStatuses.length} selected`;
  };

  const handleStatusToggle = (status: TreatmentStatus) => {
    if (value === "all" || !value || value.length === 0) {
      onChange([status]);
      return;
    }

    if (selectedStatuses.includes(status)) {
      const newStatuses = selectedStatuses.filter((s) => s !== status);
      onChange(newStatuses.length === 0 ? "all" : newStatuses);
    } else {
      onChange([...selectedStatuses, status]);
    }
  };

  const handleSelectAll = () => {
    onChange("all");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="md:w-[220px] justify-start">
          {getDisplayText()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t("filter-by-status")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={isAllSelected} onCheckedChange={handleSelectAll}>
          {t("status-all")}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {STATUS_OPTIONS.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedStatuses.includes(option.value)}
            onCheckedChange={() => handleStatusToggle(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
