import {RATES, CurrencyCode } from "./rates";
import {Decimal} from 'decimal.js';

export function convert(from: CurrencyCode, to: CurrencyCode, amount: number) {
  // Every rate is measured against CAD, so dividing one by the other cancels CAD out
  // and leaves the direct rate between the two currencies.
  const exchangeRate = new Decimal(RATES[to].rate).dividedBy(RATES[from].rate);

  // Round to the decimals of the currency being paid out, because that is the money
  // the customer actually receives.
  const convertedAmount = new Decimal(amount).times(exchangeRate).toDecimalPlaces(RATES[to].decimals);

  return {
    from: from,
    to: to,
    originalAmount: amount,
    convertedAmount: convertedAmount.toNumber(),
    exchangeRate: exchangeRate.toNumber()
  };
}