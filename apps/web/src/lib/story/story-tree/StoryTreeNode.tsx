import { Group, RenderTreeNodePayload, Text } from '@mantine/core';
import { mdiChevronDown } from '@mdi/js';
import Icon from '@mdi/react';
import React from 'react';

type Props = RenderTreeNodePayload;

const labelPerLevel = ['Chapter', 'Scene', 'Dialog'];

const StoryTreeNode = ({ level, node, expanded, hasChildren, elementProps, tree }: Props) => {
  const onLeafClick = () => {
    if (!hasChildren) {
      tree.select(node.value);
    } else {
      tree.toggleExpanded(node.value);
    }
  };

  return (
    <Group gap={5} {...elementProps} onClick={onLeafClick}>
      {hasChildren ? (
        <Icon
          path={mdiChevronDown}
          size={'18px'}
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      ) : (
        <div style={{ width: 18 }} />
      )}

      <Text size="md" c="gray.4">
        {node.label}
      </Text>
      <Text size="xs" c="gray.6">
        ({labelPerLevel[level - 1]})
      </Text>
    </Group>
  );
};

export default StoryTreeNode;
