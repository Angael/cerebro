'use client';
import React, { useEffect } from 'react';
import css from './Navbar.module.scss';
import Link from 'next/link';
import { Burger, Drawer, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import MyDrawerContents from '@/lib/navbar/drawer/MyDrawerContents';
import { useShowDrawer } from '@/lib/navbar/drawer/useShowDrawer';
import { UserSession } from '@/server/auth/getUser';

const Navbar = ({ user }: { user: UserSession | null }) => {
  const [opened, { toggle, close }] = useDisclosure();
  const isMobile = useShowDrawer();

  useEffect(() => {
    close();
  }, [isMobile]);

  return (
    <header className={css.navbar}>
      <div className={css.navbarBg}>
        <div className={css.navbarFlex}>
          <Burger
            opened={opened}
            onClick={toggle}
            aria-label="Toggle drawer"
            className={css.burger}
            size="sm"
          />
          <Drawer.Root className={css.Drawer} opened={opened} onClose={close}>
            <Drawer.Overlay zIndex={2} />
            <Drawer.Content style={{ zIndex: 2 }} classNames={{ content: css.DrawerContent }}>
              <Drawer.Body h="calc(100% - var(--navbar-height))">
                <MyDrawerContents onClose={close} user={user} />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>

          <Text size="1.5rem" fw={700} component="h1" style={{ marginRight: 'auto' }}>
            <Link href="/" className={css.cerebroLogo} onClick={close}>
              Cerebro
            </Link>
          </Text>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
