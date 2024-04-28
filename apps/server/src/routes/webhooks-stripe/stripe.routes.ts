import express from 'express';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import { stripeVerifySignature } from '@/utils/stripeVerifySignature.js';

const stripeRoutes = express.Router({ mergeParams: true });

stripeRoutes.get('/webhooks/stripe', async (req, res) => {
  try {
    await stripeVerifySignature(req);
    res.sendStatus(200);
    // Validate webhook secret
    // Log webhook happened?
    // Save info in db
  } catch (e) {
    errorResponse(res, e);
  }
});

export default stripeRoutes;
