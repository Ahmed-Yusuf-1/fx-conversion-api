# FX Conversion API

A small REST API that converts an amount of money from one currency to another, using a fixed table of exchange rates with CAD as the base currency.

Built with Node.js, TypeScript, Express and Jest.

## Run it

You need Node.js 20 or newer.

```bash
npm install
npm start
```

The server starts on `http://localhost:3000`. Set the `PORT` environment variable to use a different port.

## Run the tests

```bash
npm test
```

## Use the API

### `POST /convert`

Request:

```json
{
  "from": "CAD",
  "to": "USD",
  "amount": 100.00
}
```

Response, with status `200`:

```json
{
  "from": "CAD",
  "to": "USD",
  "originalAmount": 100,
  "convertedAmount": 72,
  "exchangeRate": 0.72
}
```

JSON numbers have no trailing zeros, so `72.00` is sent as `72`.

```bash
curl -X POST http://localhost:3000/convert -H "Content-Type: application/json" -d '{"from":"CAD","to":"USD","amount":100}'
```

Supported currencies: CAD, USD, EUR, GBP, AUD and JPY. Any of them can be converted to any other.

### Errors

Every error is a list of messages. If a request has several problems, they all come back at once.

```json
{
  "errors": [
    "Value for from is required",
    "amount must be greater than 0"
  ]
}
```

| Status | When |
|---|---|
| `400` | A field is missing, has the wrong type or has a value that is not allowed |
| `400` | The body is not valid JSON |
| `404` | Any address or method other than `POST /convert` |
| `500` | An unexpected error on the server |

- `from` and `to` are required and must be a supported currency. Lowercase, such as `"usd"`, is accepted.
- `amount` is required, must be a JSON number and must be greater than 0. A number in quotes, such as `"100"`, is rejected.

## Project layout

| File | Job |
|---|---|
| `src/rates.ts` | The currency table: each rate and its number of decimal places |
| `src/convert.ts` | The conversion calculation |
| `src/validation.ts` | Checks a request and returns a list of problems |
| `src/app.ts` | The Express route and the error responses |
| `src/server.ts` | Starts the app on a port |

Each source file has a matching test file in `tests/`, except `server.ts`.

## Decisions I made

- **Cross rates.** Every rate is measured against CAD, so the rate between two currencies is `rate(to) / rate(from)`.
- **A decimal library instead of plain numbers.** JavaScript cannot store values like 0.57 exactly. My test for 100 CAD to GBP first returned `56.99999999999999` instead of `57`. The calculation uses `decimal.js`, and I think the accuracy is worth one extra dependency.
- **Each currency has its own decimal places.** Yen has no cents, so 1 USD converts to 152 yen, not 152.08. The decimal places sit in the same table as the rate, so adding a currency is one line. The result is rounded to the decimals of the currency being paid out.
- **Half a cent rounds up.** 0.50 CAD is exactly 0.285 GBP, which becomes 0.29. A bank might use banker's rounding instead. In a real system the business would set that rule.
- **The exchange rate is shown to 6 decimal places.** The full rate is used for the calculation and rounded only for display.
- **Strict on types, lenient on capitals.** `"100"` in quotes is rejected, because quietly converting it would hide a mistake in the caller's code. `"usd"` is accepted, because the meaning is clear.
- **All problems are reported at once,** so the caller can fix everything in one go.

## What I left out

- **A maximum amount.** The right limit is a business decision, so I did not invent one.
- **Rejecting amounts with too many decimals.** `100.129` CAD is accepted and converted as it is. Only the result is rounded.

## AI disclosure

I used Claude Opus 5.5/Fable 5.2. How much I used it changed from part to part, and that was on purpose.

**Where I slowed down.** For the parts that matter most, Claude acted as a mentor: it explained ideas, laid out options and reviewed my work. I wrote the code and made the decisions for:

- the rates table and the conversion logic (`src/rates.ts`, `src/convert.ts`) and their tests
- the money decisions above: the decimal library, the rounding rules and the yen case
- the validation rules, and the first validation check and its test

**Where I scaled up.** For the routine parts, Claude wrote the code:

- the project setup (TypeScript and Jest configuration)
- the rest of the validation code and its tests
- the Express endpoint and its tests (`src/app.ts`, `src/server.ts`, `tests/app.test.ts`)
- the code comments and the first draft of this README

This is how I work with AI in general. I use more of it when speed is what the task needs, and I slow down and work by hand when I need to understand something properly or when it has to be exactly right.
