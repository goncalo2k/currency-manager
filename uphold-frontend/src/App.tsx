import { useEffect, useState } from 'react';
import './App.css';
import { CurrencyComponent } from './components/currencies/currency-component/currency-component';
import Footer from './components/footer/footer-component';
import Header from './components/header/header-component';
import MobileHeader from './components/mobile-header/mobile-header';
import './index.css';
import { UpholdConnectorService } from './services/uphold/uphold-connector.service';

const upholdService = new UpholdConnectorService();

function App() {
  const [user, setUser] = useState<unknown>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
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
        <MobileHeader />
      </header>
      <div className="page-container">
        <div className="content-container">
          <h1 className="title">Currency Converter</h1>
          <span className="description">
            Receive competitive and transparent pricing with no hidden spreads. See how we compare.
          </span>
          <CurrencyComponent upholdService={upholdService} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
