import { createContext, useContext } from 'react';

type FoodLogsContextType = {
  openFoodLogId: number | null;
  setOpenFoodLogId: (id: number | null) => void;
};

const FoodLogsContext = createContext<FoodLogsContextType | undefined>(undefined);

export const useFoodLogsContext = () => {
  const context = useContext(FoodLogsContext);
  if (!context) {
    throw new Error('useFoodLogsContext must be used within a FoodLogsContextProvider');
  }
  return context;
};

export const FoodLogsContextProvider = FoodLogsContext.Provider;
