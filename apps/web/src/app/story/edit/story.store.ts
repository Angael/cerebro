import { create } from 'zustand';
import { StoryJson } from '@cerebro/shared';
import { nanoid } from 'nanoid';
import { immer } from 'zustand/middleware/immer';

interface IStoryStore {
  storyJson: StoryJson | null;

  setStory: (story: StoryJson) => void;
  addChapter: (chapterName: string) => string;
  addScene: (chapterId: string, sceneName: string) => string;
  addDialog: (chapterId: string, sceneId: string, dialogName: string) => string;
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

    addScene: (chapterId, sceneName) => {
      const newScene = {
        id: nanoid(),
        title: sceneName,
        dialogs: [],
      };

      set((state) => {
        const chapter = state.storyJson?.chapters.find((chapter) => chapter.id === chapterId);
        chapter?.scenes.push(newScene);
      });

      return newScene.id;
    },

    addDialog(chapterId, sceneId, dialogName) {
      const newDialog = {
        id: nanoid(),
        title: dialogName,
        content: '',
        choices: [],
      };

      set((state) => {
        const chapter = state.storyJson?.chapters.find((chapter) => chapter.id === chapterId);
        const scene = chapter?.scenes.find((scene) => scene.id === sceneId);
        scene?.dialogs.push(newDialog);
      });

      return newDialog.id;
    },
  })),
);
