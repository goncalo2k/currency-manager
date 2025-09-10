import { useEffect, useState, ChangeEvent, useRef } from 'react';
import { CurrencyDropdownComponent } from '../currency-dropdown/currency-dropdown-component';
import { UpholdConnectorService } from '@/services/uphold/uphold-connector.service';
import {
  Currency,
  DropdownOption,
  exportAvailableFlags,
  populateDropdownOptions,
} from '../currency-utils';
import './currency-component.css';
import { CurrencyListContainerComponent } from '../currency-container/currency-container-component';

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
  }, [upholdService]);

  useEffect(() => {
    console.log('currencies updated', currencies);
  }, [currencies]);

  const flagMap = exportAvailableFlags();
  const { options, currencyMap }: { options: DropdownOption[]; currencyMap: Map<string, number> } =
    populateDropdownOptions(flagMap, currencies);

  return (
    <div className="container">
      <div className="selector-container">
        <input
          className="amount-input"
          type="number"
          value={value}
          onChange={onValueChange}
          onWheel={(e) => e.currentTarget.blur()}
        />
        <CurrencyDropdownComponent
          className="currency-dropdown"
          options={options}
          currencies={currencies}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          flagMap={flagMap}
        />
        {ratesError && <div className="error">Failed to load currencies.</div>}
      </div>
      <CurrencyListContainerComponent currencyMap={currencyMap} flagMap={flagMap} value={value} />
    </div>
  );
};
