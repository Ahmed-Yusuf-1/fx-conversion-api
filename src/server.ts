import { app } from './app';

// Uses the PORT environment variable when it is set, otherwise 3000.
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`FX conversion API is running on http://localhost:${PORT}`);
});
