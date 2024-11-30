import { useEffect, useState } from 'react';

export const useChildState = <T>(parentValue: T) => {
  const [state, setState] = useState<T>(parentValue);

  useEffect(() => {
    setState(parentValue);
  }, [parentValue]);

  return [state, setState] as const;
};
