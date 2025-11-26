import { useState, useEffect } from "react";
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

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <Input
      placeholder={defaultPlaceholder}
      value={localValue}
      onChange={(e) => handleChange(e.target.value)}
      className="w-full md:w-[300px]"
    />
  );
}
