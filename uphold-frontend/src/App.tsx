import { useEffect, useState } from 'react';
import upholdLogo from './assets/small-logo.svg';
import viteLogo from '/vite.svg';
import './App.css';
import './index.css';
import { UpholdConnectorService } from './services/uphold/uphold-connector.service';
import { httpService } from './services/http/http-service';
import Header from './components/header/header-component';
import { CurrencyComponent } from './components/currencies/currency-component/currency-component';

const upholdService = new UpholdConnectorService();

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let url = new URL(window.location.href);
    let code = url.searchParams.get('code');
    let state = url.searchParams.get('state');
    console.log('paramState', state);
    console.log('sessionStorageState', sessionStorage.getItem('state'));
    if (code && state === sessionStorage.getItem('state')) {
      setLoading(true);
      upholdService.completeLogin(code).then(setUser);

      if (user) {
        setLoading(false);
        window.history.replaceState({}, document.title, '/');
      }
    }
  }, []);

  async function signIn() {
    window.location.href = await upholdService.getAuthorizeUrl();
  }

  return (
    <>
      <Header user={user} onSignIn={signIn} />
      <div className="logo-container">
        <a href="https://uphold.com" target="_blank">
          <img src={upholdLogo} className="logo uphold" alt="Uphold logo" />
        </a>
      </div>
      <h1>Uphold Currency Manager</h1>
      <CurrencyComponent upholdService={upholdService} />
    </>
  );
}

export default App;
