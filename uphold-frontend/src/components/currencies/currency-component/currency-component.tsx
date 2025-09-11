import { UpholdConnectorService } from '@/services/uphold/uphold-connector.service';
import { useEffect, useRef, useState } from 'react';
import { CurrencyListContainerComponent } from '../currency-container/currency-container-component';
import { CurrencyDropdownComponent } from '../currency-dropdown/currency-dropdown-component';
import {
  Currency,
  DropdownOption,
  exportAvailableFlags,
  populateDropdownOptions,
} from '../currency-utils';
import './currency-component.css';

interface CurrencyComponentProps {
  upholdService: UpholdConnectorService;
}

export const CurrencyComponent: React.FC<CurrencyComponentProps> = ({ upholdService }) => {
  const [ratesError, setRatesError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<number>(0);
  const [amountStr, setAmountStr] = useState<string>('0');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | undefined>(undefined);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const mounted = useRef(true);
  const debounceTimer = useRef<number | null>(null);

  function formatTyping(s: string, locale = 'en-US') {
    const cleaned = s.replace(/[^\d]/g, '');
    const num = Number(cleaned || '0');
    const nf = new Intl.NumberFormat(locale);
    return { display: cleaned ? nf.format(num) : '0', num };
  }

  function formatFinal(n: number, locale = 'en-US') {
    const nf = new Intl.NumberFormat(locale);
    return nf.format(n);
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { display, num } = formatTyping(e.target.value);
    setAmountStr(display);
    setValue(num);
  };

  const onInputFocus = () => {
    if (value === 0) setAmountStr('');
  };

  const onInputBlur = () => {
    setAmountStr(value === 0 ? '0' : formatFinal(value));
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

  const hasAmount = value > 0;

  return (
    <div className="container">
      {
        <div className="selector-container">
          <input
            className="amount-input"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            placeholder="0"
            value={amountStr}
            onChange={onInputChange}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            onWheel={(e) => e.currentTarget.blur()}
            autoComplete="off"
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
      }
      {hasAmount && (
        <CurrencyListContainerComponent
          currencyMap={currencyMap}
          flagMap={flagMap}
          value={value}
          selectedCurrency={selectedCurrency}
        />
      )}
      {!hasAmount && <span>Enter an amount to check the rates.</span>}
      {loading && hasAmount && <div className="spinner">Loading…</div>}
      {ratesError && <div className="error">Failed to load currencies.</div>}
    </div>
  );
};
