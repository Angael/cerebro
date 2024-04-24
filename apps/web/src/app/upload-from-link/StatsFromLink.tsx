import React from 'react';
import numeral from 'numeral';

import css from './StatsFromLink.module.scss';
import clsx from 'clsx';
import { Card, Image, Stack, Text } from '@mantine/core';

type Props = {
  stats: any;
  isFetching: boolean;
  isError?: boolean;
};

const StatsFromLink = ({ stats, isFetching, isError }: Props) => {
  const { title, duration, thumbnail, resolution, fps, ext, filesize_approx } = stats ?? {
    title: 'Title of video',
    duration: 0,
    thumbnail: 'https://placehold.co/600x300/EEE/31343C',
    resolution: '0x0',
    fps: 0,
    ext: 'ext',
    filesize_approx: 0,
  };

  const sizeStr = numeral(filesize_approx).format('0.00 b');
  const durationStr = numeral(duration).format('00:00:00');

  return (
    <Card className={clsx(css.StatsFromLink, isError && css.error, isFetching && css.isFetching)}>
      <Card.Section>
        <Image mah={200} src={thumbnail} alt="thumbnail" />
      </Card.Section>
      <Stack gap="md" mt="md">
        <header>
          <Text size="lg" fw={700}>
            {title}
          </Text>
        </header>

        <Stack gap="0">
          <Text size="sm" c="gray.4">
            Duration: {durationStr}s
          </Text>
          <Text size="sm" c="gray.4">
            Resolution: {resolution}
          </Text>
          <Text size="sm" c="gray.4">
            FPS: {fps}
          </Text>
          <Text size="sm" c="gray.4">
            Ext: {ext}
          </Text>
          <Text size="sm" c="gray.4">
            Filesize: {sizeStr}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
};

export default StatsFromLink;
