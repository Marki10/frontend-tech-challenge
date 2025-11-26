import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  const selectedOption = selectedStatuses.length === 1
    ? STATUS_OPTIONS.find((opt) => opt.value === selectedStatuses[0])
    : null;

  const ariaLabel = isAllSelected
    ? t("aria-status-filter-label")
    : selectedStatuses.length === 1 && selectedOption
      ? t("aria-status-selected", {
          status: selectedOption.label,
        })
      : t("aria-status-count", { count: selectedStatuses.length });

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="md:w-[220px] justify-start"
          aria-label={ariaLabel}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {getDisplayText()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" role="menu" aria-label={t("filter-by-status")}>
        <DropdownMenuLabel>{t("filter-by-status")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={isAllSelected}
          onCheckedChange={handleSelectAll}
          role="menuitemcheckbox"
        >
          {t("status-all")}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {STATUS_OPTIONS.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedStatuses.includes(option.value)}
            onCheckedChange={() => handleStatusToggle(option.value)}
            role="menuitemcheckbox"
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
