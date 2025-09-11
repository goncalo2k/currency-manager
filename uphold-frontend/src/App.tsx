import { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import { UpholdConnectorService } from './services/uphold/uphold-connector.service';
import { httpService } from './services/http/http-service';
import Header from './components/header/header-component';
import { CurrencyComponent } from './components/currencies/currency-component/currency-component';
import Footer from './components/footer/footer-component';

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
      <header>
        <Header user={user} onSignIn={signIn} />
      </header>
      <div className="page-container">
        <div className="content-container">
          <h1>Currency Converter</h1>
          <span className="description">
            Recieve competitive and transparent pricing with no hidden spreads. See how we compare.
          </span>
          <CurrencyComponent upholdService={upholdService} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
