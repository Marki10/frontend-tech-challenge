interface EmptyStateProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  title = "No treatments found",
  description = "Try adjusting your search or filter to find what you're looking for.",
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-6 text-sm text-muted-foreground">{description}</p>
        {children}
      </div>
    </div>
  );
}
