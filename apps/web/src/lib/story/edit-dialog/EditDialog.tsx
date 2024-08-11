import React from 'react';
import { Storyteller } from '@cerebro/shared';
import { Stack, TextInput, Title } from '@mantine/core';
import EditDialogChoice from '@/lib/story/edit-dialog/EditDialogChoice';

type Props = {
  dialog: Storyteller.StoryDialog;
};

const EditDialog = ({ dialog }: Props) => {
  return (
    <Stack>
      <TextInput label="Who is speaking?" value={dialog.who ?? ''} onChange={(e) => {}} />
      <TextInput label="Background image?" value={dialog.img ?? ''} onChange={(e) => {}} />
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
