import { RATES } from './rates';

// The currency codes we support, taken from the rates table so the two can never go out of sync.
const SUPPORTED = Object.keys(RATES);

// Checks a request before any conversion happens. Returns every problem found, so the
// caller can fix them all in one go. An empty list means the request is valid.
export function validator(request: unknown): string[] {
    // Anything that is not an object has no fields to check, so stop here.
    if (typeof request !== 'object' || request === null || Array.isArray(request)) {
        return ['Request body must be a JSON object with from, to and amount'];
    }

    const problems: string[] = [];

    // Tell TypeScript which fields we are going to look at. Each one may be missing,
    // and each one is still unknown until it has been checked.
    const check = request as {from?: unknown; to?: unknown; amount?: unknown};

    const fromProblem = checkCurrency('from', check.from);
    if (fromProblem !== undefined) {
        problems.push(fromProblem);
    }

    const toProblem = checkCurrency('to', check.to);
    if (toProblem !== undefined) {
        problems.push(toProblem);
    }

    // Order matters: present first, then the type, then the value.
    if (check.amount === undefined) {
        problems.push('Value for amount is required');
    } else if (typeof check.amount !== 'number' || !Number.isFinite(check.amount)) {
        // Strict on purpose: "100" in quotes is text, and converting it quietly would
        // hide a mistake in the caller's code.
        problems.push('amount must be a number, for example 100.50');
    } else if (check.amount <= 0) {
        problems.push('amount must be greater than 0');
    }

    return problems;
}

// from and to follow the same rules, so they share one check.
// Returns the problem as text, or undefined when the value is fine.
function checkCurrency(name: string, value: unknown): string | undefined {
    if (value === undefined) {
        return `Value for ${name} is required`;
    }

    if (typeof value !== 'string') {
        return `${name} must be text, for example "CAD"`;
    }

    // Lowercase is accepted, so compare in capitals.
    if (!SUPPORTED.includes(value.toUpperCase())) {
        return `${name} "${value}" is not a supported currency. Supported currencies: ${SUPPORTED.join(', ')}`;
    }

    return undefined;
}
