import { browser } from '$app/environment';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { onDestroy } from 'svelte';
import { derived, get, writable } from 'svelte/store';

export type UpNextType = 'standard' | 'nitro';

const UP_NEXT_STORAGE_KEY = 'up-next-type';

function getCachedUpNextType(): UpNextType {
  if (!browser) {
    return 'standard';
  }

  const stored = localStorage.getItem(UP_NEXT_STORAGE_KEY);
  return stored ? JSON.parse(stored) : 'standard';
}

function saveCachedUpNextType(type: UpNextType) {
  if (!browser) {
    return;
  }

  localStorage.setItem(UP_NEXT_STORAGE_KEY, JSON.stringify(type));
}

function updateCachedUpNextType(
  key: string,
  updater: (type: UpNextType) => void,
) {
  if (!browser) {
    return NOOP_FN;
  }

  return GlobalEventBus.getInstance().register(
    'storage',
    (event) => {
      if (event.key === key) {
        updater(event.newValue as UpNextType);
      }
    },
  );
}

export function useUpNextExperiment() {
  const type = writable(getCachedUpNextType());

  onDestroy(updateCachedUpNextType(UP_NEXT_STORAGE_KEY, type.set));

  return {
    type,
    enabled: derived(type, ($type) => $type === 'nitro'),
    toggle: () => {
      const oldType = get(type);
      const newType = oldType === 'standard' ? 'nitro' : 'standard';

      /**
       * Storage events fire only when changed from other tabs.
       * We need to manually dispatch the event to update the UI, within the same tab.
       *
       * FIXME: extract generic store with storage concepts
       * lab stores should leverage that store afterwards
       */
      globalThis.dispatchEvent(
        new StorageEvent('storage', {
          key: UP_NEXT_STORAGE_KEY,
          newValue: newType,
          oldValue: oldType,
        }),
      );

      saveCachedUpNextType(newType);
      type.set(newType);
    },
  };
}
