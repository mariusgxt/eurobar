import { useRef, useState } from 'react';
import './App.css'
import { BrowserMultiFormatReader } from '@zxing/browser';
import ScannedResult from './ScannedResult';

// Accept a callback prop to send product info up
function Scanner({ onProductInfo }: { onProductInfo: (info: { countries: string, brands: string, barcode: string }) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [showBarcodeInput, setShowBarcodeInput] = useState(false);

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
    // Show a text field for barcode input instead of prompt
    setShowBarcodeInput(true);
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcodeInput.trim() !== "") {
      fetchAndSendProductInfo(barcodeInput.trim());
      setShowBarcodeInput(false);
      setBarcodeInput("");
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
        EuroBar
      </h1>
      <button onClick={handleTypeClick}>Click here to type in the Barcode</button>
      {showBarcodeInput && (
        <form onSubmit={handleBarcodeSubmit} style={{ margin: '1rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', maxWidth: 300 }}>
          <input
            type="text"
            placeholder="Enter barcode"
            value={barcodeInput}
            onChange={e => setBarcodeInput(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '1rem', width: '100%' }}
            autoFocus
          />
          <button type="submit">Submit</button>
          <button type="button" onClick={() => { setShowBarcodeInput(false); setBarcodeInput(""); }}>Cancel</button>
        </form>
      )}
      <p> </p>
      <button onClick={handleScanClick}>Click here to Scan the Barcode</button>
      <div>
        <video ref={videoRef} style={{ width: '300px', marginTop: '20px' }} autoPlay />
      </div>
    </>
  )
}

export default Scanner;
export { ScannedResult };
