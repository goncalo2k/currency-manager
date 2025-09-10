import { Currency } from '../currency-utils';
import { IconComponent } from '../icon/icon-component';
import './currency-container-component.css';

interface CurrencyListContainerComponentProps {
  currencyMap: Map<string, number>;
  flagMap: Map<string, string>;
  value: number;
  selectedCurrency?: Currency;
}

export const CurrencyListContainerComponent: React.FC<CurrencyListContainerComponentProps> = ({
  currencyMap,
  flagMap,
  value,
  selectedCurrency,
}) => {
  return (
    <div className="entry-list-container">
      {Array.from(currencyMap.entries())
        .filter(([code]) => code !== (selectedCurrency && selectedCurrency.currency || 'USD'))
        .map(([code, rate]) => {
          const amount = value * rate;
          const flagUrl = flagMap.get(code);
          return (
            <div key={code} className="entry-item-container">
              <span>{amount.toFixed(6)}</span>
              <div className="dropdown-list-item">
                <span className="flag">{flagUrl ? <IconComponent src={flagUrl} /> : null}</span>
                <span>{code}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};
