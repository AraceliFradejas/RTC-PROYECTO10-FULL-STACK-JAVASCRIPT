import 'dotenv/config';
import { assertAuthConfiguration } from './config/auth.js';
import { app } from './app.js';
import { connectDatabase } from './config/db.js';

assertAuthConfiguration();

const port = process.env.PORT || 3000;

if (process.env.VERCEL !== '1') connectDatabase()
  .then(() => {
    app.listen(port, () => console.log(`KelseTS Talks API en http://localhost:${port}`));
  })
  .catch((error) => {
    console.error(`No se pudo conectar con MongoDB: ${error.message}`);
    process.exit(1);
  });

export default app;
