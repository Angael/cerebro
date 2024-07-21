'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useStory } from '@/utils/hooks/useStory';

const StoryEditPage = () => {
  const searchParams = useSearchParams();
  const storyId = searchParams.get('storyId')!;
  const storyQuery = useStory(storyId);

  return <div>edit test, status: {storyQuery.status}</div>;
};

export default StoryEditPage;
