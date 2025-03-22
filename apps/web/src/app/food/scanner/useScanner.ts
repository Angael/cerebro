import { notifications } from '@mantine/notifications';
import { BarcodeDetector } from 'barcode-detector/pure';
import { useEffect } from 'react';
import css from './Scanner.module.css';

const getBarcodeDetector = async (): Promise<BarcodeDetector> => {
  if ('BarcodeDetector' in window) {
    return new (window as any).BarcodeDetector({
      formats: ['code_39', 'codabar', 'ean_13', 'ean_8'],
    });
  }

  const { BarcodeDetector } = await import('barcode-detector/pure');
  return new BarcodeDetector({
    formats: ['code_39', 'codabar', 'ean_13', 'ean_8'],
  });
};

export const useScanner = (
  canScan: boolean,
  videoElement: HTMLVideoElement | null,
  codeFoundCallback: (code: string[]) => void,
) =>
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const doScanner = async () => {
      const barcodeDetector = await getBarcodeDetector();

      interval = setInterval(async () => {
        if (!canScan || !videoElement) {
          return;
        }

        try {
          const barcodes = await barcodeDetector.detect(videoElement);

          if (barcodes.length) {
            videoElement.classList.add(css.codeFound);
            codeFoundCallback(barcodes.map((barcode) => barcode.rawValue));
          } else {
            videoElement.classList.remove(css.codeFound);
          }
        } catch (e) {
          notifications.show({
            title: 'Error',
            message: String(e),
            color: 'red',
          });
        }
      }, 250);
    };

    if (canScan && videoElement) {
      doScanner();
    }

    return () => {
      clearInterval(interval);
    };
  }, [canScan, videoElement]);
