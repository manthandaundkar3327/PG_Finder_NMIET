import React from 'react';

export const BRAND_ICON_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 48 48%27%3E%3Cpath d=%27M5.5 23.5 24 7l18.5 16.5%27 fill=%27none%27 stroke=%27%237c3aed%27 stroke-width=%273.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3Cpath d=%27M10 21v17.5A3.5 3.5 0 0 0 13.5 42h21a3.5 3.5 0 0 0 3.5-3.5V21M19 42V29h10v13%27 fill=%27none%27 stroke=%27%237c3aed%27 stroke-width=%273.5%27/%3E%3C/svg%3E";

interface BrandIconProps {
  className?: string;
}

export const BrandIcon: React.FC<BrandIconProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="PG Finder Brand Icon"
    >
      <path
        d="M5.5 23.5 24 7l18.5 16.5"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 21v17.5A3.5 3.5 0 0 0 13.5 42h21a3.5 3.5 0 0 0 3.5-3.5V21M19 42V29h10v13"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="3.5"
      />
    </svg>
  );
};
