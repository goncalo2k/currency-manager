import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import './index.css';
import { UpholdConnectorService } from './services/uphold/uphold-connector.service';
import { httpService } from './services/http/http-service';

const upholdService = new UpholdConnectorService();

function App() {
  const [user, setUser] = useState<any>(null);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Finish OAuth if we came back with ?code=...
  useEffect(() => {
    let url = new URL(window.location.href);
    let code = url.searchParams.get('code');
    let state = url.searchParams.get('state');
    console.log('paramState', state);
    console.log('sessionStorageState', sessionStorage.getItem('state'));
    if (code && state === sessionStorage.getItem('state')) {
      setLoading(true);
      upholdService
        .completeLogin(code)
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
    let currencies = await upholdService.getCurrencies();
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

/*   return (
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
            {currencies.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      )}
      <button onClick={getCurrencies}>Get currencies</button>
    </main>
  ); */
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {!user ? (
          <button onClick={signIn}>Sign in with upholdService</button>
        ) : (
          <>
            <p>Hi {user.firstName || user.username}</p>
            <button onClick={loadCurrencies} disabled={loading}>
              {loading ? 'Loading…' : 'Get currencies'}
            </button>
            <ul>
              {currencies.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="card">
        <button onClick={getCurrencies}>Get currencies</button>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
