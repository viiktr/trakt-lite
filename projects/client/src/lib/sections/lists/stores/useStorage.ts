import { browser } from '$app/environment';
import { time } from '$lib/utils/timing/time.ts';
import { type Readable, writable } from 'svelte/store';

const NAMESPACE = 'trakt_store_';

interface StorageItem<T> {
  value: T;
  expires: number;
}

interface StorageStore<T> extends Readable<T | Nil> {
  set: (value: T) => void;
  remove: () => void;
}

/**
 * Creates a store backed by localStorage with automatic expiration handling
 * and namespacing of all keys with "trakt_store_".
 *
 * @param key The storage key (will be prefixed with namespace)
 * @param defaultValue Optional initial value
 * @returns A store with get/set/remove methods
 */
export function useStorage<T>(
  key: string,
  options: {
    defaultValue?: T | Nil;
    ttl?: number;
  } = {},
): StorageStore<T> {
  if (browser) {
    clearExpiredItems();
  }

  const defaultValue = options.defaultValue ?? null;
  const ttl = options.ttl ?? time.months(1);
  const namespacedKey = NAMESPACE + key;
  const storedValue = getStoredValue<T>(namespacedKey);

  if (ttl <= 0) {
    throw new Error('Expiration time must be positive');
  }

  const { subscribe, set: internalSet } = writable<T | Nil>(
    storedValue ?? defaultValue,
  );

  function setItem(value: T) {
    if (!browser) return;

    const item: StorageItem<T> = {
      value,
      expires: Date.now() + ttl,
    };

    try {
      localStorage.setItem(namespacedKey, JSON.stringify(item));
      internalSet(value);
    } catch (e) {
      console.error(`[useStorage] Failed to store "${namespacedKey}"`, e);
    }
  }

  function removeItem() {
    if (!browser) return;

    try {
      localStorage.removeItem(namespacedKey);
      internalSet(null);
    } catch (e) {
      console.error(`[useStorage] Failed to remove "${namespacedKey}"`, e);
    }
  }

  return {
    subscribe,
    set: setItem,
    remove: removeItem,
  };
}

/**
 * Gets an item from storage and checks if it's expired
 */
function getStoredValue<T>(key: string): T | Nil {
  if (!browser) return null;

  try {
    const json = localStorage.getItem(key);
    if (!json) return null;

    const item = JSON.parse(json) as StorageItem<T>;

    if (isExpired(item.expires)) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (e) {
    console.error(`[useStorage] Failed to parse "${key}"`, e);
    return null;
  }
}

/**
 * Checks if a timestamp is expired
 */
function isExpired(expires: number): boolean {
  return Date.now() > expires;
}

/**
 * Clears all expired namespaced items
 */
function clearExpiredItems() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(NAMESPACE))
    .forEach((key) => {
      try {
        const item = JSON.parse(localStorage.getItem(key) || '');
        if (isExpired(item.expires)) {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    });
}
