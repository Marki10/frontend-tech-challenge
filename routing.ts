import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { localeCodes, defaultLocale } from "@/lib/locale-config";

export const routing = defineRouting({
  locales: localeCodes,
  defaultLocale,
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
