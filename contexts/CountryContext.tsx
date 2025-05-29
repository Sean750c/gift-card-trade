import React, { createContext, useState, useEffect } from 'react';
import { api, Country } from '@/services/api';

type CountryContextType = {
  countries: Country[];
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country) => void;
  loading: boolean;
  error: string | null;
  refreshCountries: () => Promise<void>;
};

export const CountryContext = createContext<CountryContextType>({
  countries: [],
  selectedCountry: null,
  setSelectedCountry: () => {},
  loading: false,
  error: null,
  refreshCountries: async () => {},
});

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const countryList = await api.getCountryList();
      
      if (countryList.length === 0) {
        setError('No countries available');
        return;
      }
      
      setCountries(countryList);
      
      // Only set selected country if none is selected yet
      if (!selectedCountry && countryList.length > 0) {
        setSelectedCountry(countryList[0]);
      }
    } catch (err) {
      setError('Failed to load countries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadCountries();
  }, []);

  return (
    <CountryContext.Provider
      value={{
        countries,
        selectedCountry,
        setSelectedCountry,
        loading,
        error,
        refreshCountries: loadCountries,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};