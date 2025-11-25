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
import { Textarea } from "@/components/ui/textarea";

interface AddTreatmentDialogProps {
  children: React.ReactNode;
  onSubmit: (data: {
    patient: string;
    procedure: string;
    dentist: string;
    date: string;
    notes: string;
  }) => void;
}

export function AddTreatmentDialog({
  children,
  onSubmit,
}: AddTreatmentDialogProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      patient: formData.get("patient") as string,
      procedure: formData.get("procedure") as string,
      dentist: formData.get("dentist") as string,
      date: formData.get("date") as string,
      notes: formData.get("notes") as string,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add treatment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patient">Patient</Label>
              <Input
                id="patient"
                name="patient"
                placeholder="Jane Doe"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="procedure">Procedure</Label>
              <Input
                id="procedure"
                name="procedure"
                placeholder="Filling"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dentist">Dentist</Label>
              <Input
                id="dentist"
                name="dentist"
                placeholder="Dr. Smith"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any treatment notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save treatment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
