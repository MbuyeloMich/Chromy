import type { Currency } from './types';

const FX_FROM_USD: Record<Currency, number> = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
};

const SYMBOL: Record<Currency, string> = {
  USD: '$',
  GBP: '£',
  EUR: '€',
};

let currentCurrency: Currency = 'USD';

export function setCurrencyFormat(currency: Currency) {
  currentCurrency = currency;
}

export function getCurrencyFormat(): Currency {
  return currentCurrency;
}

function toActiveCurrency(n: number): number {
  return n * FX_FROM_USD[currentCurrency];
}

function symbol(): string {
  return SYMBOL[currentCurrency];
}

// Format number as currency (active selection)
export function fmt(n: number): string {
  if (!n || isNaN(n)) return `${symbol()}0.00`;
  const v = toActiveCurrency(n);
  if (v >= 1e12) return `${symbol()}${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `${symbol()}${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${symbol()}${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `${symbol()}${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  if (v >= 1) return `${symbol()}${v.toFixed(2)}`;
  if (v >= 0.01) return `${symbol()}${v.toFixed(4)}`;
  return `${symbol()}${v.toFixed(6)}`;
}

// Compact currency number in active currency
export function compactCurrency(n: number): string {
  if (!n || isNaN(n)) return `${symbol()}0`;
  const v = toActiveCurrency(n);
  if (v >= 1e12) return `${symbol()}${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `${symbol()}${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${symbol()}${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `${symbol()}${(v / 1e3).toFixed(2)}K`;
  return `${symbol()}${v.toFixed(2)}`;
}

// Full currency number in active currency (no T/B/M/K shortening)
export function fullCurrency(n: number): string {
  if (!n || isNaN(n)) return `${symbol()}0`;
  const v = toActiveCurrency(n);
  if (v >= 1) return `${symbol()}${v.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  if (v >= 0.01) return `${symbol()}${v.toFixed(4)}`;
  return `${symbol()}${v.toFixed(6)}`;
}

// Format percentage with sign
export function pct(n: number): string {
  if (!n || isNaN(n)) return '0.00%';
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}

// Compact number (no currency prefix)
export function compactNum(n: number): string {
  if (!n || isNaN(n)) return '0';
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return n.toFixed(2);
}

// Get sort value from coin by field name
export function getSortValue(coin: { current_price: number; price_change_percentage_24h: number; total_volume: number; market_cap: number }, field: string): number {
  switch (field) {
    case 'price': return coin.current_price;
    case 'change_24h': return coin.price_change_percentage_24h;
    case 'volume': return coin.total_volume;
    default: return coin.market_cap;
  }
}
