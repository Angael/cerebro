import { Card, Text } from '@mantine/core';
import React from 'react';

export function StoryStats(props: {
  storyStats: { chapters: number; scenes: number; choices: number; dialogs: number };
}) {
  return (
    <details>
      <summary>Statistics</summary>
      <Card>
        <Text>Chapters: {props.storyStats.chapters}</Text>
        <Text>Scenes: {props.storyStats.scenes}</Text>
        <Text>Dialogs: {props.storyStats.dialogs}</Text>
        <Text>Choices: {props.storyStats.choices}</Text>
      </Card>
    </details>
  );
}