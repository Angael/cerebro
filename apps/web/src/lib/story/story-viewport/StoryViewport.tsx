import React from 'react';
import { useUrlParam } from '@/utils/hooks/useUrlParam';
import { Storyteller } from '@cerebro/shared';

type Props = {
  storyJson: Storyteller.StoryJson;
};

const mockDialog: Storyteller.StoryDialog = {
  id: 'whatever',
  who: 'Krzysztof Widacki',
  title: '',
  img: 'https://picsum.photos/200/300',
  choices: [
    {
      id: 'next',
      text: 'Next',
      nextDialogId: 'whatever-2',
    },
  ],
};

const StoryViewport = ({ storyJson }: Props) => {
  const [chapterId] = useUrlParam('chapterId');
  const [sceneId] = useUrlParam('sceneId');
  const [dialogId] = useUrlParam('dialogId');

  const chapter = storyJson.chapters.find((chapter) => chapter.id === chapterId);
  const scene = chapter?.scenes.find((scene) => scene.id === sceneId);

  // const dialog = scene?.dialogs.find((dialog) => dialog.id === dialogId);
  const dialog = mockDialog;

  console.log('dialog', dialog);

  return (
    <div>
      <pre>{JSON.stringify(dialog, null, 2)}</pre>
    </div>
  );
};

export default StoryViewport;
