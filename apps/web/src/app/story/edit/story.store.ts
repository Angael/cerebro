import { create } from 'zustand';
import { Storyteller } from '@cerebro/shared';
import { nanoid } from 'nanoid';
import { immer } from 'zustand/middleware/immer';

interface IStoryStore {
  storyJson: Storyteller.StoryJson | null;

  setStory: (story: Storyteller.StoryJson) => void;
  addChapter: (chapterName: string) => string;
  addScene: (chapterId: string, sceneName: string) => string;
  addDialog: (chapterId: string, sceneId: string, dialogName: string) => string;

  setChapterName: (chapterId: string, chapterName: string) => void;
  setSceneName: (chapterId: string, sceneId: string, sceneName: string) => void;
  setDialogName: (chapterId: string, sceneId: string, dialogId: string, dialogName: string) => void;

  modifyDialog: (
    chapterId: string,
    sceneId: string,
    dialogId: string,
    dialog: Partial<Storyteller.StoryDialog>,
  ) => void;
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

    setChapterName(chapterId, chapterName) {
      set((state) => {
        const chapter = state.storyJson?.chapters.find((chapter) => chapter.id === chapterId);

        if (chapter) {
          chapter.title = chapterName;
        }
      });
    },

    setSceneName(chapterId, sceneId, sceneName) {
      set((state) => {
        const chapter = state.storyJson?.chapters.find((chapter) => chapter.id === chapterId);
        const scene = chapter?.scenes.find((scene) => scene.id === sceneId);

        if (scene) {
          scene.title = sceneName;
        }
      });
    },

    setDialogName(chapterId, sceneId, dialogId, dialogName) {
      set((state) => {
        const chapter = state.storyJson?.chapters.find((chapter) => chapter.id === chapterId);
        const scene = chapter?.scenes.find((scene) => scene.id === sceneId);
        const dialog = scene?.dialogs.find((dialog) => dialog.id === dialogId);

        if (dialog) {
          dialog.title = dialogName;
        }
      });
    },

    modifyDialog(chapterId, sceneId, dialogId, newDialogPartial: Partial<Storyteller.StoryDialog>) {
      set((state) => {
        const chapter = state.storyJson?.chapters.find((chapter) => chapter.id === chapterId);
        const scene = chapter?.scenes.find((scene) => scene.id === sceneId);
        const dialog = scene?.dialogs.find((dialog) => dialog.id === dialogId);

        if (dialog) {
          Object.assign(dialog, newDialogPartial);
        }
      });
    },
  })),
);
