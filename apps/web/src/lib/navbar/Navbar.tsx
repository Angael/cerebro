'use client';
import React from 'react';
import css from './Navbar.module.scss';
import IconBtn from '../../styled/icon-btn/IconBtn';
import Link from 'next/link';
import Icon from '@mdi/react';
import { mdiAccount, mdiCog, mdiLogout, mdiUpload, mdiViewGrid } from '@mdi/js';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';
import { UserMe } from '@cerebro/shared';

const Navbar = () => {
  const user = useQuery({
    queryKey: [QUERY_KEYS.user],
    queryFn: () => API.get<UserMe>('/user/me').then((res) => res.data),
    // Potential optimization:
    // retry: (failCount, err) => !err,
  });

  return (
    <header className={css.navbar}>
      <div className={css.navbarBg}>
        <div className={css.navbarFlex}>
          <Link style={{ marginRight: 'auto' }} href="/">
            <h1 className="h4">Cerebro</h1>
          </Link>

          <IconBtn as={Link} href="/upload" title="Upload">
            <Icon path={mdiUpload} />
          </IconBtn>

          <IconBtn as={Link} href="/browse" title="Browse">
            <Icon path={mdiViewGrid} />
          </IconBtn>

          <IconBtn as={Link} href="/settings" title="Settings">
            <Icon path={mdiCog} />
          </IconBtn>

          {user.data ? (
            <IconBtn as={Link} href="/signout" title="Signout">
              <Icon path={mdiLogout} />
            </IconBtn>
          ) : (
            <IconBtn as={Link} href="/signin" title="Login">
              <Icon path={mdiAccount} />
            </IconBtn>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
