import { Dropdown } from 'primereact/dropdown';
import { Currency, DropdownOption } from '../currency-utils';
import { IconComponent } from '../icon/icon-component';

import './currency-dropdown-component.css';

interface CurrencyDropdownProps {
  className: string;
  options: DropdownOption[];
  currencies: Currency[];
  selectedCurrency: Currency | undefined;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<Currency | undefined>>;
  flagMap: Map<string, string>;
}

export const CurrencyDropdownComponent: React.FC<CurrencyDropdownProps> = ({
  className,
  options,
  currencies,
  selectedCurrency,
  setSelectedCurrency,
}) => {
  const onChange = (code: string) => {
    const found = currencies.find((c) => c.currency === code);
    setSelectedCurrency(found);
  };

  const itemTemplate = (opt: DropdownOption) => (
    <div className="dropdown-list-item">
      {opt.iconUrl ? <IconComponent src={opt.iconUrl} /> : null}
      <span>{opt.label}</span>
    </div>
  );

  const valueTemplate = (opt: DropdownOption | null) => {
    if (!opt) return <span className="opacity-60">Select currency</span>;
    return (
      <div className="dropdown-list-item">
        {opt.iconUrl ? <IconComponent src={opt.iconUrl} /> : null}
        <span>{opt.label}</span>
      </div>
    );
  };

  const placeholder = options.find((opt) => opt.value === 'USD');
  const selectedValue = selectedCurrency?.currency ?? placeholder?.value;
  return (
    <Dropdown
      panelClassName="currency-dropdown-panel"
      className={className}
      value={selectedValue}
      onChange={(e) => onChange(e.value)}
      options={options}
      itemTemplate={itemTemplate}
      valueTemplate={valueTemplate}
      filter
    />
  );
};
