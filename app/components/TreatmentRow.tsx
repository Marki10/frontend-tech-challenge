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

const STATUS_CONFIG: Record<
  TreatmentStatus,
  { label: string; className: string }
> = {
  scheduled: {
    label: "Scheduled",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  },
  in_progress: {
    label: "In progress",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  },
  completed: {
    label: "Completed",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  },
};

interface TreatmentRowProps {
  treatment: Treatment;
  onUpdateStatus?: (id: number, status: TreatmentStatus) => void;
}

export function TreatmentRow({ treatment, onUpdateStatus }: TreatmentRowProps) {
  const status = (treatment.status || "scheduled") as TreatmentStatus;
  const statusConfig = STATUS_CONFIG[status];
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
