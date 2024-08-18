import React from 'react';
import { Storyteller } from '@cerebro/shared';
import { Stack, TextInput, Title } from '@mantine/core';
import EditDialogChoice from '@/lib/story/edit-dialog/EditDialogChoice';
import { useDebouncedEffect } from '@/utils/hooks/useDebouncedEffect';
import { useChildState } from '@/utils/hooks/useChildState';

type Props = {
  dialog: Storyteller.StoryDialog;
  modifyDialog: (dialog: Partial<Storyteller.StoryDialog>) => void;
};

const EditDialog = ({ dialog, modifyDialog }: Props) => {
  const [who, setWho] = useChildState(dialog.who);
  const [img, setImg] = useChildState(dialog.img);

  useDebouncedEffect(
    () => {
      if (who === dialog.who) return;
      modifyDialog({ who });
    },
    [who],
    500,
  );

  useDebouncedEffect(
    () => {
      if (img === dialog.img) return;
      modifyDialog({ img });
    },
    [img],
    500,
  );

  return (
    <Stack>
      <TextInput
        label="Who is speaking?"
        value={who ?? ''}
        onChange={(e) => setWho(e.currentTarget.value)}
      />
      <TextInput
        label="Background image?"
        value={img ?? ''}
        onChange={(e) => setImg(e.currentTarget.value)}
      />

      <div>
        <Title order={3}>Dialog options:</Title>
        <Stack>
          {dialog.choices.map((choice) => (
            <EditDialogChoice key={choice.id} choice={choice} />
          ))}
        </Stack>
      </div>
    </Stack>
  );
};

export default EditDialog;
