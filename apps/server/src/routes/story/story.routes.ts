import express, { Router } from 'express';
import { GetStories_Endpoint, GetStory_Endpoint } from '@cerebro/shared';
import logger from '@/utils/log.js';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import z from 'zod';
import { db } from '@cerebro/db';

const storyRouter = express.Router({ mergeParams: true });
storyRouter.use('/story', express.json());

storyRouter.get('/story/list-stories', async (req, res) => {
  const stories = await db.selectFrom('story').select(['id', 'title', 'description']).execute();

  const mockResponse: GetStories_Endpoint = {
    count: stories.length,
    stories: stories,
  };

  res.json(mockResponse satisfies GetStories_Endpoint);
});

const idZod = z.string();
storyRouter.get('/story/get/:id', async (req, res) => {
  try {
    const id = idZod.parse(req?.params?.id);
    logger.info(`Getting story ${id}`);
    const story = await db
      .selectFrom('story')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    res.json({ story } satisfies GetStory_Endpoint);
  } catch (e) {
    logger.error(`Failed to get story ${req?.params?.id}`);
    errorResponse(res, e);
  }
});

export default storyRouter satisfies Router;
