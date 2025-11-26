import { NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { localeCodes, defaultLocale } from "@/lib/locale-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return localeCodes.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = localeCodes.includes(locale) ? locale : defaultLocale;

  let messages;
  try {
    messages = (await import(`../../messages/${validLocale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${validLocale}`, error);
    notFound();
  }

  return (
    <html lang={validLocale} className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased px-4 sm:px-6 md:px-0`}
      >
        <NextIntlClientProvider locale={validLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
