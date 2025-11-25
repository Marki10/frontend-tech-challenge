import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">DentalDesk</h1>
        <p className="text-sm text-muted-foreground">
          Track dental treatments and their status.
        </p>
      </div>
      <ThemeToggle />
    </header>
  );
}
