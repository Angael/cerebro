'use client';
import React from 'react';
import { Menu, SegmentedControl } from '@mantine/core';
import { useUrlParam } from '@/utils/hooks/useUrlParam';

export type ViewMode = 'grid' | 'dynamic-grid' | 'list' | 'columns';
const data: { label: string; value: ViewMode }[] = [
  { label: 'Columns', value: 'columns' },
  { label: 'Dynamic Grid', value: 'dynamic-grid' },
  { label: 'Grid', value: 'grid' },
  { label: 'List', value: 'list' },
];

interface BrowseControlInputsProps {
  inMenu?: boolean;
}

const BrowseControlInputs = ({ inMenu }: BrowseControlInputsProps) => {
  const [viewMode, setParam] = useUrlParam('viewMode');
  const [count, setCount] = useUrlParam('itemCount');

  return (
    <>
      {inMenu && <Menu.Label>View mode</Menu.Label>}

      <SegmentedControl
        value={viewMode}
        data={data}
        onChange={(val) => setParam(val as ViewMode, true)}
      />

      {inMenu && <Menu.Divider />}

      {inMenu && <Menu.Label>Items per page</Menu.Label>}

      <SegmentedControl
        value={count}
        data={[
          { label: '20', value: '20' },
          { label: '40', value: '40' },
          { label: '80', value: '80' },
        ]}
        onChange={(val) => setCount(val as any, true)}
      />
    </>
  );
};

export default BrowseControlInputs;
