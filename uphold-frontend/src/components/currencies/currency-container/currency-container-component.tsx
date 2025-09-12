import { CurrencySkeletonComponent } from '../currency-skeleton/currency-skeleton-component';
import { Currency } from '../currency-utils';
import { IconComponent } from '../icon/icon-component';
import './currency-container-component.css';

interface CurrencyListContainerComponentProps {
  loading: boolean;
  currencyMap: Map<string, number>;
  flagMap: Map<string, string>;
  value: number;
  selectedCurrency?: Currency;
}

export const CurrencyListContainerComponent: React.FC<CurrencyListContainerComponentProps> = ({
  loading,
  currencyMap,
  flagMap,
  value,
  selectedCurrency,
}) => {
  const filteredEntries = Array.from(currencyMap.entries()).filter(
    ([code]) => code !== ((selectedCurrency && selectedCurrency.currency) || 'USD'),
  );

  return (
    <div className="entry-list-container">
      {loading &&
        Array(10)
          .fill(0)
          .map((_, idx) => <CurrencySkeletonComponent key={idx} />)}
      {!loading &&
        filteredEntries.map(([code, rate]) => {
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
