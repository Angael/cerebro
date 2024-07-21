'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { GetStories_Endpoint } from '@cerebro/shared';
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

const StoryBrowsePage = () => {
  const storiesQuery = useQuery({
    queryKey: ['stories'],
    queryFn: () => API.get<GetStories_Endpoint>('/story/list-stories').then((res) => res.data),
  });

  return (
    <Stack>
      <Group>
        <Title>Stories</Title>
        <Button>Create</Button>
      </Group>
      {storiesQuery.data?.stories.map((story) => (
        <Card key={story.id}>
          <Stack>
            <Title order={3}>{story.title}</Title>
            <Text>{story.description}</Text>
            <Button component={Link} href={`/story/play?storyId=${encodeURIComponent(story.id)}`}>
              Read
            </Button>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};

export default StoryBrowsePage;
