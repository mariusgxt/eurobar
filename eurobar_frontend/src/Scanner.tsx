import { useRef } from 'react';
import './App.css'
import { BrowserMultiFormatReader } from '@zxing/browser';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const handleTypeClick = () => {
    const input = window.prompt('Please enter the Barcode:');
    if (input !== null) {
      alert(`User input: ${input}`);
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

        codeReaderRef.current.decodeFromVideoElement(videoRef.current, (result, err) => {
          if (result) {
            alert(`Scanned Barcode: ${result.getText()}`);
            // Stop the video stream after successful scan
            stream.getTracks().forEach(track => track.stop());
            codeReaderRef.current?.reset();
          }
        });
      }
    } catch (err) {
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
