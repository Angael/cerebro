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
  const [viewMode, setParam] = useUrlParam<ViewMode>('viewMode', 'dynamic-grid');

  return (
    <Group>
      <SegmentedControl
        value={viewMode}
        data={data}
        onChange={(val) => setParam(val as ViewMode, true)}
      />
    </Group>
  );
};

export default BrowseControl;
