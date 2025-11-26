import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface SearchBarProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const t = useTranslations();
  const defaultPlaceholder = placeholder || t("search-placeholder");
  return (
    <Input
      placeholder={defaultPlaceholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full md:w-[300px]"
    />
  );
}
