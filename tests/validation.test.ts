import {validator} from '../src/validation';

describe('validator', () => {
  test('request with no from field', () => {
    const request = { to: 'USD', amount:500};

    expect(validator(request)).toEqual(["Value for from is required"])
  });

  test('accepts a valid request', () => {
    const request = { from: 'CAD', to: 'USD', amount: 100 };

    expect(validator(request)).toEqual([]);
  });

  test('accepts currency codes in lowercase', () => {
    const request = { from: 'cad', to: 'usd', amount: 100 };

    expect(validator(request)).toEqual([]);
  });

  test('accepts an amount with more decimals than the currency has', () => {
    const request = { from: 'CAD', to: 'USD', amount: 100.129 };

    expect(validator(request)).toEqual([]);
  });

  test('request with no to field', () => {
    const request = { from: 'CAD', amount: 500 };

    expect(validator(request)).toEqual(['Value for to is required']);
  });

  test('request with no amount field', () => {
    const request = { from: 'CAD', to: 'USD' };

    expect(validator(request)).toEqual(['Value for amount is required']);
  });

  test('reports every problem at once', () => {
    const request = {};

    expect(validator(request)).toEqual([
      'Value for from is required',
      'Value for to is required',
      'Value for amount is required',
    ]);
  });

  test('rejects a currency that is not text', () => {
    const request = { from: 123, to: 'USD', amount: 100 };

    expect(validator(request)).toEqual(['from must be text, for example "CAD"']);
  });

  test('rejects a currency that is not supported, and lists the ones that are', () => {
    const request = { from: 'CAD', to: 'ABC', amount: 100 };

    expect(validator(request)).toEqual([
      'to "ABC" is not a supported currency. Supported currencies: CAD, USD, EUR, GBP, AUD, JPY',
    ]);
  });

  test('rejects an amount sent as text', () => {
    const request = { from: 'CAD', to: 'USD', amount: '100' };

    expect(validator(request)).toEqual(['amount must be a number, for example 100.50']);
  });

  test('rejects an amount of zero', () => {
    const request = { from: 'CAD', to: 'USD', amount: 0 };

    expect(validator(request)).toEqual(['amount must be greater than 0']);
  });

  test('rejects a negative amount', () => {
    const request = { from: 'CAD', to: 'USD', amount: -5 };

    expect(validator(request)).toEqual(['amount must be greater than 0']);
  });

  test('rejects a request that is not an object', () => {
    expect(validator(null)).toEqual(['Request body must be a JSON object with from, to and amount']);
    expect(validator('CAD to USD')).toEqual(['Request body must be a JSON object with from, to and amount']);
  });
});
