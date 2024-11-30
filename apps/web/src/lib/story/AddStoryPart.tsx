import React, { useState } from 'react';
import { ActionIcon, Button, Menu, Stack, TextInput } from '@mantine/core';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { useStoryPartForm } from '@/lib/story/useStoryPartForm';

type Props = {
  onCreate: (name: string) => void;
  usedNames: string[];
};

const AddStoryPart = ({ onCreate, usedNames }: Props) => {
  const [opened, setOpened] = useState(false);

  const form = useStoryPartForm(usedNames);

  return (
    <Menu withArrow opened={opened} onChange={setOpened}>
      <Menu.Target>
        <ActionIcon size="lg">
          <Icon path={mdiPlus} size="24px" />
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
            <Button type="submit">Create</Button>
          </Stack>
        </form>
      </Menu.Dropdown>
    </Menu>
  );
};

export default AddStoryPart;
