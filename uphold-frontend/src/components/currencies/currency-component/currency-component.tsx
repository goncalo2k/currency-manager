import { useEffect, useState, ChangeEvent, useRef, useMemo } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | undefined>(undefined);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const mounted = useRef(true);
  const debounceTimer = useRef<number | null>(null);

  const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value === '' ? 0 : Number(e.target.value);
    setValue(Number.isFinite(next) ? next : 0);
  };

  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        setLoading(true);
        setRatesError(false);
        const resp = await upholdService.getCurrencies();
        if (mounted.current) setCurrencies(resp);
      } catch (e) {
        if (mounted.current) setRatesError(true);
        console.error(e);
      } finally {
        if (mounted.current) setLoading(false);
      }
    })();
    return () => {
      mounted.current = false;
    };
  }, [upholdService]);

  useEffect(() => {
    if (!mounted.current) return;
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    debounceTimer.current = window.setTimeout(async () => {
      try {
        setLoading(true);
        setRatesError(false);
        const resp = await upholdService.getCurrencies(selectedCurrency?.currency);
        if (mounted.current) setCurrencies(resp);
      } catch (e) {
        if (mounted.current) setRatesError(true);
        console.error(e);
      } finally {
        if (mounted.current) setLoading(false);
      }
    }, 50);
    return () => {
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
    };
  }, [selectedCurrency, upholdService]);

  const flagMap = exportAvailableFlags();
  const { options, currencyMap }: { options: DropdownOption[]; currencyMap: Map<string, number> } =
    populateDropdownOptions(flagMap, currencies);

  const filteredOptions = useMemo(
    () => options.filter(o => o.value !== selectedCurrency?.currency),
    [options, selectedCurrency]
  );


  return (
    <div className="container">
      {!loading && (
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
        </div>
      )}
      {!loading && (
        <CurrencyListContainerComponent
          currencyMap={currencyMap}
          flagMap={flagMap}
          value={value}
          selectedCurrency={selectedCurrency}
        />
      )}
      {loading && <div className="spinner">Loading…</div>}
      {ratesError && <div className="error">Failed to load currencies.</div>}
    </div>
  );
};
