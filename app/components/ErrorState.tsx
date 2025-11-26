import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ErrorStateProps } from "@/lib/component.types";
import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/errors";

export function ErrorState({
  error,
  onRetry,
  className = "",
}: ErrorStateProps) {
  const t = useTranslations();

  const getErrorMessage = () => {
    if (!error) {
      return t("error-description");
    }

    if (error instanceof ApiError) {
      if (error.errorType === "network") {
        return t("error-network");
      }

      if (error.statusCode) {
        switch (error.statusCode) {
          case 404:
            return t("error-not-found");
          case 400:
            return t("error-bad-request");
          case 500:
          case 502:
          case 503:
          case 504:
            return t("error-server");
          default:
            if (error.statusCode >= 500) {
              return t("error-server");
            }
            if (error.statusCode >= 400) {
              return t("error-bad-request");
            }
        }
      }

      if (error.errorType === "server") {
        return t("error-server");
      }
    }

    return error.message || t("error-description");
  };

  const title = t("error-title");
  const description = getErrorMessage();

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md border border-destructive/20 bg-destructive/5 p-8 text-center ${className}`}
      role="alert"
      aria-live="assertive"
      aria-label={title}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <AlertCircle className="mb-4 h-10 w-10 text-destructive" aria-hidden="true" />
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>
        {onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            className="gap-2"
            aria-label={t("try-again")}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {t("try-again")}
          </Button>
        )}
      </div>
    </div>
  );
}
