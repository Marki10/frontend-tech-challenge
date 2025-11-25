import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ErrorStateProps } from "@/lib/component.types";

export function ErrorState({
  error,
  onRetry,
  className = "",
}: ErrorStateProps) {
  const title = "Something went wrong";
  const description =
    error?.message ||
    "We couldn't load the treatments. Please try again later.";

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md border border-destructive/20 bg-destructive/5 p-8 text-center ${className}`}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-10 w-10 text-destructive" />
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
