import 'dotenv/config';
import { app } from './app.js';
import { connectDatabase } from './config/db.js';

const port = process.env.PORT || 3000;

connectDatabase()
  .then(() => {
    if (process.env.VERCEL !== '1') app.listen(port, () => console.log(`KelseTS Talks API en http://localhost:${port}`));
  })
  .catch((error) => {
    console.error(`No se pudo conectar con MongoDB: ${error.message}`);
    process.exit(1);
  });

export default app;
