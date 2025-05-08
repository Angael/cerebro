import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';

import { env } from '../utils/env.js';

import adminRoutes from '@/routes/admin/admin.routes.js';
import authRouter from '@/routes/auth/auth.routes.js';
import serverStatsRoutes from '@/routes/server-stats/server-stats.routes.js';
import userRouter from '@/routes/user/user.routes.js';
import stripeRoutes from '@/routes/webhooks-stripe/stripe.routes.js';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import goalsRoutes from './goals/goals.routes.js';
import { honoFactory } from './honoFactory.js';
import itemRouter from './items/item.routes.js';
import { statsMiddleware } from './server-stats/server-stats.logic.js';

export const app = honoFactory()
  .use('*', statsMiddleware) // Apply to all routes
  .use(csrf({ origin: env.CORS_URL }))
  .use(cors({ origin: env.CORS_URL, credentials: true, maxAge: 600 }))
  .get('/', (c) => c.json({ version: 'v0.9' }))
  .route('/', itemRouter)
  .route('/', authRouter)
  .route('/', userRouter)
  .route('/', adminRoutes)
  .route('/', stripeRoutes)
  .route('/', goalsRoutes)
  .route('/', serverStatsRoutes)
  .onError((e, c) => errorResponse(c, e));
