import { create } from 'zustand';
import { StoryJson } from '@cerebro/shared';

interface IStoryStore {
  storyJson: StoryJson | null;
  setStory: (story: StoryJson) => void;
  reset: () => void;
}

export const useStoryStore = create<IStoryStore>((set) => ({
  storyJson: null,
  setStory: (story) => set({ storyJson: story }),
  reset: () => set({ storyJson: null }),
}));
