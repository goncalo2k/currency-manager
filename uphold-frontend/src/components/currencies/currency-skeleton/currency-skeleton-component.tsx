import './currency-skeleton-component.css';

export const CurrencySkeletonComponent: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={`currency-skeleton ${className}`} />;
};
