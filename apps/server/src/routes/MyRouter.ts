import { Hono } from 'hono';
import { cors } from 'hono/cors';

import log from '../utils/log.js';

import { env } from '../utils/env.js';
import logger from '@/utils/log.js';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import { HttpError } from '@/utils/errors/HttpError.js';
import { StatusCode } from 'hono/utils/http-status';
import { ZodError } from 'zod';

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

  app.onError((e, c) => {
    if (e instanceof HttpError) {
      logger.error('HttpError Error: %s', e.message);
      return c.json({ error: e.message }, e.status as StatusCode);
    } else if (e instanceof ZodError) {
      logger.error('Zod Error: %O', e.issues); // Should we log validation issues?
      // Changed to include error beside of issues
      return c.json({ error: e.message, issues: e.issues }, 400);
    } else {
      logger.error('Unknown Error: %s', e.message);
      // Changed to include json
      return c.json({ error: 'Internal server error' }, 500);
    }
  });

  // Not in docs for some reason, could it be bad?
  Bun.serve({
    port: port,
    fetch: app.fetch,
  });
};

export default startRouter;
