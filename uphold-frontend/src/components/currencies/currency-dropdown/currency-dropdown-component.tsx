import { Dropdown } from 'primereact/dropdown';
import { IconComponent } from '../icon/icon-component';
import { Currency, DropdownOption } from '../utils/currency-utils';

import { useEffect, useRef } from 'react';
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
  options =
    options.length > 0
      ? options
      : [{ label: 'USD', value: 'USD', iconUrl: 'src/assets/USD@3x.png' }];
  const placeholder = options.find((opt) => opt.value === 'USD');
  const selectedValue = selectedCurrency?.currency ?? placeholder?.value;
  const dropdownRef = useRef<Dropdown>(null);

  const onChange = (code: string) => {
    const found = currencies.find((c) => c.currency === code);
    setSelectedCurrency(found);
  };

  useEffect(() => {
    const handleResize = () => {
      dropdownRef.current?.hide?.();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const itemTemplate = (opt: DropdownOption) => (
    <div className="dropdown-list-item">
      {opt.iconUrl ? <IconComponent src={opt.iconUrl} /> : null}
      <span>{opt.label}</span>
    </div>
  );

  const valueTemplate = (opt: DropdownOption | null) => {
    if (!opt) return <span>Select currency</span>;
    return (
      <div className="dropdown-list-item">
        {opt.iconUrl ? <IconComponent src={opt.iconUrl} /> : null}
        <span>{opt.label}</span>
      </div>
    );
  };

  return (
    <Dropdown
      ref={dropdownRef}
      panelClassName="currency-dropdown-panel"
      className={className}
      value={selectedValue}
      onChange={(e) => onChange(e.value)}
      options={options}
      itemTemplate={itemTemplate}
      valueTemplate={valueTemplate}
    />
  );
};
