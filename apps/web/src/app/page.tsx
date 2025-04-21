import { Anchor, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { mdiFire, mdiPlayCircle, mdiWeightKilogram } from '@mdi/js';
import Icon from '@mdi/react';
import Link from 'next/link';
import css from './page.module.css';

// Static site
export const dynamic = 'force-dynamic';

const IndexPage = () => {
  return (
    <Stack>
      <Stack gap="0">
        <Title order={1}>Welcome to Cerebro</Title>
        <Text>Your personal hub</Text>
      </Stack>

      <Group align="stretch">
        <Paper p="md" component={Stack} gap="0" className={css.featureCard}>
          <Icon path={mdiPlayCircle} size={5} className={css.iconBg} />

          <Title order={4}>Uploads</Title>
          <Text size="sm" c="gray.6">
            See media files that you put on this site
          </Text>
          <Anchor component={Link} href="/browse" style={{ alignSelf: 'flex-end' }}>
            Browse
          </Anchor>
        </Paper>

        <Paper p="md" component={Stack} gap="0" className={css.featureCard}>
          <Icon path={mdiFire} size={5} className={css.iconBg} />
          <Title order={4}>Log calories</Title>
          <Text size="sm" c="gray.6">
            Scan products and see your daily limit
          </Text>
          <Anchor component={Link} href="/food" style={{ alignSelf: 'flex-end' }}>
            Link
          </Anchor>
        </Paper>

        <Paper p="md" component={Stack} gap="0" className={css.featureCard}>
          <Icon path={mdiWeightKilogram} size={5} className={css.iconBg} />

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
