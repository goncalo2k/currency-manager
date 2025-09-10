import { ReactNode } from 'react';

export interface Currency {
  value?: number;
  ask: number;
  bid: number;
  currency: string;
  pair: string;
}

export interface DropdownOption {
  label: string;
  value: string;
  className?: string;
  icon?: ReactNode;
  iconUrl?: string;
  title?: string;
  disabled?: boolean;
}

const flagUrls = import.meta.glob('/src/assets/*@3x.png', {
  eager: true,
  as: 'url',
}) as Record<string, string>;

export function exportAvailableFlags(): Map<string, string> {
  const map = new Map<string, string>();
  for (const path in flagUrls) {
    const m = path.match(/\/([A-Z]{3})@3x\.png$/);
    if (m && !map.get(m[1])) map.set(m[1], flagUrls[path]);
  }
  return map;
}

export function mapCurrencyToDropdownOption(
  flagMap: Map<string, string>,
  currency: Currency,
): DropdownOption {
  const iconUrl = flagMap.get(currency.currency) || '';
  return {
    value: currency.currency,
    title: currency.currency,
    label: currency.currency,
    disabled: false,
    iconUrl,
  };
}

export function populateDropdownOptions(
  flagMap: Map<string, string>,
  currencies: Currency[],
): { options: DropdownOption[]; currencyMap: Map<string, number> } {
  const seen = new Set<string>();
  const currencyMap = new Map<string, number>();
  const options: DropdownOption[] = [];

  for (const c of currencies) {
    const code = (c.currency || '').toUpperCase();
    if (!code) continue;
    if (!flagMap.has(code)) continue;
    if (seen.has(code)) continue;

    seen.add(code);
    currencyMap.set(c.currency, c.bid);
    options.push(mapCurrencyToDropdownOption(flagMap, { ...c, currency: code }));
  }

  return { options, currencyMap };
}
