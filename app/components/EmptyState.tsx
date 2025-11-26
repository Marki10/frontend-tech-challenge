import { useTranslations } from "next-intl";

interface EmptyStateProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  const t = useTranslations();

  const defaultTitle = title || t("empty-title");
  const defaultDescription = description || t("empty-description");
  return (
    <div
      className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center"
      role="status"
      aria-live="polite"
      aria-label={defaultTitle}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h3 className="mb-2 text-lg font-semibold">{defaultTitle}</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          {defaultDescription}
        </p>
        {children}
      </div>
    </div>
  );
}
