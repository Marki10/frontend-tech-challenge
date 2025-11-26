"use client";

interface CountryFlagProps {
  countryCode: string;
  className?: string;
}

export function CountryFlag({ countryCode, className }: CountryFlagProps) {
  return (
    <img
      src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
      alt={countryCode}
      className={className}
      width={20}
      height={15}
    />
  );
}
