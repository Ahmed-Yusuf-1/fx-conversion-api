import express, { NextFunction, Request, Response } from 'express';
import { convert } from './convert';
import { CurrencyCode } from './rates';
import { validator } from './validation';

// The app is created here without being started, so the tests can send requests
// to it directly. server.ts is the file that starts it on a port.
export const app = express();

// Turns the JSON text of a request into an object and puts it on req.body.
app.use(express.json());

app.post('/convert', (req: Request, res: Response) => {
  const problems = validator(req.body);

  // 400 means "the request was wrong". Every problem goes back in one list.
  if (problems.length > 0) {
    res.status(400).json({ errors: problems });
    return;
  }

  // The validator has confirmed both codes are supported. Lowercase is accepted,
  // so put them in capitals before looking them up.
  const from = req.body.from.toUpperCase() as CurrencyCode;
  const to = req.body.to.toUpperCase() as CurrencyCode;

  res.status(200).json(convert(from, to, req.body.amount));
});

// Reached only when no route above matched, so the address or the method is wrong.
app.use((req: Request, res: Response) => {
  res.status(404).json({ errors: [`Cannot ${req.method} ${req.path}. Use POST /convert`] });
});

// Express sends errors here. It recognises an error handler by its four parameters,
// so next has to stay in the list even though it is not used.
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  // express.json() raises a SyntaxError when the body is not valid JSON.
  if (err instanceof SyntaxError) {
    res.status(400).json({ errors: ['Request body is not valid JSON'] });
    return;
  }

  // Its other errors, such as a body that is too large, carry their own 4xx status.
  // Those are the caller's mistake too, so they must not be reported as a server error.
  if (err instanceof Error && 'status' in err && typeof err.status === 'number' && err.status < 500) {
    res.status(err.status).json({ errors: [err.message] });
    return;
  }

  res.status(500).json({ errors: ['Something went wrong on the server'] });
});
