import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import clsx from 'clsx';

type ComponentType = keyof JSX.IntrinsicElements | React.ForwardRefExoticComponent<any>;

type StyledElementProps<T extends ComponentType, P = {}> = {
  as?: ComponentType;
} & ComponentPropsWithoutRef<T> &
  P;

// TODO: remove this ?
export const styled = <T extends ComponentType, P>(
  defaultComponent: T,
  baseClassName?: string,
  defaultProps = {},
) => {
  // eslint-disable-next-line react/display-name
  return forwardRef<any, StyledElementProps<T, P>>(
    ({ as = defaultComponent, className, ...props }, ref) => {
      const _Component = as;
      return (
        <_Component
          ref={ref}
          className={clsx(baseClassName, className)}
          {...defaultProps}
          {...props}
        />
      );
    },
  );
};
