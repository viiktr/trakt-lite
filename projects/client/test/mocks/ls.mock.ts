import { vi } from 'vitest';

Object.defineProperty(window, 'localStorage', {
  value: (() => {
    const store: Map<string, string> = new Map();

    return {
      getItem: vi.fn((key: string) => store.get(key)),
      setItem: vi.fn((key: string, value: string) => store.set(key, value)),
      removeItem: vi.fn((key: string) => store.delete(key)),
      clear: vi.fn(() => store.clear()),
    };
  })(),
});
