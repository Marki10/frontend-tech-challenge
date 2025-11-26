import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { Treatment, TreatmentStatus } from "@/lib/types";
import { TREATMENT_STATUS_CONFIG } from "@/lib/treatmentStatusConfig";
import { useTranslations } from "next-intl";

interface TreatmentRowProps {
  treatment: Treatment;
  onUpdateStatus?: (id: number, status: TreatmentStatus) => void;
}

export function TreatmentRow({ treatment, onUpdateStatus }: TreatmentRowProps) {
  const t = useTranslations();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const status = (treatment.status || "scheduled") as TreatmentStatus;
  const statusConfig = TREATMENT_STATUS_CONFIG[status];

  return (
    <Card
      className="gap-3 py-3 shadow-sm"
      role="article"
      aria-label={t("aria-treatment-card", { patient: treatment.patient })}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{treatment.patient}</CardTitle>
        <CardDescription className="text-xs">{treatment.procedure}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div className="text-sm">
          <span className="text-xs text-muted-foreground">{t("form-dentist")}: </span>
          <span className="font-medium">{treatment.dentist}</span>
        </div>
        <div className="text-sm">
          <span className="text-xs text-muted-foreground">{t("form-date")}: </span>
          <span className="font-medium">{treatment.date}</span>
        </div>
        <div className="text-sm">
          <span className="text-xs text-muted-foreground">{t("status-label")}: </span>
          <Badge
            className={`${statusConfig.className}`}
            aria-label={t("aria-status-current", { status: statusConfig.label })}
          >
            {statusConfig.label}
          </Badge>
        </div>
        {treatment.notes ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-muted-foreground truncate" title={treatment.notes}>
                {treatment.notes}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs whitespace-normal">{treatment.notes}</p>
            </TooltipContent>
          </Tooltip>
        ) : null}
      </CardContent>
      <CardFooter className="pt-3">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              aria-label={t("aria-update-status-label", { patient: treatment.patient })}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              {t("update-status")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" role="menu">
            <DropdownMenuLabel>{t("filter-by-status")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={treatment.status === "scheduled"}
              onCheckedChange={() =>
                onUpdateStatus?.(treatment.id, "scheduled")
              }
              role="menuitemcheckbox"
            >
              {t("status-scheduled")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={treatment.status === "in_progress"}
              onCheckedChange={() =>
                onUpdateStatus?.(treatment.id, "in_progress")
              }
              role="menuitemcheckbox"
            >
              {t("status-in-progress")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={treatment.status === "completed"}
              onCheckedChange={() =>
                onUpdateStatus?.(treatment.id, "completed")
              }
              role="menuitemcheckbox"
            >
              {t("status-completed")}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
