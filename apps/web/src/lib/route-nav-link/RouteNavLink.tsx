import Link, { LinkProps } from 'next/link';
import { NavLink, NavLinkProps } from '@mantine/core';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Props = {} & LinkProps & NavLinkProps;

export const RouteNavLink = ({ href, ...props }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleMouseEnter = () => {
    // Prefetch the route on hover
    router.prefetch(href.toString());
  };

  return (
    <NavLink
      // prefetch={false} - we handle prefetching manually on hover to avoid issues with dynamic search params
      component={Link}
      active={pathname === href.toString()}
      variant={'light'}
      href={href}
      onMouseEnter={handleMouseEnter}
      prefetch={false}
      {...props}
    />
  );
};
