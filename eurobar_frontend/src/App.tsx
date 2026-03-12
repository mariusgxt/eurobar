import './App.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Scanner from './Scanner';
import ScannedResult from './ScannedResult';

export interface ProductInfo {
  countries: string;
  brands: string;
  barcode: string;
}

function App() {
  const { t } = useTranslation();
  const [showScanner, setShowScanner] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);

  const handleStart = () => {
    setShowScanner(true);
    setProductInfo(null);
  };

  const handleProductInfo = (info: ProductInfo) => {
    setProductInfo(info);
    setShowScanner(false);
  };

  if (showScanner) {
    return (
      <>
        <Header />
        <Scanner onProductInfo={handleProductInfo} />
      </>
    );
  }

  if (productInfo) {
    return (
      <>
        <Header />
        <ScannedResult info={productInfo} />
        <div className="action-group">
          <button onClick={handleStart}>{t('result.scanAgain')}</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="action-group">
        <button onClick={handleStart}>{t('home.startButton')}</button>
      </div>
    </>
  );
}

export default App;
