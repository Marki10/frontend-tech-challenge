import { getRequestConfig } from "next-intl/server";
import { localeCodes, defaultLocale } from "@/lib/locale-config";

export default getRequestConfig(async ({ locale }) => {
  const validLocale = localeCodes.includes(locale || "")
    ? (locale as string)
    : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
