import { Dropdown } from 'primereact/dropdown';
import { Currency } from '../currency-utils';

interface CurrencyDropdownProps {
  className: string;
  currencies: Currency[];
  selectedCurrency: Currency | undefined;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<Currency | undefined>>;
}

export const CurrencyDropdownComponent: React.FC<CurrencyDropdownProps> = ({
  className,
  currencies,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const handleChange = (currency: Currency) => {
    setSelectedCurrency(currency);
  };

  return (
    <Dropdown
      className={className}
      value={selectedCurrency}
      onChange={(e) => handleChange(e.value)}
      options={currencies}
      optionLabel="name"
      placeholder="USD"
    />
  );
};
