import express, { Router } from 'express';
import { GetStories_Endpoint, GetStory_Endpoint } from '@cerebro/shared';
import logger from '@/utils/log.js';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import z from 'zod';
import {
  createStory,
  editStory,
  editStoryJson,
  getStoriesSummaries,
  getStory,
} from '@/routes/story/story.service.js';
import { requireSession } from '@/middleware/requireSession.js';
import { HttpError } from '@/utils/errors/HttpError.js';
import { storyJsonZod } from '@cerebro/db';

const storyRouter = express.Router({ mergeParams: true });
storyRouter.use('/story', express.json());

storyRouter.get('/story/list-stories', async (req, res) => {
  const stories = await getStoriesSummaries();

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
    const story = await getStory(id);

    res.json({ story } satisfies GetStory_Endpoint);
  } catch (e) {
    logger.error(`Failed to get story ${req?.params?.id}`);
    errorResponse(res, e);
  }
});

//new story post
const createStoryZod = z.object({
  title: z.string(),
  description: z.string(),
});
storyRouter.post('/story/create', async (req, res) => {
  const { user } = await requireSession(req);

  try {
    const { title, description } = createStoryZod.parse(req.body);

    const id = await createStory(user.id, title, description);

    res.json({ id });
  } catch (e) {
    logger.error('Failed to create story');
    errorResponse(res, e);
  }
});

const editStoryPayload = z.object({
  title: z.string(),
  description: z.string(),
});
storyRouter.post('/story/edit/:storyId', async (req, res) => {
  const { user } = await requireSession(req);

  try {
    const storyId = idZod.parse(req?.params?.storyId);
    const payload = editStoryPayload.parse(req.body);
    const { user_id } = await getStory(storyId);

    if (user_id !== user.id) {
      throw new HttpError(403, 'You are not the owner of this story');
    }

    await editStory(storyId, payload);

    res.sendStatus(204);
  } catch (e) {
    logger.error(`Failed to change story ${req?.params?.storyId}`);
    errorResponse(res, e);
  }
});

storyRouter.post('/story/edit-json/:storyId', async (req, res) => {
  const { user } = await requireSession(req);

  try {
    const storyId = idZod.parse(req?.params?.storyId);
    const { user_id } = await getStory(storyId);

    if (user_id !== user.id) {
      throw new HttpError(403, 'You are not the owner of this story');
    }

    const storyJson = storyJsonZod.parse(req.body.storyJson);

    await editStoryJson(storyId, storyJson);

    res.sendStatus(204);
  } catch (e) {
    logger.error(`Failed to change story ${req?.params?.storyId}`);
    errorResponse(res, e);
  }
});

export default storyRouter satisfies Router;
