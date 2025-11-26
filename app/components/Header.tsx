import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations();

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("dentaldesk")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("treatments-subtitle")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
