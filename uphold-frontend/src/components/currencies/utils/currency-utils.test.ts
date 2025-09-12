import { describe, expect, it } from 'vitest';
import {
  Currency,
  exportAvailableFlags,
  mapCurrencyToDropdownOption,
  populateDropdownOptions,
} from './currency-utils';

describe('mapCurrencyToDropdownOption', () => {
  it('maps a currency to a dropdown option using iconUrl from flagMap', () => {
    const flagMap = new Map<string, string>([['USD', '/assets/USD@3x.png']]);
    const currency: Currency = { currency: 'USD', ask: 1.1, bid: 1.0, pair: 'USDUSD' };

    const opt = mapCurrencyToDropdownOption(flagMap, currency);

    expect(opt.value).toBe('USD');
    expect(opt.label).toBe('USD');
    expect(opt.title).toBe('USD');
    expect(opt.disabled).toBe(false);
    expect(opt.iconUrl).toBe('/assets/USD@3x.png');
  });

  it('falls back to empty iconUrl when code not in flagMap', () => {
    const flagMap = new Map<string, string>();
    const currency: Currency = { currency: 'JPY', ask: 1.1, bid: 1.0, pair: 'JPYUSD' };

    const opt = mapCurrencyToDropdownOption(flagMap, currency);

    expect(opt.iconUrl).toBe('');
  });
});

describe('populateDropdownOptions', () => {
  const flagMap = new Map<string, string>([
    ['USD', '/assets/USD@3x.png'],
    ['EUR', '/assets/EUR@3x.png'],
    ['GBP', '/assets/GBP@3x.png'],
  ]);

  it('builds options only for currencies present in flagMap and deduplicates by code', () => {
    const input: Currency[] = [
      { currency: 'usd', ask: 1.05, bid: 1, pair: 'USDUSD' },
      { currency: 'eur', ask: 0.95, bid: 0.9, pair: 'EURUSD' },
      { currency: 'USD', ask: 1.06, bid: 1.01, pair: 'USDUSD' },
      { currency: 'aaa', ask: 2, bid: 2, pair: 'AAAUSD' },
    ];

    const { options, currencyMap } = populateDropdownOptions(flagMap, input);

    expect(options.map((o) => o.value)).toEqual(['USD', 'EUR']);
    expect(options.map((o) => o.label)).toEqual(['USD', 'EUR']);
    expect(options.every((o) => o.disabled === false)).toBe(true);

    expect(options.find((o) => o.value === 'USD')!.iconUrl).toBe('/assets/USD@3x.png');
    expect(options.find((o) => o.value === 'EUR')!.iconUrl).toBe('/assets/EUR@3x.png');

    expect(currencyMap.get('usd')).toBe(1);
    expect(currencyMap.get('eur')).toBe(0.9);
    expect(currencyMap.has('USD')).toBe(false);
    expect(currencyMap.has('AAA')).toBe(false);
  });

  it('skips entries with empty/invalid currency codes', () => {
    const input: Currency[] = [
      // @ts-expect-error
      { currency: '', ask: 1, bid: 1, pair: 'XXX' },
      // @ts-expect-error
      { currency: undefined, ask: 1, bid: 1, pair: 'YYY' },
      { currency: 'gbp', ask: 1.3, bid: 1.25, pair: 'GBPUSD' },
    ];

    const { options, currencyMap } = populateDropdownOptions(flagMap, input);
    expect(options.map((o) => o.value)).toEqual(['GBP']);
    expect(currencyMap.get('gbp')).toBe(1.25);
  });

  it('preserves the first-seen order of unique, valid currency codes', () => {
    const input: Currency[] = [
      { currency: 'eur', ask: 1, bid: 1, pair: 'EURUSD' },
      { currency: 'usd', ask: 1, bid: 1, pair: 'USDUSD' },
      { currency: 'eur', ask: 2, bid: 2, pair: 'EURUSD' },
      { currency: 'gbp', ask: 1, bid: 1, pair: 'GBPUSD' },
    ];

    const { options } = populateDropdownOptions(flagMap, input);
    expect(options.map((o) => o.value)).toEqual(['EUR', 'USD', 'GBP']);
  });
});

describe('exportAvailableFlags', () => {
  it('returns a Map; if assets exist, keys are 3-letter uppercase codes', async () => {
    const map = exportAvailableFlags();
    expect(map).toBeInstanceOf(Map);

    if (map.size > 0) {
      for (const key of map.keys()) {
        expect(/^[A-Z]{3}$/.test(key)).toBe(true);
      }
    }
  });
});
