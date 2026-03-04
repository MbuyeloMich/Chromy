const USD_TO_ZAR = 18.5;

function toZar(n: number): number {
  return n * USD_TO_ZAR;
}

// Format number as currency (ZAR)
export function fmt(n: number): string {
  if (!n || isNaN(n)) return 'R0.00';
  const v = toZar(n);
  if (v >= 1e12) return `R${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `R${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `R${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `R${v.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`;
  if (v >= 1) return `R${v.toFixed(2)}`;
  if (v >= 0.01) return `R${v.toFixed(4)}`;
  return `R${v.toFixed(6)}`;
}

// Compact currency number in ZAR
export function compactCurrency(n: number): string {
  if (!n || isNaN(n)) return 'R0';
  const v = toZar(n);
  if (v >= 1e12) return `R${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `R${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `R${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `R${(v / 1e3).toFixed(2)}K`;
  return `R${v.toFixed(2)}`;
}

// Full currency number in ZAR (no T/B/M/K shortening)
export function fullCurrency(n: number): string {
  if (!n || isNaN(n)) return 'R0';
  const v = toZar(n);
  if (v >= 1) return `R${v.toLocaleString('en-ZA', { maximumFractionDigits: 2 })}`;
  if (v >= 0.01) return `R${v.toFixed(4)}`;
  return `R${v.toFixed(6)}`;
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
