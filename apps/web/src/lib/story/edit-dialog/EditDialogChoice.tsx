import React from 'react';
import { Storyteller } from '@cerebro/shared';
import { Card, TextInput } from '@mantine/core';

type Props = {
  choice: Storyteller.StoryDialogChoice;
};

const EditDialogChoice = (props: Props) => {
  return (
    <Card>
      <TextInput label="Choice text" value={props.choice.text ?? ''} onChange={(e) => {}} />
      {/*  TODO destination selector*/}
    </Card>
  );
};

export default EditDialogChoice;
