import express from 'express';
import { errorResponse } from '@/utils/errors/errorResponse.js';

const stripeRoutes = express.Router({ mergeParams: true });

stripeRoutes.get('/webhooks/stripe', async (req, res) => {
  try {
    // Validate webhook secret
    // Log webhook happened?
    // Save info in db
  } catch (e) {
    errorResponse(res, e);
  }
});

export default stripeRoutes;
