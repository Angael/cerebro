'use client';
import React from 'react';
import { Button, Group, Menu } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import BrowseControlInputs from '@/lib/browse-control/BrowseControlInputs';
import Icon from '@mdi/react';
import { mdiViewList } from '@mdi/js';

const BrowseControl = () => {
  const isMobile = useMediaQuery('(max-width: 1000px)');
  const showIcon = useMediaQuery('(min-width: 380px)');

  if (isMobile) {
    return (
      <Menu shadow="md">
        <Menu.Target>
          <Button
            variant="default"
            leftSection={showIcon && <Icon path={mdiViewList} size="16px" />}
          >
            View
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <BrowseControlInputs inMenu />
        </Menu.Dropdown>
      </Menu>
    );
  }

  return (
    <Group justify="space-around">
      <BrowseControlInputs />
    </Group>
  );
};

export default BrowseControl;
