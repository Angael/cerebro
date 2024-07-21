import { StoryJson } from '@cerebro/shared';

export const useStoryStats = (storyJson: StoryJson | null) => {
  if (!storyJson) {
    return null;
  }

  let dialogs = 0;
  let choices = 0;
  let scenes = 0;
  let chapters = 0;

  storyJson.chapters.forEach((chapter) => {
    chapters++;
    chapter.scenes.forEach((scene) => {
      scenes++;
      scene.dialogs.forEach((dialog) => {
        dialogs++;
        choices += dialog.choices.length;
      });
    });
  });

  return {
    dialogs,
    choices,
    scenes,
    chapters,
  };
};
