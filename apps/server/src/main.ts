import './serverHooks.js';
import { app } from './routes/honoApp.js';
import mediaProcessor from './auto-services/media-processor/mediaProcessor.js';

import './prepare.js';
import videoCompressor from './auto-services/video-compressor/videoCompressor.js';
import stripeSetup from './setup/stripeSetup';
import logger from './utils/log.js';
import { env } from './utils/env.js';

await stripeSetup();

mediaProcessor.start();
videoCompressor.start();

Bun.serve({ port: env.PORT, fetch: app.fetch });
logger.info(`Hono started on http://localhost:${env.PORT}/`);
