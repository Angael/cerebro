import React from 'react';
import Icon from '@mdi/react';
import { mdiCog, mdiVolumeHigh } from '@mdi/js';
import { ActionIcon, Menu, Slider, Text } from '@mantine/core';

type Props = {
  selectedQuality: string;
  qualities: string[];
  setQuality: (quality: string) => void;
  stats: { label: string; value: string }[];
};

const VolumeSetting = ({ selectedQuality, setQuality, qualities, stats }: Props) => {
  return (
    <Menu trigger="hover" openDelay={50} closeDelay={100} position="top">
      <Menu.Target>
        <ActionIcon
          variant="light"
          color="white"
          size="sm"
          aria-label="Settings"
          onClick={(e) => e.stopPropagation()}
        >
          <Icon path={mdiCog} size={1} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
        {stats.map(({ label, value }) => (
          <Menu.Item
            key={label}
            rightSection={
              <Text size="xs" c="dimmed">
                {value}
              </Text>
            }
            disabled
            style={{ padding: '4px 12px' }}
          >
            {label}
          </Menu.Item>
        ))}

        <Menu.Divider />

        <Menu.Label>Quality</Menu.Label>
        {qualities.map((quality) => (
          <Menu.Item
            key={quality}
            color={selectedQuality === quality ? 'blue.3' : undefined}
            onClick={() => setQuality(quality)}
            closeMenuOnClick={false}
          >
            {quality}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default VolumeSetting;
