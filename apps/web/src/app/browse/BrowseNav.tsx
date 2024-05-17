import React from 'react';
import { Group, SegmentedControl } from '@mantine/core';
import { useUrlParam } from '@/utils/hooks/useUrlParam';

type Props = {};

const BrowseNav = (props: Props) => {
  const [author, setAuthor] = useUrlParam('author');

  return (
    <Group>
      <SegmentedControl
        value={author}
        data={[
          { label: 'All items', value: 'all' },
          { label: 'My items', value: 'my' },
          { label: 'Only other items', value: 'other' },
        ]}
        onChange={(val) => setAuthor(val as any, true)}
      />
    </Group>
  );
};

export default BrowseNav;
