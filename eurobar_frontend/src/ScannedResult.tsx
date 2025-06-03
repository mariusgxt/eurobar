import './App.css';
import { useState } from 'react';

// Only one component: ScannedResult, which takes info as prop
function ScannedResult({ info }: { info: { countries: string, brands: string, barcode: string } }) {
  const [showForm, setShowForm] = useState(false);
  const [countryInput, setCountryInput] = useState('');
  const [brandInput, setBrandInput] = useState('');
  const isMissing = (info.countries === 'Not found' || info.countries === 'Unknown' || info.brands === 'Not found' || info.brands === 'Unknown');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you could send the data to a backend or show a confirmation
    alert(`Thank you!\nBarcode: ${info.barcode}\nCountry: ${countryInput}\nBrand: ${brandInput}`);
    setShowForm(false);
  };

  return (
    <>
      <img src="/assets/europeLogo.png" alt="Eurobar Logo" style={{ width: '35%', marginTop: '-1500px' }} />
      <h1>
        EuroBar
      </h1>
      <div className="result-card">
        <h2>Scan Result</h2>
        <p><strong>Barcode:</strong> {info.barcode}</p>
        <p><strong>Countries:</strong> {info.countries}</p>
        <p><strong>Brands:</strong> {info.brands}</p>
        {isMissing && !showForm && (
          <button style={{ marginTop: '1rem' }} onClick={() => setShowForm(true)}>
            Add missing information
          </button>
        )}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label>
              Country:
              <input value={countryInput} onChange={e => setCountryInput(e.target.value)} required />
            </label>
            <label>
              Brand:
              <input value={brandInput} onChange={e => setBrandInput(e.target.value)} required />
            </label>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        )}
      </div>
    </>
  );
}

export default ScannedResult;
