"use client";

import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";
import { languages, localeCodes } from "@/lib/locale-config";
import { CountryFlag } from "./CountryFlag";

export function LanguageSwitcher() {
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    if (typeof window === "undefined") return;
    
    const url = new URL(window.location.href);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    
    const cleanSegments = pathSegments.filter(segment => !localeCodes.includes(segment));
    const pathWithoutLocale = cleanSegments.length === 0 ? "/" : "/" + cleanSegments.join("/");
    const newPath = `/${newLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
    
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = `${newPath}${url.search}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => switchLanguage(language.code)}
            className={language.code === locale ? "bg-accent" : ""}
          >
            <CountryFlag countryCode={language.countryCode} className="mr-2" />
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
