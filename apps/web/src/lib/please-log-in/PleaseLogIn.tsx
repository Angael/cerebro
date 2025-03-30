import { Group, Paper, Text, Title } from '@mantine/core';
import { mdiAccountOff } from '@mdi/js';
import Icon from '@mdi/react';

type Props = {
  title?: string;
};

const PleaseLogIn = ({ title = 'Log in to see this page' }: Props) => {
  return (
    <Paper p="md">
      <Group>
        <Icon path={mdiAccountOff} size={2} />
        <div>
          <Title order={1}>{title}</Title>
          <Text>Please log in to see this page</Text>
        </div>
      </Group>
    </Paper>
  );
};

export default PleaseLogIn;
