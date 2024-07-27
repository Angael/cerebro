import { z } from 'zod';

export const storyDialogChoiceZod = z.object({
  id: z.string(),
  text: z.string(),
  nextDialogId: z.string(),
});
export const storyDialogZod = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  choices: z.array(storyDialogChoiceZod),
  who: z.string().optional(),
  img: z.string().optional(),
});
export const sceneZod = z.object({
  id: z.string(),
  title: z.string(),
  dialogs: z.array(storyDialogZod),
});
export const chapterZod = z.object({
  id: z.string(),
  title: z.string(),
  scenes: z.array(sceneZod),
});
export const storyJsonZod = z.object({
  startingPoint: z
    .object({
      chapterId: z.string(),
      sceneId: z.string(),
      dialogId: z.string(),
    })
    .nullable(),
  chapters: z.array(chapterZod),
});
