import {RATES, CurrencyCode } from "./rates";

export function convert(from: CurrencyCode, to: CurrencyCode, amount: number) {
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