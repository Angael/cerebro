import React from 'react';
import { useUrlParam } from '@/utils/hooks/useUrlParam';
import { Storyteller } from '@cerebro/shared';
import css from './StoryViewport.module.scss';
import { boldenUnderlineEtc } from '@/lib/story/story-viewport/boldenUnderlineEtc';

type Props = {
  storyJson: Storyteller.StoryJson;
};

const mockDialog: Storyteller.StoryDialog = {
  id: 'whatever',
  who: 'Krzysztof Widacki',
  title: '',
  content: 'Halo? \nWidzę że się obudziłeś... \n' + 'Co robisz w moim domu?',
  img: 'https://picsum.photos/900/570',
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

  // const chapter = storyJson.chapters.find((chapter) => chapter.id === chapterId);
  // const scene = chapter?.scenes.find((scene) => scene.id === sceneId);
  // const dialog = scene?.dialogs.find((dialog) => dialog.id === dialogId);

  const dialog = mockDialog;

  console.log('dialog', dialog);

  return (
    <article className={css.storyViewport}>
      <img className={css.bgImg} src={dialog.img} alt="Background image" />

      <div className={css.dialogueBox}>
        <div className={css.whoLabel}>{dialog.who}</div>

        <div className={css.dialogueAndOptions}>
          <div
            className={css.content}
            dangerouslySetInnerHTML={{ __html: boldenUnderlineEtc(dialog.content) }}
          />
          <div className={css.dialogueOptions}>
            {dialog.choices.map((choice) => (
              <button
                key={choice.id}
                className={css.dialogueOption}
                dangerouslySetInnerHTML={{ __html: boldenUnderlineEtc(choice.text) }}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default StoryViewport;
