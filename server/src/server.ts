import 'dotenv/config';
import { createApp } from './app.js';

const PORT = Number(process.env.PORT || 3001);
createApp().listen(PORT, () => {
  console.log(`BFF on http://localhost:${PORT}`);
});
