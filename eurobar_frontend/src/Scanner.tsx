import { useRef, useState } from 'react';
import './App.css'
import { BrowserMultiFormatReader } from '@zxing/browser';
import ScannedResult from './ScannedResult';

function Scanner({ onProductInfo }: { onProductInfo: (info: { countries: string, brands: string, barcode: string }) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [showBarcodeInput, setShowBarcodeInput] = useState(false);

  const fetchAndSendProductInfo = async (barcode: string) => {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`http://localhost:8080/api/products/lookup/${barcode}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const product = await response.json();
        onProductInfo({ 
          countries: product.region || 'Unknown', 
          brands: product.company || 'Unknown', 
          barcode 
        });
      } else {
        console.error('Response not ok:', response.status, response.statusText);
        onProductInfo({ countries: 'Not found', brands: 'Not found', barcode });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      onProductInfo({ countries: 'Fetch error', brands: 'Fetch error', barcode });
    }
  };

  const handleTypeClick = () => {
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
        <div className="result-card">
          <form onSubmit={handleBarcodeSubmit} style={{ margin: '1rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', maxWidth: 300}}>
            <input
              type="text"
              placeholder="Enter barcode"
              value={barcodeInput}
              onChange={e => setBarcodeInput(e.target.value)}
              style={{ maxWidth: 190, padding: 12, border: 'none', borderRadius: 4, boxShadow: '2px 2px 7px 0 rgb(0,0,0,0.2)', outline: 'none', background: 'white', color: 'dimgray' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button type="submit">Submit</button>
              <button type="button" onClick={() => { setShowBarcodeInput(false); setBarcodeInput(""); }}>Cancel</button>
            </div>
          </form>
        </div>
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
