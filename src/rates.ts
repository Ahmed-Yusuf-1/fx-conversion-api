// Exchange rates with CAD as the base currency.
// Each number is how much of that currency 1 CAD buys, e.g. 1 CAD = 0.72 USD.
export const RATES = {
  CAD: 1.0,
  USD: 0.72,
  EUR: 0.66,
  GBP: 0.57,
  AUD: 1.09,
  JPY: 109.5,
};

// The allowed currency codes, taken from the keys of RATES so the two can never go out of sync.
export type CurrencyCode = keyof typeof RATES;