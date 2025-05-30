import { ComponentProps } from 'react';
import css from './FoodLogsList.module.css';

type Props = ComponentProps<'ul'>;

const FoodLogsList = ({ className, ...props }: Props) => {
  return <ul className={css.foodLogsList} {...props} />;
};

export default FoodLogsList;
