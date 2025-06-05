import './App.css';
import { useState } from 'react';

function ScannedResult({ info }: { info: { countries: string, brands: string, barcode: string } }) {
  const [showForm, setShowForm] = useState(false);
  const [countryInput, setCountryInput] = useState('');
  const [brandInput, setBrandInput] = useState('');
  const [failedBrandLogos, setFailedBrandLogos] = useState<Record<string, boolean>>({});
  const isMissing = (info.countries === 'Not found' || info.countries === 'Unknown' || info.brands === 'Not found' || info.brands === 'Unknown');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode: info.barcode,
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

  // Add a mapping from country names to ISO 3166-1 alpha-2 codes
  const countryNameToCode: Record<string, string> = {
    'Afghanistan': 'AF',
    'Albania': 'AL',
    'Algeria': 'DZ',
    'Andorra': 'AD',
    'Angola': 'AO',
    'Antigua': 'AG',
    'Argentina': 'AR',
    'Armenia': 'AM',
    'Australia': 'AU',
    'Austria': 'AT',
    'Azerbaijan': 'AZ',
    'Bahamas': 'BS',
    'Bahrain': 'BH',
    'Bangladesh': 'BD',
    'Barbados': 'BB',
    'Belarus': 'BY',
    'Belgium': 'BE',
    'Belize': 'BZ',
    'Benin': 'BJ',
    'Bhutan': 'BT',
    'Bolivia': 'BO',
    'Bosnia': 'BA',
    'Botswana': 'BW',
    'Brazil': 'BR',
    'Brunei': 'BN',
    'Bulgaria': 'BG',
    'Burkina': 'BF',
    'Burundi': 'BI',
    'Cambodia': 'KH',
    'Cameroon': 'CM',
    'Canada': 'CA',
    'Cape Verde': 'CV',
    'Central African Republic': 'CF',
    'Chad': 'TD',
    'Chile': 'CL',
    'China': 'CN',
    'Colombia': 'CO',
    'Comoros': 'KM',
    'Congo': 'CG',
    'Congo (Democratic Republic)': 'CD',
    'Costa Rica': 'CR',
    'Croatia': 'HR',
    'Cuba': 'CU',
    'Cyprus': 'CY',
    'Czechia': 'CZ',
    'Denmark': 'DK',
    'Djibouti': 'DJ',
    'Dominica': 'DM',
    'Dominican Republic': 'DO',
    'Ecuador': 'EC',
    'Egypt': 'EG',
    'El Salvador': 'SV',
    'Equatorial Guinea': 'GQ',
    'Eritrea': 'ER',
    'Estonia': 'EE',
    'Eswatini': 'SZ',
    'Ethiopia': 'ET',
    'Fiji': 'FJ',
    'Finland': 'FI',
    'France': 'FR',
    'Gabon': 'GA',
    'Gambia': 'GM',
    'Georgia': 'GE',
    'Germany': 'DE',
    'Ghana': 'GH',
    'Greece': 'GR',
    'Grenada': 'GD',
    'Guatemala': 'GT',
    'Guinea': 'GN',
    'Guinea-Bissau': 'GW',
    'Guyana': 'GY',
    'Haiti': 'HT',
    'Honduras': 'HN',
    'Hungary': 'HU',
    'Iceland': 'IS',
    'India': 'IN',
    'Indonesia': 'ID',
    'Iran': 'IR',
    'Iraq': 'IQ',
    'Ireland': 'IE',
    'Israel': 'IL',
    'Italy': 'IT',
    'Jamaica': 'JM',
    'Japan': 'JP',
    'Jordan': 'JO',
    'Kazakhstan': 'KZ',
    'Kenya': 'KE',
    'Kiribati': 'KI',
    'Korea': 'KR',
    'Kuwait': 'KW',
    'Kyrgyzstan': 'KG',
    'Laos': 'LA',
    'Latvia': 'LV',
    'Lebanon': 'LB',
    'Lesotho': 'LS',
    'Liberia': 'LR',
    'Libya': 'LY',
    'Liechtenstein': 'LI',
    'Lithuania': 'LT',
    'Luxembourg': 'LU',
    'Madagascar': 'MG',
    'Malawi': 'MW',
    'Malaysia': 'MY',
    'Maldives': 'MV',
    'Mali': 'ML',
    'Malta': 'MT',
    'Marshall': 'MH',
    'Mauritania': 'MR',
    'Mauritius': 'MU',
    'Mexico': 'MX',
    'Micronesia': 'FM',
    'Moldova': 'MD',
    'Monaco': 'MC',
    'Mongolia': 'MN',
    'Montenegro': 'ME',
    'Morocco': 'MA',
    'Mozambique': 'MZ',
    'Myanmar': 'MM',
    'Namibia': 'NA',
    'Nauru': 'NR',
    'Nepal': 'NP',
    'Netherlands': 'NL',
    'New Zealand': 'NZ',
    'Nicaragua': 'NI',
    'Niger': 'NE',
    'Nigeria': 'NG',
    'North Macedonia': 'MK',
    'Norway': 'NO',
    'Oman': 'OM',
    'Pakistan': 'PK',
    'Palau': 'PW',
    'Panama': 'PA',
    'Papua New Guinea': 'PG',
    'Paraguay': 'PY',
    'Peru': 'PE',
    'Philippines': 'PH',
    'Poland': 'PL',
    'Portugal': 'PT',
    'Qatar': 'QA',
    'Romania': 'RO',
    'Russia': 'RU',
    'Rwanda': 'RW',
    'Saint Kitts and Nevis': 'KN',
    'Saint Lucia': 'LC',
    'Saint Vincent and the Grenadines': 'VC',
    'Samoa': 'WS',
    'San Marino': 'SM',
    'Sao Tome and Principe': 'ST',
    'Saudi Arabia': 'SA',
    'Senegal': 'SN',
    'Serbia': 'RS',
    'Seychelles': 'SC',
    'Sierra Leone': 'SL',
    'Singapore': 'SG',
    'Slovakia': 'SK',
    'Slovenia': 'SI',
    'Solomon': 'SB',
    'Somalia': 'SO',
    'South Africa': 'ZA',
    'South Sudan': 'SS',
    'Spain': 'ES',
    'Sri Lanka': 'LK',
    'Sudan': 'SD',
    'Suriname': 'SR',
    'Sweden': 'SE',
    'Switzerland': 'CH',
    'Syria': 'SY',
    'Taiwan': 'TW',
    'Tajikistan': 'TJ',
    'Tanzania': 'TZ',
    'Thailand': 'TH',
    'Togo': 'TG',
    'Tonga': 'TO',
    'Trinidad': 'TT',
    'Tunisia': 'TN',
    'Turkey': 'TR',
    'Turkmenistan': 'TM',
    'Tuvalu': 'TV',
    'Uganda': 'UG',
    'Ukraine': 'UA',
    'United Arab Emirates': 'AE',
    'United Kingdom': 'GB',
    'United States': 'US',
    'Uruguay': 'UY',
    'Uzbekistan': 'UZ',
    'Vanuatu': 'VU',
    'Vatican': 'VA',
    'Venezuela': 'VE',
    'Vietnam': 'VN',
    'Yemen': 'YE',
    'Zambia': 'ZM',
    'Zimbabwe': 'ZW',
    // French/other variants for Open Food Facts
    'Albanie': 'AL',
    'Australie': 'AU',
    'Bulgarie': 'BG',
    'Égypte': 'EG',
    'Inde': 'IN',
    'Irlande': 'IE',
    'Maroc': 'MA',
    'Tunisie': 'TN',
    'Royaume-Uni': 'GB',
    'États-Unis': 'US',
    // Add more as needed
  };

  // Add a mapping from brand names to their domains
  const brandNameToDomain: Record<string, string> = {
    'Coca-Cola': 'coca-cola.com',
    'Pepsi': 'pepsi.com',
    'Nestle': 'nestle.com',
    'Heineken': 'heineken.com',
    'Unilever': 'unilever.com',
    'Danone': 'danone.com',
    'Ferrero': 'ferrero.com',
    'Red Bull': 'redbull.com',
    // Add more as needed
  };

  function getCountryFlag(country: string) {
    const trimmed = country.trim();
    // If already a 2-letter code, use it directly (case-insensitive)
    if (/^[A-Za-z]{2}$/.test(trimmed)) {
      const upper = trimmed.toUpperCase();
      return (
        <img
          src={`https://flagsapi.com/${upper}/flat/32.png`}
          alt={`${upper} flag`}
          style={{ marginLeft: 8, verticalAlign: 'middle', borderRadius: 4, boxShadow: '1px 1px 4px 0 rgb(0,0,0,0.1)' }}
          width={32}
          height={24}
        />
      );
    }
    // Otherwise, try to map from name
    const code = countryNameToCode[trimmed];
    if (!code) return null;
    return (
      <img
        src={`https://flagsapi.com/${code}/flat/32.png`}
        alt={`${trimmed} flag`}
        style={{ marginLeft: 8, verticalAlign: 'middle', borderRadius: 4, boxShadow: '1px 1px 4px 0 rgb(0,0,0,0.1)' }}
        width={32}
        height={24}
      />
    );
  }

  function getBrandLogo(brand: string) {
    const trimmed = brand.trim();
    // Don't render logo for unknown, X, or similar error values
    if (!brand || failedBrandLogos[trimmed] || /^(unknown|not found|x)$/i.test(trimmed)) return null;
    let domain = brandNameToDomain[trimmed];
    if (!domain) {
      domain = trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        + '.com';
    }
    return (
      <img
        src={`https://cdn.brandfetch.io/${domain}/w/400/h/400?c=1idLurZJMutASPdK58u`}
        alt="Logos by Brandfetch"
        style={{ marginLeft: 8, verticalAlign: 'middle', width: 32, height: 32, borderRadius: 4, boxShadow: '1px 1px 4px 0 rgb(0,0,0,0.1)' }}
        onError={() => setFailedBrandLogos(prev => ({ ...prev, [trimmed]: true }))}
      />
    );
  }

  return (
    <>
      <img src="/assets/europeLogo.png" alt="Eurobar Logo" style={{ width: '35%', marginTop: '-1500px' }} />
      <h1>
        EuroBar
      </h1>
      <div className="result-card">
        <h2>Scan Result</h2>
        <p><strong>Barcode:</strong> {info.barcode}</p>
        <p><strong>Countries: </strong> {
          info.countries.split(',').map((country, idx) => (
            <span key={country.trim()} style={{ display: 'inline-flex', alignItems: 'center', marginRight: 8, marginBottom: 4 }}>
              {country.trim()}
              {getCountryFlag(country)}
              {idx < info.countries.split(',').length - 1 && <span style={{ margin: '0 4px' }}>|</span>}
            </span>
          ))
        }</p>
        <p><strong>Brands:</strong> {info.brands}
          {getBrandLogo(info.brands)}
        </p>
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
