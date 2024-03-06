import express from 'express';
import cors from 'cors';
import log from '../utils/log.js';

import itemRouter from './items/itemRouter.js';
import limitsRouter from './limits/limitsRouter.js';
import tagsRouter from './tags/tagsRouter.js';
import { MyRoute } from './express-helpers/routeType.js';
import localFsRouter from './local-fs/localFsRouter.js';
import { isProd } from '../utils/env.js';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import webhooksRouter from './clerk-web-hooks/index.js';

const routes3: MyRoute[] = [
  itemRouter,
  limitsRouter,
  tagsRouter,
  webhooksRouter,
  !isProd && localFsRouter,
].filter((router): router is MyRoute => !!router);

const startRouter = () => {
  const router = express();
  const port = Number(process.env.PORT ?? 3000);

  router.use(express.json());

  if (isProd) {
    router.use(
      cors({
        origin: process.env.CORS_URL,
        credentials: true,
        maxAge: 600,
      }),
    );
  } else {
    router.use(cors());
  }

  router.use(ClerkExpressWithAuth());
  router.get('/', (req, res) => {
    res.send('v0.8');
  });

  routes3.forEach((myRoute) => {
    router.use(myRoute.path, myRoute.router);
  });

  router.listen(port, () => {
    log.info(`Router started on http://localhost:${port}/`);
  });

  // on error
  router.on('error', (err) => {
    log.error(err);
  });
};

export default startRouter;
