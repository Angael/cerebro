import React from 'react';
import numeral from 'numeral';
import css from './FilesStats.module.scss';
import { Icon } from '@mdi/react';
import { mdiChartLine, mdiHarddisk, mdiSigma, mdiSizeXl } from '@mdi/js';
import { ExtendedFile } from '@/app/upload/files/uploadTypes';
import { Paper, Text } from '@mantine/core';

interface IProps {
  files: ExtendedFile[];
}

const FilesStats = ({ files }: IProps) => {
  let summedSize, avgSize, minSize, maxSize;
  let types: string[] = [];
  if (!files || !files.length) {
    summedSize = 0;
    avgSize = 0;
    minSize = 0;
    maxSize = 0;
    types = [];
  } else {
    types = [...new Set<string>(files.map((file) => file.file.type.replace('image/', '')))];
    const sizes = files.map((file) => file.file.size);
    summedSize = sizes.reduce((a, b) => a + b, 0);

    avgSize = summedSize / sizes.length;
    minSize = Math.min(...sizes);
    maxSize = Math.max(...sizes);
  }

  if (files.length < 2) {
    return null;
  }

  return (
    <Paper p="md" className={css.uploadFileStats}>
      <div className={css.fileStat}>
        <Icon path={mdiSigma} size={2} />
        <Text>{files.length}</Text>
        <Text size="sm" c="gray.6">
          Files
        </Text>
      </div>
      <div className={css.fileStat}>
        <Icon path={mdiHarddisk} size={2} />
        <Text>{numeral(summedSize).format('0.00 b')}</Text>
        <Text size="sm" c="gray.6">
          Sum
        </Text>
      </div>
      <div className={css.fileStat}>
        <Icon path={mdiChartLine} size={2} />
        <Text>{numeral(avgSize).format('0.00 b')}</Text>
        <Text size="sm" c="gray.6">
          Avg
        </Text>
      </div>
      <div className={css.fileStat}>
        <Icon path={mdiSizeXl} size={2} />
        <Text>{numeral(maxSize).format('0.00 b')}</Text>
        <Text size="sm" c="gray.6">
          Biggest
        </Text>
      </div>
      {/*<p>{types.join(',')}</p>*/}
    </Paper>
  );
};

export default FilesStats;
