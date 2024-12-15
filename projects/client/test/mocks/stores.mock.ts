import { writable } from 'svelte/store';
import { vi } from 'vitest';

export const urlProxy = writable(new URL('https://example.com'));

vi.mock('$app/stores', () => ({
  page: {
    subscribe: (resolver: (_: Record<string, unknown>) => void) => {
      const unsubscribe = urlProxy
        .subscribe((url: URL) => {
          resolver({ url });
        });
      return unsubscribe;
    },
  },
}));
