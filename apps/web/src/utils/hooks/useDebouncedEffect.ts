import React from 'react';
import { useDebouncedCallback, useDidUpdate } from '@mantine/hooks';

/**
 * Fires only when values change, not on mount
 */
export const useDebouncedEffect = (
  effect: React.EffectCallback,
  deps: React.DependencyList,
  delay: number,
) => {
  const callback = useDebouncedCallback(() => {
    effect?.();
  }, delay);

  useDidUpdate(() => {
    callback();
  }, deps);
};
