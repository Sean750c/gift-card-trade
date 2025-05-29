import { useContext } from 'react';
import { CountryContext } from '@/contexts/CountryContext';

export const useCountry = () => {
  return useContext(CountryContext);
};