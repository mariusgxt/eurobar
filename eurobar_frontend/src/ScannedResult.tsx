import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { countryNameToCode, brandNameToDomain } from './countryData';
import type { ProductInfo } from './App';

function ScannedResult({ info }: { info: ProductInfo }) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [countryInput, setCountryInput] = useState('');
  const [brandInput, setBrandInput] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [failedBrandLogos, setFailedBrandLogos] = useState<Record<string, boolean>>({});

  const isMissing =
    !info.countries || !info.brands ||
    /not found|unknown|nicht gefunden|unbekannt/i.test(info.countries) ||
    /not found|unknown|nicht gefunden|unbekannt/i.test(info.brands);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaveError('');
    try {
      const api = import.meta.env.VITE_API_URL || '';
      const bytes = new TextEncoder().encode(`${username}:${password}`);
      const authorization = `Basic ${btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''))}`;
      const tokenResponse = await fetch(`${api}/api/csrf`, { credentials: 'include', headers: { Authorization: authorization } });
      if (!tokenResponse.ok) throw new Error(t('result.signInFailed'));
      const csrf = await tokenResponse.json();
      const response = await fetch(`${api}/api/products`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Authorization: authorization, [csrf.headerName]: csrf.token },
        body: JSON.stringify({
          barcode: info.barcode,
          region: countryInput,
          company: brandInput,
        }),
      });
      if (response.ok) {
        alert(t('result.thankYou'));
        setShowForm(false);
      } else {
        throw new Error(response.status === 401 ? t('result.signInFailed') : t('result.saveFailed'));
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t('result.saveFailed'));
    } finally {
      setPassword('');
      setSaving(false);
    }
  };

  function getCountryFlag(country: string) {
    const trimmed = country.trim();
    let code: string | undefined;

    if (/^[A-Za-z]{2}$/.test(trimmed)) {
      code = trimmed.toUpperCase();
    } else {
      code = countryNameToCode[trimmed];
    }

    if (!code) return null;

    return (
      <img
        src={`https://flagsapi.com/${code}/flat/32.png`}
        alt={`${trimmed} flag`}
        className="country-flag"
      />
    );
  }

  function getBrandLogo(brand: string) {
    const trimmed = brand.trim();
    if (!trimmed || failedBrandLogos[trimmed] || /^(unknown|not found|unbekannt|nicht gefunden)$/i.test(trimmed)) {
      return null;
    }

    let domain = brandNameToDomain[trimmed];
    if (!domain) {
      domain = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '.com';
    }

    return (
      <img
        src={`https://cdn.brandfetch.io/${domain}/w/400/h/400?c=1idLurZJMutASPdK58u`}
        alt={`${trimmed} logo`}
        className="brand-logo"
        onError={() => setFailedBrandLogos(prev => ({ ...prev, [trimmed]: true }))}
      />
    );
  }

  const countries = info.countries.split(',').map(c => c.trim()).filter(Boolean);

  return (
    <div className="result-card">
      <h2>{t('result.heading')}</h2>

      <div className="result-row">
        <strong>{t('result.barcode')}:</strong> {info.barcode}
      </div>

      <div className="result-row">
        <strong>{t('result.countries')}:</strong>
        {countries.map((country, idx) => (
          <span key={`${country}-${idx}`} className="country-chip">
            {country}
            {getCountryFlag(country)}
          </span>
        ))}
      </div>

      <div className="result-row">
        <strong>{t('result.brands')}:</strong>
        {info.brands}
        {getBrandLogo(info.brands)}
      </div>

      {isMissing && !showForm && (
        <button style={{ marginTop: '1rem' }} onClick={() => setShowForm(true)}>
          {t('result.addMissing')}
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-stack">
          <p>{t('result.accountRequired')}</p>
          <label className="form-field">{t('result.username')}
            <input className="input" autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required pattern="[^:]+" />
          </label>
          <label className="form-field">{t('result.password')}
            <input className="input" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>
          {saveError && <p role="alert">{saveError}</p>}
          <div className="form-field">
            <strong>{t('result.countries')}:</strong>
            <input
              className="input"
              value={countryInput}
              onChange={e => setCountryInput(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <strong>{t('result.brands')}:</strong>
            <input
              className="input"
              value={brandInput}
              onChange={e => setBrandInput(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={saving}>{t('scanner.submit')}</button>
            <button type="button" disabled={saving} onClick={() => { setPassword(''); setShowForm(false); }}>{t('scanner.cancel')}</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ScannedResult;
