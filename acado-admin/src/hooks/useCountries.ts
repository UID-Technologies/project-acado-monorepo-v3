// src/hooks/useCountries.ts
import { useState, useEffect, useMemo } from 'react';
import { locationsApi } from '@/api/locations.api';

export interface Country {
  name: string;
  code: string;
  flag?: string;
}

const generateCode = (name: string) => {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug) {
    return name.toUpperCase();
  }
  return slug.toUpperCase();
};

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError(null);

        const list = await locationsApi.getCountries();
        if (!active) return;

        const mapped = list
          .filter(Boolean)
          .map((name) => ({
            name,
            code: generateCode(name),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(mapped);
      } catch (err) {
        if (!active) return;
        console.error('Failed to load countries from locations API', err);
        setError(err as Error);
        setCountries([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCountries();

    return () => {
      active = false;
    };
  }, []);

  const countriesByCode = useMemo(() => {
    return new Map(countries.map((country) => [country.code.toLowerCase(), country]));
  }, [countries]);

  const countriesByName = useMemo(() => {
    return new Map(countries.map((country) => [country.name.toLowerCase(), country]));
  }, [countries]);

  const getCountryByCode = (code: string): Country | undefined => {
    return countriesByCode.get(code.toLowerCase());
  };

  const getCountryByName = (name: string): Country | undefined => {
    return countriesByName.get(name.toLowerCase());
  };

  return {
    countries,
    loading,
    error,
    getCountryByCode,
    getCountryByName,
  };
};

