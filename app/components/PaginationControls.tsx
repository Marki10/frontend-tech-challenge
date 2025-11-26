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
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-muted-foreground">
        {t("page-x-of-y", { currentPage, totalPages })}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={disabled || currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">{t("first-page")}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={disabled || currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">{t("previous-page")}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">{t("next-page")}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={disabled || currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">{t("last-page")}</span>
        </Button>
      </div>
    </div>
  );
}
