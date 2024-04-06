import express, { Router } from 'express';
import cors from 'cors';
import log from '../utils/log.js';

import itemRouter from './items/item.routes.js';
import userRouter from '@/routes/user/user.routes.js';
import localFsRouter from './local-fs/localFsRouter.js';
import { env } from '../utils/env.js';
import logger from '@/utils/log.js';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import authRouter from '@/routes/auth/auth.routes.js';

const routes3: Router[] = [itemRouter, authRouter, userRouter, !env.isProd && localFsRouter].filter(
  (router): router is Router => !!router,
);

const startRouter = () => {
  const router = express();
  const port = env.PORT;

  router.use(express.json());

  router.use(
    cors({
      origin: env.CORS_URL,
      credentials: true,
      maxAge: 600,
    }),
  );

  router.get('/', (req, res) => {
    res.send('v0.8');
  });

  routes3.forEach((nestedRouter) => {
    router.use(nestedRouter);
  });

  router.use((err: any, req: any, res: any, _next: any) => {
    logger.error('General error route');
    errorResponse(res, err);
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
