import './loadEnv.js';
import './serverHooks.js';
import startRouter from './routes/MyRouter.js';
import mediaProcessor from './auto-services/media-processor/mediaProcessor.js';

import './prepare.js';
import videoCompressor from './auto-services/video-compressor/videoCompressor.js';
import { stripeSetup } from '@/setup/stripeSetup.js';

await stripeSetup();
mediaProcessor.start();
videoCompressor.start();
startRouter();
