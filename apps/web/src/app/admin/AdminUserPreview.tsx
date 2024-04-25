import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';
import { AdminAllUsers, AdminUserPreview_Endpoint } from '@cerebro/shared';
import numeral from 'numeral';

type Props = {
  userId: string;
  email: string;
  type: string;
};

const AdminUserPreview = ({ userId, email, type }: Props) => {
  const { data } = useQuery({
    retry: false,
    queryKey: [QUERY_KEYS.adminUserPreview, { userId }],
    queryFn: () =>
      API.get<AdminUserPreview_Endpoint>(`/admin/user-preview`, { params: { userId } }).then(
        (res) => res.data,
      ),
  });

  return (
    <div>
      <div>userId: {userId}</div>
      <div>email: {email}</div>
      <div>type: {type}</div>
      <div>usedSpace: {numeral(data?.usedSpace).format('0.00 b')}</div>
      <div>maxSpace: {numeral(data?.maxSpace).format('0.00 b')}</div>
      <div>itemCount: {data?.itemCount}</div>
    </div>
  );
};

export default AdminUserPreview;
