import React from 'react';
import { useStoryStore } from '@/app/story/edit/story.store';
import { Text, TextInput } from '@mantine/core';
import { useUrlParam } from '@/utils/hooks/useUrlParam';

type Props = {};

const EditChapter = (props: Props) => {
  const storyJson = useStoryStore((s) => s.storyJson);
  const [chapterId, setChapterId] = useUrlParam('chapterId');

  const chapter = storyJson?.chapters.find((chapter) => chapter.id === chapterId);
  const setChapterName = useStoryStore((s) => s.setChapterName);

  if (!chapterId || !chapter) {
    return <Text> Chapter not selected</Text>;
  }

  return (
    <TextInput
      label="Chapter Name"
      value={chapter.title}
      onChange={(e) => setChapterName(chapterId, e.currentTarget.value)}
    />
  );
};

export default EditChapter;
