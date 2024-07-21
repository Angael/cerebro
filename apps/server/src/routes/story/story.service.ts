import { db, StoryJson } from '@cerebro/db';
import logger from '@/utils/log.js';
import { nanoid } from 'nanoid';
import { PostEditStory_EndpointPayload } from '@cerebro/shared';

export const getStoriesSummaries = () =>
  db.selectFrom('story').select(['id', 'title', 'description']).execute();

export const createStory = async (user_id: string, title: string, description: string) => {
  logger.info(`Creating story ${title}`);

  const id = nanoid();
  await db.insertInto('story').values({ id, user_id, title, description }).execute();

  return id;
};

export const getStory = (storyId: string) => {
  logger.info(`Getting story ${storyId}`);

  return db.selectFrom('story').selectAll().where('id', '=', storyId).executeTakeFirstOrThrow();
};

export const editStory = (storyId: string, payload: PostEditStory_EndpointPayload) => {
  logger.info(`Changing story ${storyId}`);

  return db
    .updateTable('story')
    .set('title', payload.title)
    .set('description', payload.description)
    .where('id', '=', storyId)
    .execute();
};

export const editStoryJson = (storyId: string, storyJson: StoryJson) => {
  logger.info(`Changing storyJson ${storyId}`);

  return db.updateTable('story').set('story_json', storyJson).where('id', '=', storyId).execute();
};
