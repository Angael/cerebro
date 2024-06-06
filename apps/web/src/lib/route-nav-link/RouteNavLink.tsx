import Link, { LinkProps } from 'next/link';
import { NavLink, NavLinkProps } from '@mantine/core';
import React from 'react';
import { usePathname } from 'next/navigation';

type Props = {} & LinkProps & NavLinkProps;

export const RouteNavLink = ({ href, ...props }: Props) => {
  const pathname = usePathname();

  return (
    <NavLink
      component={Link}
      active={pathname === href.toString()}
      variant={'light'}
      href={href}
      {...props}
    />
  );
};
