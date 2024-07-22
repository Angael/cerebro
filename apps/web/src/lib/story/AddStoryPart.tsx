import React, { useState } from 'react';
import { ActionIcon, Button, Menu, Stack, TextInput } from '@mantine/core';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { useForm } from '@mantine/form';

type Props = {
  onCreate: (name: string) => void;
  usedNames: string[];
};

const AddStoryPart = ({ onCreate, usedNames }: Props) => {
  const [opened, setOpened] = useState(false);

  const form = useForm({
    initialValues: { name: '' },

    validate: {
      name: (value) => {
        if (value.length < 1) return 'Name must be at least 1 character';
        if (usedNames.includes(value)) return 'Already used';
      },
    },
    transformValues: (values) => {
      return { name: values.name.trim() };
    },
  });

  return (
    <Menu withArrow opened={opened} onChange={setOpened}>
      <Menu.Target>
        <ActionIcon size="lg">
          <Icon path={mdiPlus} size={16} />
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
