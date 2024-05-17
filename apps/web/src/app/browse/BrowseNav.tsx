import React from 'react';
import { Button, Group } from '@mantine/core';

type Props = {};

const BrowseNav = (props: Props) => {
  return (
    <Group>
      Or use the segment display
      <Button variant="primary">All items</Button>
      <Button variant="subtle">My items</Button>
    </Group>
  );
};

export default BrowseNav;
