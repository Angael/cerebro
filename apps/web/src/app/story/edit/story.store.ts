import { create } from 'zustand';
import { StoryJson } from '@cerebro/shared';
import { nanoid } from 'nanoid';
import { immer } from 'zustand/middleware/immer';

interface IStoryStore {
  storyJson: StoryJson | null;

  setStory: (story: StoryJson) => void;
  addChapter: (chapterName: string) => string;
  // addScene: (chapterId: string, sceneName: string) => void;
  // addDialog: (chapterId: string, sceneId: string, dialogName: string) => void;
}

export const useStoryStore = create(
  immer<IStoryStore>((set) => ({
    storyJson: null,

    setStory: (story) => set({ storyJson: story }),
    addChapter: (chapterName) => {
      const newChapter = {
        id: nanoid(),
        title: chapterName,
        scenes: [],
      };

      set((state) => {
        state.storyJson?.chapters.push(newChapter);
      });

      return newChapter.id;
    },
  })),
);
