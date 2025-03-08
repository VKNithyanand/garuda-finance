
/**
 * Utility functions for formatting values in a consistent way
 */

/**
 * Format a number as currency
 */
export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  const currencyMap: Record<string, string> = {
    'usd': 'USD',
    'eur': 'EUR',
    'gbp': 'GBP',
    'jpy': 'JPY'
  };
  
  const currencyCode = currencyMap[currency.toLowerCase()] || 'USD';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format a percentage
 */
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Format a number with thousands separators
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Format a date in a consistent way
 */
export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
