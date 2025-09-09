import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ConfigService } from './services/config/config-service'
import { UpholdConnectorService } from './services/uphold/uphold-connector.service'
import { httpService } from './services/http/http-service'


const upholdService = new UpholdConnectorService();

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

  async function signIn() {
    window.location.href = await upholdService.getAuthorizeUrl();
  }

  async function getCurrencies() {
    //call
    let currencies = await httpService.get('https://api-sandbox.uphold.com/v0/assets');
    console.log(currencies);
    //setCurrencies();
  }
  async function loadCurrencies() {
    setLoading(true);
    try {
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
       <button onClick={getCurrencies}>Get currencies</button>
    </main>
  );
}

export default App
