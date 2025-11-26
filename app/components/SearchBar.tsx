"use client";

import { useState, useEffect, useRef } from "react";
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
  const externalValue = value || "";
  const [localValue, setLocalValue] = useState<string>("");
  const lastSentValueRef = useRef<string>("");
  const isMountedRef = useRef<boolean>(false);
  
  const debouncedOnChange = useDebouncedCallback((newValue: string) => {
    lastSentValueRef.current = newValue;
    onChange(newValue);
  }, debounceMs);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      if (externalValue) {
        setLocalValue(externalValue);
        lastSentValueRef.current = externalValue;
      }
      return;
    }
    
    if (externalValue !== lastSentValueRef.current && externalValue !== localValue) {
      lastSentValueRef.current = externalValue;
      setLocalValue(externalValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalValue]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <>
      <Input
        type="search"
        placeholder={defaultPlaceholder}
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full md:w-[300px]"
        aria-label={t("aria-search-label")}
        aria-describedby="search-description"
        suppressHydrationWarning
      />
      <span id="search-description" className="sr-only">
        {t("aria-search-description")}
      </span>
    </>
  );
}
