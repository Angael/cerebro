import { useRef } from 'react';

export const useVideoProgressSlider = () => {
  const sliderRef = useRef<any>(null);

  const setSliderProgress = (playedFraction: number) => {
    const bar = sliderRef.current?.querySelector('.mantine-Slider-bar') as HTMLDivElement;
    const thumb = sliderRef.current?.querySelector('.mantine-Slider-thumb') as HTMLDivElement;

    bar.style.setProperty(
      '--slider-bar-width',
      `calc(${playedFraction * 100}% + var(--slider-size))`,
    );
    thumb.style.setProperty('--slider-thumb-offset', `${playedFraction * 100}%`);
  };

  return { sliderRef, setSliderProgress };
};
