import { requireSession } from '@/middleware/requireSession.js';
import {
  createStory,
  editStory,
  editStoryJson,
  getStoriesSummaries,
  getStory,
} from '@/routes/story/story.service.js';
import logger from '@/utils/log.js';
import { storyJsonZod } from '@cerebro/db';
import { GetStories_Endpoint, GetStory_Endpoint } from '@cerebro/shared';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import z from 'zod';
import { honoFactory } from '../honoFactory';

const storyRouter = honoFactory()
  .get('/story/list-stories', async (c) => {
    const stories = await getStoriesSummaries();

    const mockResponse: GetStories_Endpoint = {
      count: stories.length,
      stories: stories,
    };

    return c.json(mockResponse satisfies GetStories_Endpoint);
  })
  .get('/story/get/:id', zValidator('param', z.object({ id: z.string() })), async (c) => {
    const id = c.req.valid('param').id;
    try {
      const story = await getStory(id);

      return c.json({ story } satisfies GetStory_Endpoint);
    } catch (e) {
      logger.error(`Failed to get story %s`, id);
      throw e;
    }
  })
  .post(
    '/story/create',
    zValidator('json', z.object({ title: z.string(), description: z.string() })),
    async (c) => {
      const { user } = await requireSession(c);
      const { title, description } = c.req.valid('json');

      try {
        const id = await createStory(user.id, title, description);

        return c.json({ id });
      } catch (e) {
        logger.error('Failed to create story');
        throw e;
      }
    },
  )
  .post(
    '/story/edit/:storyId',
    zValidator('param', z.object({ storyId: z.string() })),
    zValidator(
      'json',
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
    async (c) => {
      const { user } = await requireSession(c);
      const storyId = c.req.valid('param').storyId;
      const payload = c.req.valid('json');

      try {
        const { user_id } = await getStory(storyId);

        if (user_id !== user.id) {
          throw new HTTPException(403, { message: 'You are not the owner of this story' });
        }

        await editStory(storyId, payload);

        return c.json(null, 204);
      } catch (e) {
        logger.error(`Failed to change story %s`, storyId);
        throw e;
      }
    },
  )
  .post(
    '/story/edit-json/:storyId',
    zValidator('param', z.object({ storyId: z.string() })),
    async (c) => {
      const { user } = await requireSession(c);
      const storyId = c.req.valid('param').storyId;

      try {
        const { user_id } = await getStory(storyId);

        if (user_id !== user.id) {
          throw new HTTPException(403, { message: 'You are not the owner of this story' });
        }

        const storyJson = storyJsonZod.parse((await c.req.json()).storyJson);
        logger.verbose('Parsed storyJson');

        // TODO: validate starting point exists in chapters etc

        await editStoryJson(storyId, storyJson);

        return c.json(null, 204);
      } catch (e) {
        logger.error('Failed to change story %s', storyId);
        throw e;
      }
    },
  );

export default storyRouter;
