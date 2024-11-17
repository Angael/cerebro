import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';

import { env } from '../utils/env.js';

import logger from '@/utils/log.js';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import { honoFactory } from './myHono.js';
import itemRouter from './items/item.routes.js';
import authRouter from '@/routes/auth/auth.routes.js';
import userRouter from '@/routes/user/user.routes.js';
import adminRoutes from '@/routes/admin/admin.routes.js';
// import stripeRoutes from '@/routes/webhooks-stripe/stripe.routes.js';

export const app = honoFactory()
  .use(csrf({ origin: env.CORS_URL }))
  .use(cors({ origin: env.CORS_URL, credentials: true, maxAge: 600 }))
  .get('/', (c) => c.json({ version: 'v0.9' }))
  .route('/', itemRouter)
  .route('/', authRouter)
  .route('/', userRouter)
  .route('/', adminRoutes)
  // .route('/', stripeRoutes)
  .onError((e, c) => errorResponse(c, e));
