import { ComponentProps, useState } from 'react';
import css from './FoodLogsList.module.css';
import { FoodLogsContextProvider } from './FoodLogsContext';

type Props = ComponentProps<'ul'>;

const FoodLogsList = ({ className, ...props }: Props) => {
  const [openFoodLogId, setOpenFoodLogId] = useState<string | null>(null);

  return (
    <FoodLogsContextProvider value={{ openFoodLogId, setOpenFoodLogId }}>
      <ul className={css.foodLogsList} {...props} />
    </FoodLogsContextProvider>
  );
};

export default FoodLogsList;
