import { time } from '$lib/utils/timing/time.ts';
import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStorage } from './useStorage.ts';

vi.mock('$app/environment', () => ({
  browser: true,
}));

describe('useStorage', () => {
  const NAMESPACE = 'trakt_store_';
  const key = 'test-key';
  const fullKey = NAMESPACE + key;

  beforeEach(() => {
    vi.spyOn(Date, 'now').mockImplementation(() => time.seconds(1));
  });

  it('should return defaultValue when no stored value exists', () => {
    const defaultValue = { test: 'default' };
    const store = useStorage(key, { defaultValue });

    expect(get(store)).toEqual(defaultValue);
  });

  it('should use null as defaultValue when not provided', () => {
    const store = useStorage(key);
    expect(get(store)).toBeNull();
  });

  it('should store and retrieve values with expiration', () => {
    const value = { name: 'test' };
    const store = useStorage<typeof value>(key, { ttl: time.seconds(5) });

    store.set(value);

    expect(JSON.parse(localStorage.getItem(fullKey) || '{}')).toEqual({
      value,
      expires: time.seconds(6),
    });

    expect(get(store)).toEqual(value);
  });

  it('should throw error when expiration time is not positive', () => {
    expect(() => useStorage(key, { ttl: -100 })).toThrow(
      'Expiration time must be positive',
    );
  });

  it('should handle removing items', () => {
    const value = 'test-value';
    const store = useStorage<string>(key, { ttl: 5000 });

    store.set(value);
    expect(get(store)).toBe(value);

    store.remove();
    expect(get(store)).toBeNull();
    expect(localStorage.getItem(fullKey)).toBeFalsy();
  });

  it('should handle expired items', () => {
    const value = 'will-expire';
    const store = useStorage<string>(key, { ttl: 500 });

    // Set with short expiration
    store.set(value);
    expect(get(store)).toBe(value);

    // Move time forward past expiration
    vi.spyOn(Date, 'now').mockImplementation(() => 2001);

    // Create a new store to trigger reading from localStorage
    const newStore = useStorage<string>(key);
    expect(get(newStore)).toBeNull();
    expect(localStorage.getItem(fullKey)).toBeFalsy();
  });

  it('should handle invalid JSON in localStorage', () => {
    localStorage.setItem(fullKey, 'invalid-json');

    const store = useStorage<string>(key);
    expect(get(store)).toBeNull();
  });

  it('should handle expired JSON in localStorage', () => {
    const expired = JSON.stringify({
      value: 'expired',
      expires: 500,
    });

    localStorage.setItem(fullKey, expired);

    const store = useStorage<string>(key);

    expect(get(store)).toBeNull();
    expect(localStorage.getItem(fullKey)).toBeFalsy();
  });

  it('should use default value when value is expired', () => {
    const expired = JSON.stringify({
      value: 'expired',
      expires: 500,
    });

    localStorage.setItem(fullKey, expired);

    const defaultValue = 'default';

    const store = useStorage<string>(key, { defaultValue });

    expect(get(store)).toBe(defaultValue);
    expect(localStorage.getItem(fullKey)).toBeFalsy();
  });
});
