import { convert } from '../src/convert';

describe('convert', () => {
  test('converts CAD to USD (the example from the assignment)', () => {
    expect(convert('CAD', 'USD', 100)).toEqual({
      from: 'CAD',
      to: 'USD',
      originalAmount: 100,
      convertedAmount: 72,
      exchangeRate: 0.72,
    });
  });
  test('converts USD back to CAD', () => {
    expect(convert('USD', 'CAD', 72).convertedAmount).toBe(100);
  });
  test('converts between two non-CAD currencies (USD to EUR)', () => {
    expect(convert('USD', 'EUR', 100).convertedAmount).toBeCloseTo(91.67, 2);
  });
  test('returns the same amount when both currencies are the same', () => {
    const result = convert('EUR', 'EUR', 25.5);

    expect(result.convertedAmount).toBe(25.5);
    expect(result.exchangeRate).toBe(1);
  });

  test('returns an exact amount with no floating point error', () => {
    const result = convert('CAD', 'GBP', 100);

    expect(result.convertedAmount).toBe(57);
  });

  test('USD to JPY check convertedAmount for decimal values', () => {
    const result = convert('USD', 'JPY', 1);

    expect(result.convertedAmount).toBe(152)
  });

  test('USD to CAD for exchange rate', () => {
    const result = convert('USD', 'CAD', 100);

    expect(result.exchangeRate).toBe(1.388889);
  });

  test('CAD to GBP rounding check', () => {
    const result = convert('CAD', 'GBP', 0.50);

    expect(result.convertedAmount).toBe(0.29);
  });
});