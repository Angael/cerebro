import { ComponentProps, memo } from 'react';
import { UnstyledButton } from '@mantine/core';
import css from './CardBtn.module.css';
import clsx from 'clsx';

type Props = ComponentProps<typeof UnstyledButton<'button'>>;

const CardBtn = ({ className, ...props }: Props) => {
  return <UnstyledButton className={clsx(css.btn, className)} {...props} />;
};

export default memo(CardBtn);
