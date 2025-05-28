import { useState, useEffect } from 'react';

export const useCurrencyFormat = () => {
  const [locale, setLocale] = useState('en-NG'); // Default to Nigerian English

  // Format currency based on locale
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return {
    formatCurrency,
    setLocale,
  };
};