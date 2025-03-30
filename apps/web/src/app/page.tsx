import React, { Suspense } from 'react';
import Browse from '@/app/browse/Browse';
import PageLoader from '@/lib/page-loader/PageLoader';
import { Anchor, Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
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

        <Paper p="md">
          <Title order={4}>Log calories</Title>
          <Text size="sm" c="gray.6">
            Scan products and see your daily limit
          </Text>
          <Anchor component={Link} href="/food">
            Link
          </Anchor>
        </Paper>

        <Paper p="md">
          <Title order={4}>Update your weight</Title>
          <Text>Coming soon...</Text>
        </Paper>
      </Group>
    </Stack>
  );
};

export default IndexPage;
