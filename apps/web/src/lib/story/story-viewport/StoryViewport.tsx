import React from 'react';
import { Storyteller } from '@cerebro/shared';
import css from './StoryViewport.module.scss';
import { boldenUnderlineEtc } from '@/lib/story/story-viewport/boldenUnderlineEtc';

type Props = {
  dialog?: Storyteller.StoryDialog;
};

const StoryViewport = ({ dialog }: Props) => {
  if (!dialog) {
    return null;
  }

  return (
    <article className={css.storyViewport}>
      {dialog.img && <img className={css.bgImg} src={dialog.img} alt="Background image" />}

      <div className={css.dialogueBox}>
        {dialog.who && <div className={css.whoLabel}>{dialog.who}</div>}

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
