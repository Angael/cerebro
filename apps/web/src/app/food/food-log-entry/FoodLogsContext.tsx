'use client';
import { createContext, ReactNode, use, useState } from 'react';

type FoodLogsContextType = {
  openFoodLogId: number | null;
  setOpenFoodLogId: (id: number | null) => void;
};

const FoodLogsContext = createContext<FoodLogsContextType | undefined>(undefined);

export const useFoodLogsContext = () => {
  const context = use(FoodLogsContext);
  if (!context) {
    throw new Error('useFoodLogsContext must be used within a FoodLogsContextProvider');
  }
  return context;
};

export const FoodLogsContextProvider = ({ children }: { children?: ReactNode }) => {
  const [openFoodLogId, setOpenFoodLogId] = useState<number | null>(null);

  return <FoodLogsContext value={{ openFoodLogId, setOpenFoodLogId }}>{children}</FoodLogsContext>;
};
