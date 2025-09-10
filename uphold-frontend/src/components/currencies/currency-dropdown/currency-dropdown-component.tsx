import { Dropdown } from 'primereact/dropdown';
import { Currency, exportAvailableFlags, populateDropdownOptions, DropdownOption } from '../currency-utils';
import { IconComponent } from '../icon/icon-component';

interface CurrencyDropdownProps {
  className: string;
  currencies: Currency[];
  selectedCurrency: Currency | undefined;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<Currency | undefined>>;
}

const flagMap = exportAvailableFlags();

export const CurrencyDropdownComponent: React.FC<CurrencyDropdownProps> = ({
  className,
  currencies,
  selectedCurrency,
  setSelectedCurrency,
}) => {

  const options: DropdownOption[] = populateDropdownOptions(flagMap, currencies);

  // PrimeReact wants the "value" prop to match optionValue ("value" field).
  const selectedValue = selectedCurrency?.currency ?? null;

  const onChange = (code: string) => {
    const found = currencies.find((c) => c.currency === code);
    setSelectedCurrency(found);
  };

  const itemTemplate = (opt: DropdownOption) => (
    <div className="flex items-center gap-2">
      {opt.iconUrl ? <IconComponent src={opt.iconUrl} /> : null}
      <span>{opt.label}</span>
    </div>
  );

  const valueTemplate = (opt: DropdownOption | null) => {
    if (!opt) return <span className="opacity-60">Select currency</span>;
    return (
      <div className="flex items-center gap-2">
        {opt.iconUrl ? <IconComponent src={opt.iconUrl} /> : null}
        <span>{opt.label}</span>
      </div>
    );
  };

  return (
    <Dropdown
      className={className}
      value={selectedValue}                 // string like "USD"
      onChange={(e) => onChange(e.value)}  // e.value is the string because of optionValue
      options={options}
      optionLabel="label"                  // <- correct field
      optionValue="value"                  // <- match value to a string code
      placeholder="USD"
      itemTemplate={itemTemplate}
      valueTemplate={valueTemplate}
      filter
    />
  );
};
  