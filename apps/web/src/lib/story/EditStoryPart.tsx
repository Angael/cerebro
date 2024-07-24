import React, { useEffect, useState } from 'react';
import { ActionIcon, Button, Menu, Stack, TextInput } from '@mantine/core';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { useStoryPartForm } from '@/lib/story/useStoryPartForm';

type Props = {
  storyPartName: string;
  onCreate: (name: string) => void;
  usedNames: string[];
};

const AddStoryPart = ({ storyPartName, onCreate, usedNames }: Props) => {
  const [opened, setOpened] = useState(false);

  const form = useStoryPartForm(usedNames);

  useEffect(() => {
    if (opened) {
      form.setValues({ name: storyPartName });
    }
  }, [opened, storyPartName]);

  return (
    <Menu withArrow opened={opened} onChange={setOpened}>
      <Menu.Target>
        <ActionIcon size="lg" color="gray.8">
          <Icon path={mdiPencil} size="24px" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown p="sm">
        <form
          onSubmit={form.onSubmit(() => {
            onCreate(form.values.name);
            setOpened(false);
          })}
        >
          <Stack>
            <TextInput label="Name" {...form.getInputProps('name')} />
            <Button type="submit">Save edit</Button>
          </Stack>
        </form>
      </Menu.Dropdown>
    </Menu>
  );
};

export default AddStoryPart;
