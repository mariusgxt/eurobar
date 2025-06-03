import { useRef } from 'react';
import './App.css'
import { BrowserMultiFormatReader } from '@zxing/browser';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  // Helper function to fetch and display product info
  const fetchAndDisplayProductInfo = async (barcode: string) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      if (data.status === 1) {
        const product = data.product;
        const countries = product.countries || 'Unknown';
        const brands = product.brands || 'Unknown';
        alert(`Countries: ${countries}\nBrands: ${brands}`);
      } else {
        alert('Product not found.');
      }
    } catch {
      alert('Failed to fetch product info.');
    }
  };

  const handleTypeClick = () => {
    const input = window.prompt('Please enter the Barcode:');
    if (input !== null && input.trim() !== '') {
      fetchAndDisplayProductInfo(input.trim());
    }
  };

  const handleScanClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Initialize the barcode reader
        if (!codeReaderRef.current) {
          codeReaderRef.current = new BrowserMultiFormatReader();
        }

        let scanned = false; // Prevent multiple triggers

        codeReaderRef.current.decodeFromVideoElement(videoRef.current, async (result) => {
          if (result && !scanned) {
            const barcode = result.getText();
            if (barcode && barcode.trim() !== '') {
              scanned = true;
              // Stop the video stream after successful scan
              stream.getTracks().forEach(track => track.stop());
              codeReaderRef.current = null; // Clean up the reader

              // Fetch and display product info
              fetchAndDisplayProductInfo(barcode);
            }
          }
        });
      }
    } catch {
      alert('Camera access denied or not available.');
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

export default App
