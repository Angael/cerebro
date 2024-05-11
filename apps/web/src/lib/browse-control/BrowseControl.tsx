import React from 'react';
import { Group, SegmentedControl } from '@mantine/core';
import { useUrlParam } from '@/utils/hooks/useUrlParam';

export type ViewMode = 'grid' | 'dynamic-grid' | 'list';
const data: { label: string; value: ViewMode }[] = [
  { label: 'Dynamic Grid', value: 'dynamic-grid' },
  { label: 'Grid', value: 'grid' },
  { label: 'List', value: 'list' },
];

const BrowseControl = () => {
  const [viewMode, setParam] = useUrlParam('viewMode');
  const [count, setCount] = useUrlParam('itemCount');

  return (
    <Group justify="space-around">
      <SegmentedControl
        value={viewMode}
        data={data}
        onChange={(val) => setParam(val as ViewMode, true)}
      />
      <SegmentedControl
        value={count}
        data={[
          { label: '25', value: '25' },
          { label: '50', value: '50' },
          { label: '100', value: '100' },
        ]}
        onChange={(val) => setCount(val as any, true)}
      />
    </Group>
  );
};

export default BrowseControl;
