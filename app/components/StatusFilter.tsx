import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TreatmentStatus } from "@/lib/types";

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
] as const;

interface StatusFilterProps {
  value: TreatmentStatus | "all" | undefined;
  onChange: (value: TreatmentStatus | "all") => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
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
  );
}
