import { useEffect, useState, ChangeEvent, useRef } from 'react';
import { CurrencyDropdownComponent } from '../currency-dropdown/currency-dropdown-component';
import { UpholdConnectorService } from '@/services/uphold/uphold-connector.service';
import { Currency } from '../currency-utils';
import './currency-component.css';

interface CurrencyComponentProps {
  upholdService: UpholdConnectorService;
}

export const CurrencyComponent: React.FC<CurrencyComponentProps> = ({ upholdService }) => {
  const [ratesError, setRatesError] = useState(false);
  const [value, setValue] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | undefined>(undefined);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const mounted = useRef(true);

  const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value === '' ? 0 : Number(e.target.value));
  };

  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        const resp = await upholdService.getCurrencies();
        if (mounted.current) setCurrencies(resp);
      } catch (e) {
        if (mounted.current) setRatesError(true);
        console.error(e);
      }
    })();
    return () => {
      mounted.current = false;
    };
    // If upholdService is stable (same instance), [] is fine.
    // If parent recreates it each render, use [upholdService].
  }, [upholdService]);

  useEffect(() => {
    // if you want to see updates
    console.log('currencies updated', currencies);
  }, [currencies]);

  return (
    <div className="container">
      <div className="selector-container">
        <input
          className="amount-input"
          type="number"
          value={value}
          onChange={onValueChange}
        />
        <CurrencyDropdownComponent
          className="currency-dropdown"
          currencies={currencies}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
        />
        {ratesError && <div className="error">Failed to load currencies.</div>}
      </div>
    </div>
  );
};
