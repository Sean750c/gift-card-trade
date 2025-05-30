import React, { createContext, useState, useEffect } from 'react';
import { api, Country } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

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

const DEFAULT_COUNTRY: Country = {
  id: 1,
  name: "Nigeria",
  short_name: "NG",
  currency_name: "NGN",
  currency_symbol: "₦",
  national_flag: "🇳🇬",
  withdrawal_method: 1,
  money_detail: 1,
  image: "https://yhobject.obs.af-south-1.myhuaweicloud.com:443/yhadmin/306135f91648764433284.jpg?x-image-process=image/resize,m_lfit,h_90,w_90",
  area_number: "234",
  code: "",
  rebate_money: "0",
  rebate_money_register: "0"
};

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const countryList = await api.getCountryList();
      
      if (!Array.isArray(countryList) || countryList.length === 0) {
        setError('No countries available');
        setCountries([DEFAULT_COUNTRY]);
        if (!selectedCountry) {
          setSelectedCountry(DEFAULT_COUNTRY);
        }
        return;
      }
      
      setCountries(countryList);
      
      // If user is logged in, try to find their country
      if (user?.country) {
        const userCountry = countryList.find(c => c.id === user.country.id);
        if (userCountry) {
          setSelectedCountry(userCountry);
          return;
        }
      }
      
      // If no country is selected or user is not logged in, use Nigeria as default
      if (!selectedCountry) {
        const nigeria = countryList.find(c => c.short_name === 'NG') || DEFAULT_COUNTRY;
        setSelectedCountry(nigeria);
      }
    } catch (err) {
      setError('Failed to load countries');
      console.error(err);
      // Set default country if error occurs
      setCountries([DEFAULT_COUNTRY]);
      setSelectedCountry(DEFAULT_COUNTRY);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadCountries();
  }, [user]); // Reload when user changes

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