import { browser } from '$app/environment';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { time } from '$lib/utils/timing/time.ts';
import { type Readable, writable } from 'svelte/store';

export const NAMESPACE = 'trakt_store';

interface StoredData<T> {
  value: T;
  expires_at?: number;
}

interface StorageStore<T> extends Readable<T | Nil> {
  set: (value: T) => void;
  remove: () => void;
}

function getKey(key: string): string {
  return `${NAMESPACE}.${key}`;
}

/**
 * Creates a store backed by localStorage with automatic expiration handling
 */
export function useStorage<T>(
  key: string,
  options: {
    defaultValue?: T | Nil;
    ttl?: number;
  } = {},
): StorageStore<T> {
  if (browser) {
    cleanExpiredItems();
  }

  const defaultValue = options.defaultValue ?? null;
  const ttl = options.ttl ?? time.months(1);
  const fullKey = getKey(key);

  if (ttl <= 0) {
    throw new Error('Expiration time must be positive');
  }

  const { subscribe, set: _set } = writable<T | Nil>(
    get<T>(fullKey) ?? defaultValue,
  );

  setupStorageListener(fullKey, _set);

  function set(value: T) {
    if (!browser) return;

    try {
      const data: StoredData<T> = {
        value,
        expires_at: Date.now() + ttl,
      };
      const jsonValue = JSON.stringify(data);
      localStorage.setItem(fullKey, jsonValue);
      dispatchStorageEvent(fullKey, jsonValue);
      _set(value);
    } catch (e) {
      console.error(`[useStorage] Failed to store "${fullKey}"`, e);
    }
  }

  function remove() {
    if (!browser) return;

    try {
      localStorage.removeItem(fullKey);
      dispatchStorageEvent(fullKey, null);
      _set(null);
    } catch (e) {
      console.error(`[useStorage] Failed to remove "${fullKey}"`, e);
    }
  }

  return {
    subscribe,
    set,
    remove,
  };
}

function get<T>(key: string): T | null {
  if (!browser) return null;

  const item = localStorage.getItem(key);
  if (!item) return null;

  try {
    const data = JSON.parse(item) as StoredData<T>;
    if (data.expires_at && data.expires_at < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    return data.value;
  } catch (e) {
    console.error(`[useStorage] Failed to parse "${key}"`, e);
    localStorage.removeItem(key);
    return null;
  }
}

function dispatchStorageEvent(key: string, newValue: string | Nil) {
  globalThis.dispatchEvent(
    new StorageEvent('storage', {
      key,
      newValue,
      oldValue: localStorage.getItem(key),
    }),
  );
}

function setupStorageListener<T>(
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
          updater(get<T>(key));
        }
      },
    );
}

function cleanExpiredItems() {
  if (!browser) return;

  Object.keys(localStorage)
    .filter((key) => key.startsWith(NAMESPACE))
    .forEach((key) => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return;

        const data = JSON.parse(item) as StoredData<any>;
        if (data.expires_at && data.expires_at < Date.now()) {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    });
}
