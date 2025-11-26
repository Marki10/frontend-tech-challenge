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
import type { Treatment, TreatmentStatus } from "@/lib/types";
import { TREATMENT_STATUS_CONFIG } from "@/lib/treatmentStatusConfig";
import { useTranslations } from "next-intl";

interface TreatmentRowProps {
  treatment: Treatment;
  onUpdateStatus?: (id: number, status: TreatmentStatus) => void;
}

export function TreatmentRow({ treatment, onUpdateStatus }: TreatmentRowProps) {
  const t = useTranslations();
  const status = (treatment.status || "scheduled") as TreatmentStatus;
  const statusConfig = TREATMENT_STATUS_CONFIG[status];

  return (
    <Card className="gap-3 py-3 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{treatment.patient}</CardTitle>
        <CardDescription className="text-xs">{treatment.procedure}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div>
          <div className="text-xs text-muted-foreground">
            {t("form-dentist")}
          </div>
          <div className="text-sm font-medium">{treatment.dentist}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{t("form-date")}</div>
          <div className="text-sm font-medium">{treatment.date}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">
            {t("status-label")}
          </div>
          <Badge className={`mt-1 ${statusConfig.className}`}>
            {statusConfig.label}
          </Badge>
        </div>
        {treatment.notes ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {treatment.notes}
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="pt-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {t("update-status")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>{t("filter-by-status")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={treatment.status === "scheduled"}
              onCheckedChange={() =>
                onUpdateStatus?.(treatment.id, "scheduled")
              }
            >
              {t("status-scheduled")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={treatment.status === "in_progress"}
              onCheckedChange={() =>
                onUpdateStatus?.(treatment.id, "in_progress")
              }
            >
              {t("status-in-progress")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={treatment.status === "completed"}
              onCheckedChange={() =>
                onUpdateStatus?.(treatment.id, "completed")
              }
            >
              {t("status-completed")}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
