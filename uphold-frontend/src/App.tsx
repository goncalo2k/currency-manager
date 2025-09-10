import { useEffect, useState } from 'react';
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
      <div className="page-container">
        <Header user={user} onSignIn={signIn} />
        <h1>Currency Converter</h1>
        <CurrencyComponent upholdService={upholdService} />
      </div>
    </>
  );
}

export default App;
