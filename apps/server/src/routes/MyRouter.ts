import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';

import { env } from '../utils/env.js';

import { errorResponse } from '@/utils/errors/errorResponse.js';
import { honoFactory } from './myHono.js';
import itemRouter from './items/item.routes.js';
import authRouter from '@/routes/auth/auth.routes.js';
import userRouter from '@/routes/user/user.routes.js';
// import adminRoutes from '@/routes/admin/admin.routes.js';
// import stripeRoutes from '@/routes/webhooks-stripe/stripe.routes.js';

const app = honoFactory();

const routers = [
  itemRouter,
  authRouter,
  userRouter,
  // adminRoutes,
  // stripeRoutes,
] as const satisfies (typeof app)[];

const startRouter = () => {
  const port = env.PORT;

  app.use(
    cors({
      origin: env.CORS_URL,
      credentials: true,
      maxAge: 600,
    }),
  );

  app.use(csrf({ origin: env.CORS_URL }));

  app.get('/', (c) => {
    return c.json({ version: 'v0.9' });
  });

  routers.forEach((router) => {
    app.route('/', router);
  });

  // router.use((err: any, req: any, res: any, _next: any) => {
  //   logger.error('General error route');
  //   errorResponse(res, err);
  // });

  // router.listen(port, () => {
  //   log.info(`Router started on http://localhost:${port}/`);
  // });

  app.onError((e, c) => errorResponse(c, e));

  // Not in docs for some reason, could it be bad?
  Bun.serve({
    port: port,
    fetch: app.fetch,
  });
};

export default startRouter;
