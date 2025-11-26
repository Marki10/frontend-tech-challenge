"use client";

import Image from "next/image";

interface CountryFlagProps {
  countryCode: string;
  className?: string;
}

export function CountryFlag({ countryCode, className }: CountryFlagProps) {
  return (
    <Image
      src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
      alt={countryCode}
      className={className}
      width={20}
      height={15}
      unoptimized
    />
  );
}
