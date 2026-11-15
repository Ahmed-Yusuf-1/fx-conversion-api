// Everything we know about each supported currency, with CAD as the base currency.
// rate:     how much of that currency 1 CAD buys, e.g. 1 CAD = 0.72 USD.
// decimals: how many decimal places the currency is paid in. Yen has no cents, so 0.
export const RATES = {
  CAD: {rate: 1.0, decimals: 2},
  USD: {rate: 0.72, decimals: 2},
  EUR: {rate: 0.66, decimals: 2},
  GBP: {rate: 0.57, decimals: 2},
  AUD: {rate: 1.09, decimals: 2},
  JPY: {rate: 109.5, decimals: 0},
};

// The allowed currency codes, taken from the keys of RATES so the two can never go out of sync.
export type CurrencyCode = keyof typeof RATES;