import './App.css';
import { useState } from 'react';
import Scanner from './Scanner';
import ScannedResult from './ScannedResult';

function App() {
  const [showScanner, setShowScanner] = useState(false);
  const [productInfo, setProductInfo] = useState(null);

  const handleClick = () => {
    setShowScanner(true);
  };

  const handleProductInfo = (info) => {
    setProductInfo(info);
    setShowScanner(false);
  };

  if (showScanner) {
    return <Scanner onProductInfo={handleProductInfo} />;
  }

  if (productInfo) {
    return <ScannedResult info={productInfo} />;
  }

  return (
    <>
      <img src="/assets/europeLogo.png" alt="Eurobar Logo" style={{ width: '35%', marginTop: '-1500px' }} />
      <h1>
        Eurobar
      </h1>
      <button onClick={handleClick}>Click here to start</button>
      <p className="read-the-docs">
        Not official
      </p>
    </>
  );
}

export default App;
