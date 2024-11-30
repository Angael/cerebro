import { StoryJson } from '@cerebro/db';
import { Tree, TreeNodeData, useTree } from '@mantine/core';
import { useMemo } from 'react';
import StoryTreeNode from './StoryTreeNode';

type Props = {
  storyJson: StoryJson;
};

const StoryTree = ({ storyJson }: Props) => {
  const data = useMemo<TreeNodeData[]>(() => {
    const _data: TreeNodeData[] = storyJson.chapters.map((chapter) => {
      return {
        value: chapter.id,
        label: chapter.title,
        children: chapter.scenes.map((scene) => ({
          value: scene.id,
          label: scene.title,
          children: scene.dialogs.map((dialog) => ({
            value: dialog.id,
            label: dialog.title,
          })),
        })),
      };
    });

    return _data;
  }, [storyJson]);

  const tree = useTree({ multiple: false });

  console.log(tree.selectedState);

  return <Tree tree={tree} data={data} renderNode={StoryTreeNode} />;
};

export default StoryTree;
