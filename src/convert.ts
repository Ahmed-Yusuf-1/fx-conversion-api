import {RATES, CurrencyCode } from "./rates";

export function convert(from: CurrencyCode, to: CurrencyCode, amount: number) {
  // Every rate is measured against CAD, so dividing one by the other cancels CAD out
  // and leaves the direct rate between the two currencies.
  const exchangeRate = RATES[to] / RATES[from];
  const convertedAmount = amount * exchangeRate;

  return {
    from: from,
    to: to,
    originalAmount: amount,
    convertedAmount: convertedAmount,
    exchangeRate: exchangeRate
  };
}