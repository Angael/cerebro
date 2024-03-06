'use client';
import React from 'react';
import numeral from 'numeral';
import ProgressBar from '@/styled/progress-bar/ProgressBar';
import { useQuery } from '@tanstack/react-query';
import { useRequest } from '@/utils/useRequest';
import { GetUploadLimits } from '@cerebro/shared';

type Props = {};

const UsedSpace = () => {
  const request = useRequest();
  const { data, isFetching, isFetched, isError } = useQuery({
    queryKey: ['uploadLimits'],
    queryFn: () => request.get<GetUploadLimits>('/account/limits').then((res) => res.data),
    retry: false,
  });

  if (!data) {
    // Todo add loader
    return <ProgressBar id="used-space" label={'Used space: 0 b out of 0 b'} value={0} max={100} />;
  }

  const value = (100 * data.bytes.used) / data.bytes.max;
  const usageString =
    numeral(data.bytes.used).format('0 b') + ' out of ' + numeral(data.bytes.max).format('0 b');

  return (
    <ProgressBar id="used-space" label={'Used space: ' + usageString} value={value} max={100} />
  );
};

export default UsedSpace;
