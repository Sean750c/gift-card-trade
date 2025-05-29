import React, { createContext, useState, useEffect } from 'react';
import { api, Country } from '@/services/api';

type CountryContextType = {
  countries: Country[];
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country) => void;
  loading: boolean;
  error: string | null;
};

export const CountryContext = createContext<CountryContextType>({
  countries: [],
  selectedCountry: null,
  setSelectedCountry: () => {},
  loading: false,
  error: null,
});

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const countryList = await api.getCountryList();
      setCountries(countryList);
      if (countryList.length > 0) {
        setSelectedCountry(countryList[0]);
      }
    } catch (err) {
      setError('Failed to load countries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CountryContext.Provider
      value={{
        countries,
        selectedCountry,
        setSelectedCountry,
        loading,
        error,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};