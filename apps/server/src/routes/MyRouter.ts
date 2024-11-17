import { Hono } from 'hono';
import { cors } from 'hono/cors';

import log from '../utils/log.js';

import { env } from '../utils/env.js';
import logger from '@/utils/log.js';
import { errorResponse } from '@/utils/errors/errorResponse.js';

// import itemRouter from './items/item.routes.js';
// import userRouter from '@/routes/user/user.routes.js';
// import authRouter from '@/routes/auth/auth.routes.js';
// import adminRoutes from '@/routes/admin/admin.routes.js';
// import stripeRoutes from '@/routes/webhooks-stripe/stripe.routes.js';

// const routes3: Router[] = [itemRouter, authRouter, userRouter, adminRoutes, stripeRoutes].filter(
//   (router): router is Router => !!router,
// );

const startRouter = () => {
  const app = new Hono();

  const port = env.PORT;

  app.use(
    cors({
      origin: env.CORS_URL,
      credentials: true,
      maxAge: 600,
    }),
  );

  app.get('/', (c) => {
    return c.json({ version: 'v0.9' });
  });

  // routes3.forEach((nestedRouter) => {
  //   router.use(nestedRouter);
  // });

  // router.use((err: any, req: any, res: any, _next: any) => {
  //   logger.error('General error route');
  //   errorResponse(res, err);
  // });

  // router.listen(port, () => {
  //   log.info(`Router started on http://localhost:${port}/`);
  // });

  // // on error
  // router.on('error', (err) => {
  //   log.error(err);
  // });

  // Not in docs for some reason, could it be bad?
  Bun.serve({
    port: port,
    fetch: app.fetch,
  });
};

export default startRouter;
