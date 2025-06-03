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
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', width: '100%' }}>
              <strong>Countries:</strong>
              <input
                className="input"
                value={countryInput}
                onChange={e => setCountryInput(e.target.value)}
                required
                style={{ maxWidth: 120, padding: 12, border: 'none', borderRadius: 4, boxShadow: '2px 2px 7px 0 rgb(0,0,0,0.2)', outline: 'none', color: 'dimgray', background: 'white' }}
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', width: '100%' }}>
              <strong>Brands:</strong>
              <input
                className="input"
                value={brandInput}
                onChange={e => setBrandInput(e.target.value)}
                required
                style={{ maxWidth: 120, padding: 12, border: 'none', borderRadius: 4, boxShadow: '2px 2px 7px 0 rgb(0,0,0,0.2)', outline: 'none', color: 'dimgray', background: 'white' }}
              />
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default ScannedResult;
