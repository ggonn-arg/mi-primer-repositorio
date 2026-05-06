import express from 'express';
import { configureRouter } from './infraestructura/router.js';

const app = express();
const PORT = 3000;

configureRouter(app);

app.listen(PORT, () => {
  console.log(Server is running on port ${PORT});
});