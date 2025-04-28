import { getUser } from '@/server/getUser';
import { Title } from '@mantine/core';
import { redirect } from 'next/navigation';

const AdminPage = async () => {
  const user = await getUser();

  if (!user) {
    throw redirect('/error/401');
  }

  return (
    <div>
      <Title order={1}>Admin page</Title>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default AdminPage;
