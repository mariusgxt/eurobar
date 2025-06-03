import './App.css';
import { useState } from 'react';

// Only one component: ScannedResult, which takes info as prop
function ScannedResult({ info }: { info: { countries: string, brands: string, barcode: string } }) {
  const [showForm, setShowForm] = useState(false);
  const [countryInput, setCountryInput] = useState('');
  const [brandInput, setBrandInput] = useState('');
  const isMissing = (info.countries === 'Not found' || info.countries === 'Unknown' || info.brands === 'Not found' || info.brands === 'Unknown');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({          barcode: Number(info.barcode),
          region: countryInput,
          company: brandInput
        })
      });
      if (response.ok) {
        alert("Thank you! Product added to the database.");
      } else {
        const errorText = await response.text();
        alert("Failed to add product: " + errorText);
      }
    } catch (err) {
      alert("Network error: " + err);
    }
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
