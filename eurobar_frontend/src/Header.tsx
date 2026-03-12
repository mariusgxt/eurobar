import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', flag: '🇬🇧' },
  { code: 'de', flag: '🇩🇪' },
];

function Header() {
  const { t, i18n } = useTranslation();

  return (
    <header className="app-header">
      <div className="lang-switcher">
        {LANGUAGES.map(({ code, flag }) => (
          <button
            key={code}
            className={`lang-btn${i18n.language.startsWith(code) ? ' active' : ''}`}
            onClick={() => i18n.changeLanguage(code)}
            aria-label={t(`language.${code}`)}
          >
            {flag}
          </button>
        ))}
      </div>
      <img
        src="/assets/europeLogo.png"
        alt="Eurobar Logo"
        className="app-logo"
      />
      <h1>{t('app.title')}</h1>
      <p className="app-subtitle">{t('app.subtitle')}</p>
    </header>
  );
}

export default Header;
