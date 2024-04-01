import express from 'express';
import cors from 'cors';
import log from '../utils/log.js';

import itemRouter from './items/itemRouter.js';
import limitsRouter from './limits/limitsRouter.js';
import tagsRouter from './tags/tagsRouter.js';
import { MyRoute } from './express-helpers/routeType.js';
import localFsRouter from './local-fs/localFsRouter.js';
import { env } from '../utils/env.js';
import webhooksRouter from './clerk-web-hooks/index.js';
import invariant from 'tiny-invariant';

const routes3: MyRoute[] = [
  itemRouter,
  limitsRouter,
  tagsRouter,
  webhooksRouter,
  !env.isProd && localFsRouter,
].filter((router): router is MyRoute => !!router);

const startRouter = () => {
  const router = express();
  const port = env.PORT;

  router.use(express.json());

  if (env.isProd) {
    router.use(
      cors({
        origin: env.CORS_URL,
        credentials: true,
        maxAge: 600,
      }),
    );
  } else {
    router.use(cors());
  }

  // TODO Auth middleware
  invariant(false, 'Auth middleware not implemented');

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
