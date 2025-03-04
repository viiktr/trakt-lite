import { browser } from '$app/environment';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { time } from '$lib/utils/timing/time.ts';
import { type Readable, writable } from 'svelte/store';

export const NAMESPACE = 'trakt_store';

function keyGenerator(key: string) {
  return `${NAMESPACE}.${key}`;
}

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
    nukeExpiredItems();
  }

  const defaultValue = options.defaultValue ?? null;
  const ttl = options.ttl ?? time.months(1);
  const namespacedKey = keyGenerator(key);
  const storedItem = readRawStorage(namespacedKey);
  const storedValue = parseStoredValue<T>(storedItem, namespacedKey);

  if (ttl <= 0) {
    throw new Error('Expiration time must be positive');
  }

  const { subscribe, set: _set } = writable<T | Nil>(
    storedValue ?? defaultValue,
  );

  updateCachedValue(namespacedKey, _set);

  function setItem(value: T) {
    if (!browser) return;

    const item: StorageItem<T> = {
      value,
      expires: Date.now() + ttl,
    };

    try {
      const itemValue = JSON.stringify(item);
      localStorage.setItem(namespacedKey, itemValue);
      dispatchStorageEvent(namespacedKey, itemValue);
      _set(value);
    } catch (e) {
      console.error(
        `[useStorage] Failed to store "${namespacedKey}"`,
        e,
      );
    }
  }

  function removeItem() {
    if (!browser) return;

    try {
      localStorage.removeItem(namespacedKey);
      dispatchStorageEvent(namespacedKey, null);
      _set(null);
    } catch (e) {
      console.error(
        `[useStorage] Failed to remove "${namespacedKey}"`,
        e,
      );
    }
  }

  return {
    subscribe,
    set: setItem,
    remove: removeItem,
  };
}

/**
 * Dispatches a storage event to all listeners
 */
function dispatchStorageEvent(key: string, newValue: string | Nil) {
  globalThis.dispatchEvent(
    new StorageEvent('storage', {
      key,
      newValue,
      oldValue: readRawStorage(key),
    }),
  );
}

/**
 * Updates a cached value for a specific key when localStorage changes
 *
 * @param key The storage key to watch
 * @param updater Function called with the new value when storage changes
 * @returns Function to unregister the listener
 */
function updateCachedValue<T>(
  key: string,
  updater: (value: T | Nil) => void,
): () => void {
  if (!browser) {
    return NOOP_FN;
  }

  return GlobalEventBus
    .getInstance()
    .register(
      'storage',
      (event) => {
        if (event.key === key) {
          updater(parseStoredValue(event.newValue, key));
        }
      },
    );
}

/**
 * Reads a raw value from localStorage
 */
function readRawStorage(key: string): string | Nil {
  if (!browser) return null;

  return localStorage.getItem(key);
}

/**
 * Parses a stored value from localStorage
 */
function parseStoredValue<T>(json: string | Nil, key: string): T | Nil {
  try {
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
function nukeExpiredItems() {
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
