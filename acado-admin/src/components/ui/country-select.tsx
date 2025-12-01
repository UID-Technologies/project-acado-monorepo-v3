// src/components/ui/country-select.tsx
import * as React from 'react';
import { useCountries } from '@/hooks/useCountries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface CountrySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  required?: boolean;
  // Option to show flag emoji in the select
  showFlag?: boolean;
  // Filter: show all countries or only common ones
  filter?: 'all' | 'common';
}

/**
 * Reusable Country Select component
 * Fetches countries from REST Countries API
 */
export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onValueChange,
  placeholder = 'Select country',
  disabled = false,
  className,
  id,
  required = false,
  showFlag = true,
  filter = 'all',
}) => {
  const { countries, loading } = useCountries();

  // Common countries that are frequently used (can be customized)
  const commonCountryNames = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium',
    'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Japan', 'South Korea', 'China', 'India',
    'Singapore', 'Malaysia', 'Thailand', 'Brazil', 'Mexico', 'Argentina', 'South Africa', 'New Zealand', 'Ireland', 'Portugal',
  ];

  const displayCountries = filter === 'common'
    ? countries.filter(c => commonCountryNames.includes(c.name))
    : countries;

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger className={className} id={id}>
          <SelectValue>
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading countries...</span>
            </div>
          </SelectValue>
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      required={required}
    >
      <SelectTrigger className={className} id={id}>
        <SelectValue placeholder={placeholder}>
          {value && showFlag ? (
            (() => {
              // Try to find by name first, then by code (for backward compatibility)
              const country = countries.find(c => 
                c.name === value || c.code === value || c.name.toLowerCase() === value.toLowerCase()
              );
              return country?.flag ? `${country.flag} ${country.name}` : value;
            })()
          ) : (
            value || placeholder
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {displayCountries.map((country) => (
          <SelectItem key={country.code} value={country.name}>
            {showFlag && country.flag ? (
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </span>
            ) : (
              country.name
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

