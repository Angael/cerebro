'use client';
import React from 'react';
import numeral from 'numeral';
import ProgressBar from '@/styled/progress-bar/ProgressBar';
import { useQuery } from '@tanstack/react-query';
import { useAuthHeader } from '@/utils/useAuthHeader';
import { GetUploadLimits } from '@cerebro/shared';
import { ApiClient } from '@/utils/api.client';
import { QUERY_KEYS } from '@/utils/consts';

type Props = {
  initialValue?: GetUploadLimits;
};

const UsedSpace = (props: Props) => {
  const getAuthHeader = useAuthHeader();
  const { data, isFetching, isFetched, isError } = useQuery({
    queryKey: [QUERY_KEYS.uploadLimits],
    queryFn: async () =>
      ApiClient.get<GetUploadLimits>('/account/limits', {
        headers: await getAuthHeader(),
      }).then((res) => res.data),
    refetchOnWindowFocus: true,
    initialData: props.initialValue,
  });

  const usageString =
    numeral(data?.bytes.used).format('0 b') + ' out of ' + numeral(data?.bytes.max).format('0 b');

  return (
    <ProgressBar
      id="used-space"
      label={'Used space: ' + usageString}
      value={data ? (100 * data.bytes.used) / data.bytes.max : 0}
      max={100}
      isLoading={!data}
    />
  );
};

export default UsedSpace;
