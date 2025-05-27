import { getUser } from '@/server/auth/getUser';
import Navbar from './Navbar';

const NavbarParent = async () => {
  const user = await getUser();

  return <Navbar user={user} />;
};

export default NavbarParent;
