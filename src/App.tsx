import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ConfigService } from './services/config-service'
import { UpholdConnectorService } from './services/uphold-connector.service'

const cfgService = new ConfigService();
const upholdService = new UpholdConnectorService(cfgService);

function App() {
  const [user, setUser] = useState<any>(null);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Finish OAuth if we came back with ?code=...
  useEffect(() => {
    var url = new URL(window.location.href);
    var code = url.searchParams.get('code');
    if (code) {
      setLoading(true);
      upholdService.completeLogin(code)
        .then(setUser)
        .finally(() => {
          setLoading(false);
          // clean the URL
          window.history.replaceState({}, document.title, '/');
        });
    }
  }, []);

  function signIn() {
    window.location.href = upholdService.getAuthorizeUrl();
  }

  async function loadCurrencies() {
    setLoading(true);
    try {
      var list = await upholdService.getCurrenciesFromTicker();
      setCurrencies(list);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>upholdService demo</h1>
      {!user ? (
        <button onClick={signIn}>Sign in with upholdService</button>
      ) : (
        <>
          <p>Hi {user.firstName || user.username}</p>
          <button onClick={loadCurrencies} disabled={loading}>
            {loading ? 'Loading…' : 'Get currencies'}
          </button>
          <ul>
            {currencies.map(c => <li key={c}>{c}</li>)}
          </ul>
        </>
      )}
    </main>
  );
}

export default App
