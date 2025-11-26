export interface Language {
  code: string;
  name: string;
  countryCode: string;
}

export const languages: Language[] = [
  { code: "en", name: "English", countryCode: "US" },
  { code: "fr", name: "Français", countryCode: "FR" },
  { code: "de", name: "Deutsch", countryCode: "DE" },
];

export const localeCodes = languages.map((lang) => lang.code);

export const defaultLocale = "en";

