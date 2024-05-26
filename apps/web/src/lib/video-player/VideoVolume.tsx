import React from 'react';
import Icon from '@mdi/react';
import { mdiVolumeHigh } from '@mdi/js';
import { ActionIcon, Menu, Slider } from '@mantine/core';

type Props = {
  volume: number;
  setVolume: (volume: number) => void;
};

const VideoVolume = ({ volume, setVolume }: Props) => {
  return (
    <Menu trigger="hover" openDelay={50} closeDelay={100} position="top" width={100}>
      <Menu.Target>
        <ActionIcon
          variant="light"
          color="white"
          size="sm"
          aria-label="Volume"
          onClick={(e) => {
            e.stopPropagation();
            if (volume === 0) {
              setVolume(0.5);
            } else {
              setVolume(0);
            }
          }}
        >
          <Icon path={mdiVolumeHigh} size={1} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
        <Slider
          label={null}
          color="white"
          step={1}
          value={volume * 100}
          onChange={(val) => setVolume(val / 100)}
        />
      </Menu.Dropdown>
    </Menu>
  );
};

export default VideoVolume;
