import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  disabled?: boolean;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  disabled = false,
}: PaginationControlsProps) {
  const t = useTranslations();

  if (totalPages <= 1) return null;

  return (
    <nav
      className={`flex items-center justify-between ${className}`}
      role="navigation"
      aria-label={t("aria-pagination", { current: currentPage, total: totalPages })}
    >
      <div className="text-sm text-muted-foreground" role="status" aria-live="polite">
        {t("page-x-of-y", { currentPage, totalPages })}
      </div>
      <div className="flex items-center space-x-2" role="group" aria-label={t("aria-pagination", { current: currentPage, total: totalPages })}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={disabled || currentPage === 1}
          aria-label={t("first-page")}
        >
          <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{t("first-page")}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={disabled || currentPage === 1}
          aria-label={t("previous-page")}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{t("previous-page")}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
          aria-label={t("next-page")}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{t("next-page")}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={disabled || currentPage === totalPages}
          aria-label={t("last-page")}
        >
          <ChevronsRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">{t("last-page")}</span>
        </Button>
      </div>
    </nav>
  );
}
