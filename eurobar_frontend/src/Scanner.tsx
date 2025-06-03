import { useRef } from 'react';
import './App.css'
import { BrowserMultiFormatReader } from '@zxing/browser';
import ScannedResult from './ScannedResult';

// Accept a callback prop to send product info up
function Scanner({ onProductInfo }: { onProductInfo: (info: { countries: string, brands: string, barcode: string }) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  // Helper function to fetch and send product info
  const fetchAndSendProductInfo = async (barcode: string) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      if (data.status === 1) {
        const product = data.product;
        const countries = product.countries || 'Unknown';
        const brands = product.brands || 'Unknown';
        onProductInfo({ countries, brands, barcode });
      } else {
        onProductInfo({ countries: 'Not found', brands: 'Not found', barcode });
      }
    } catch {
      onProductInfo({ countries: 'Fetch error', brands: 'Fetch error', barcode });
    }
  };

  const handleTypeClick = () => {
    const input = window.prompt('Please enter the Barcode:');
    if (input !== null && input.trim() !== '') {
      fetchAndSendProductInfo(input.trim());
    }
  };

  const handleScanClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        if (!codeReaderRef.current) {
          codeReaderRef.current = new BrowserMultiFormatReader();
        }

        let scanned = false;

        codeReaderRef.current.decodeFromVideoElement(videoRef.current, async (result) => {
          if (result && !scanned) {
            const barcode = result.getText();
            if (barcode && barcode.trim() !== '') {
              scanned = true;
              stream.getTracks().forEach(track => track.stop());
              codeReaderRef.current = null;
              fetchAndSendProductInfo(barcode);
              // After sending product info, open ScannedResult.tsx (parent will handle view switch)
              // This is handled by the parent via onProductInfo
            }
          }
        });
      }
    } catch {
      onProductInfo({ countries: 'Camera error', brands: 'Camera error', barcode: '' });
    }
  };

  return (
    <>
      <img src="/assets/europeLogo.png" alt="Eurobar Logo" style={{ width: '35%', marginTop: '-1500px' }} />
      <h1>
        Eurobar
      </h1>
      <button onClick={handleTypeClick}>Click here to type in the Barcode</button>
      <button onClick={handleScanClick}>Click here to Scan the Barcode</button>
      <div>
        <video ref={videoRef} style={{ width: '300px', marginTop: '20px' }} autoPlay />
      </div>
    </>
  )
}

export default Scanner;
export { ScannedResult };
