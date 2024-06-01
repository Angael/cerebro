import { useRef, useState, MutableRefObject } from 'react';

type Args = {
  isSeeking: MutableRefObject<boolean>;
};

export const useHideVideoUi = ({ isSeeking }: Args) => {
  const [hideUi, setHideUi] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const setHideVideoUi = (hideTimeoutMs = 0) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (hideTimeoutMs === 0) {
      setHideUi(true);
    } else {
      timeoutRef.current = window.setTimeout(() => {
        if (!isSeeking.current) {
          setHideUi(true);
        }
      }, hideTimeoutMs);
    }
  };

  const briefShowUi = (shouldHide = false, hideTimeoutMs = 800) => {
    setHideUi(false);

    if (!shouldHide) {
      return;
    }

    setHideVideoUi(hideTimeoutMs);
  };

  return { hideUi, briefShowUi, setHideVideoUi };
};
