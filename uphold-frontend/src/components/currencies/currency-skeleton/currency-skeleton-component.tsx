import './currency-skeleton-component.css';

export const CurrencySkeletonComponent: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`entry-item-container ${className || ''}`}>
    <div className="currency-skeleton currency-skeleton-amount" />
    <div className="dropdown-list-item">
      <div className="currency-skeleton currency-skeleton-icon" />
      <div className="currency-skeleton currency-skeleton-code" />
    </div>
  </div>
);
