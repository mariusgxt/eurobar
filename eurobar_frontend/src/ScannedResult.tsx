import './App.css'
import { useState } from 'react';
import Scanner from './Scanner';

function App() {
  const [showScanner, setShowScanner] = useState(false);
  const [result, setResult] = useState<{ countries: string, brands: string, barcode: string } | null>(null);

  const handleClick = () => {
    setShowScanner(true);
    setResult(null);
  };

  const handleProductInfo = (info: { countries: string, brands: string, barcode: string }) => {
    setResult(info);
    setShowScanner(false);
  };

  if (showScanner) {
    return <Scanner onProductInfo={handleProductInfo} />;
  }

  return (
    <>
      <img src="/assets/europeLogo.png" alt="Eurobar Logo" style={{ width: '35%', marginTop: '-1500px' }} />
      <h1>
        Eurobar
      </h1>
      {result && (
        <div className="result-card">
          <h2>Scan Result</h2>
          <p><strong>Barcode:</strong> {result.barcode}</p>
          <p><strong>Countries:</strong> {result.countries}</p>
          <p><strong>Brands:</strong> {result.brands}</p>
        </div>
      )}
      
      <button onClick={handleClick}>Click here to Scan again</button>
    </>
  )
}

export default App
