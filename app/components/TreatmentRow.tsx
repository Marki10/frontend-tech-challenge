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

interface TreatmentRowProps {
  treatment: Treatment;
  onUpdateStatus?: (id: number, status: TreatmentStatus) => void;
}

export function TreatmentRow({ treatment, onUpdateStatus }: TreatmentRowProps) {
  const status = (treatment.status || "scheduled") as TreatmentStatus;
  const statusConfig = TREATMENT_STATUS_CONFIG[status];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{treatment.patient}</CardTitle>
        <CardDescription>{treatment.procedure}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-xs text-muted-foreground">Dentist</div>
          <div className="text-sm font-medium">{treatment.dentist}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Date</div>
          <div className="text-sm font-medium">{treatment.date}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Status</div>
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
      <CardFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Update status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={treatment.status === "scheduled"}
              onCheckedChange={() =>
                onUpdateStatus?.(treatment.id, "scheduled")
              }
            >
              Scheduled
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={treatment.status === "in_progress"}
              onCheckedChange={() =>
                onUpdateStatus?.(treatment.id, "in_progress")
              }
            >
              In Progress
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={treatment.status === "completed"}
              onCheckedChange={() =>
                onUpdateStatus?.(treatment.id, "completed")
              }
            >
              Completed
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
