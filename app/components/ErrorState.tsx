import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load the treatments. Please try again later.",
  children,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-destructive/20 bg-destructive/5 p-8 text-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-10 w-10 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>
        {children}
      </div>
    </div>
  );
}
