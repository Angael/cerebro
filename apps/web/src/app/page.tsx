import { Anchor, Group, Paper, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

const IndexPage = () => {
  return (
    <Stack>
      <Stack gap="0">
        <Title order={1}>Welcome to Cerebro</Title>
        <Text>Your personal hub</Text>
      </Stack>

      <Group align="stretch">
        <Paper p="md" component={Stack} gap="0">
          <Title order={4}>Uploads</Title>
          <Text size="sm" c="gray.6">
            See latest uploads
          </Text>
          <Anchor component={Link} href="/browse" style={{ alignSelf: 'flex-end' }}>
            Browse
          </Anchor>
        </Paper>

        <Paper p="md" component={Stack} gap="0">
          <Title order={4}>Log calories</Title>
          <Text size="sm" c="gray.6">
            Scan products and see your daily limit
          </Text>
          <Anchor component={Link} href="/food" style={{ alignSelf: 'flex-end' }}>
            Link
          </Anchor>
        </Paper>

        <Paper p="md" component={Stack} gap="0">
          <Title order={4}>Update your weight</Title>
          <Text size="sm" c="gray.6">
            Update your weight and see your progress
          </Text>
          <Anchor component={Link} href="/weight" style={{ alignSelf: 'flex-end' }}>
            Link
          </Anchor>
        </Paper>
      </Group>
    </Stack>
  );
};

export default IndexPage;
