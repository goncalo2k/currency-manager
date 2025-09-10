import { SetStateAction, useState } from 'react';
import { CurrencyDropdownComponent } from '../currency-dropdown/currency-dropdown-component';
import { UpholdConnectorService } from '@/services/uphold/uphold-connector.service';
import { Currency } from '../currency-utils';
import './currency-component.css';

interface CurrencyComponentProps {
  upholdService: UpholdConnectorService;
}
export const CurrencyComponent: React.FC<CurrencyComponentProps> = ({ upholdService }) => {
  const [ratesError, setRatesError] = useState(false);
  const [value, setValue] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | undefined>(undefined);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  async function getCurrencies(): Promise<any> {
    //call
    let currencies = await upholdService.getCurrencies();
    console.log(currencies);
    setCurrencies(currencies.result);
    return currencies;
  }

  function onValueChange(event: any): void {}
  getCurrencies();
  return (
    <>
      <div className="container">
        <div className="selector-container">
          <input
            className="amount-input"
            type="number"
            aria-label="Please select your currency"
            value={value}
            defaultValue={0}
            onChange={onValueChange}
          />
          <CurrencyDropdownComponent
            className="currency-dropdown"
            currencies={currencies}
            selectedCurrency={undefined}
            setSelectedCurrency={setSelectedCurrency}
          />
        </div>
      </div>
    </>
  );
};
