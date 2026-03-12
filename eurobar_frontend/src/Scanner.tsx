import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserMultiFormatReader } from '@zxing/browser';
import type { ProductInfo } from './App';

function Scanner({ onProductInfo }: { onProductInfo: (info: ProductInfo) => void }) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showBarcodeInput, setShowBarcodeInput] = useState(false);

  const fetchAndSendProductInfo = async (barcode: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`http://localhost:8080/api/products/lookup/${encodeURIComponent(barcode)}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const product = await response.json();
        onProductInfo({
          countries: product.region || t('result.unknown'),
          brands: product.company || t('result.unknown'),
          barcode,
        });
      } else {
        onProductInfo({ countries: t('result.notFound'), brands: t('result.notFound'), barcode });
      }
    } catch {
      onProductInfo({ countries: t('result.fetchError'), brands: t('result.fetchError'), barcode });
    }
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = barcodeInput.trim();
    if (trimmed) {
      fetchAndSendProductInfo(trimmed);
      setShowBarcodeInput(false);
      setBarcodeInput('');
    }
  };

  const handleScanClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        if (!codeReaderRef.current) {
          codeReaderRef.current = new BrowserMultiFormatReader();
        }

        let scanned = false;

        codeReaderRef.current.decodeFromVideoElement(videoRef.current, (_result) => {
          if (_result && !scanned) {
            const barcode = _result.getText();
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
      onProductInfo({ countries: t('result.cameraError'), brands: t('result.cameraError'), barcode: '' });
    }
  };

  return (
    <>
      <div className="action-group">
        <button onClick={() => setShowBarcodeInput(prev => !prev)}>
          {t('scanner.typeBarcode')}
        </button>
        <button onClick={handleScanClick}>
          {t('scanner.scanBarcode')}
        </button>
      </div>

      {showBarcodeInput && (
        <div className="result-card">
          <form onSubmit={handleBarcodeSubmit} className="form-stack">
            <input
              type="text"
              className="input"
              placeholder={t('scanner.placeholder')}
              value={barcodeInput}
              onChange={e => setBarcodeInput(e.target.value)}
              autoFocus
            />
            <div className="form-actions">
              <button type="submit">{t('scanner.submit')}</button>
              <button type="button" onClick={() => { setShowBarcodeInput(false); setBarcodeInput(''); }}>
                {t('scanner.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      <video ref={videoRef} className="scanner-video" autoPlay playsInline />
    </>
  );
}

export default Scanner;
