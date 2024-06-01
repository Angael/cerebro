import { useRef, useState, MutableRefObject } from 'react';

type Args = {
  isSeeking: MutableRefObject<boolean>;
};

export const useHideVideoUi = ({ isSeeking }: Args) => {
  const [hideUi, setHideUi] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const briefShowUi = (shouldHide = false, immediateHide = false, hideTimeoutMs = 800) => {
    setHideUi(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!shouldHide || isSeeking.current) {
      return;
    }

    if (immediateHide) {
      setHideUi(true);
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setHideUi(true);
    }, hideTimeoutMs);
  };

  return { hideUi, briefShowUi };
};
