import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "@/hooks/useDebounce";

interface SearchBarProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({ value, onChange, placeholder, debounceMs = 300 }: SearchBarProps) {
  const t = useTranslations();
  const defaultPlaceholder = placeholder || t("search-placeholder");
  const [localValue, setLocalValue] = useState<string>(value || "");
  const debouncedOnChange = useDebouncedCallback(onChange, debounceMs);

  const displayValue = value !== undefined ? value : localValue;

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <>
      <Input
        type="search"
        placeholder={defaultPlaceholder}
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full md:w-[300px]"
        aria-label={t("aria-search-label")}
        aria-describedby="search-description"
      />
      <span id="search-description" className="sr-only">
        {t("aria-search-description")}
      </span>
    </>
  );
}
