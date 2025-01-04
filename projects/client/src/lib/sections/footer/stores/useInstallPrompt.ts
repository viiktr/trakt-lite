import { get, writable } from 'svelte/store';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function useInstallPrompt() {
  const { subscribe, set } = writable<BeforeInstallPromptEvent | null>(null);

  if (typeof window !== 'undefined') {
    globalThis.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      set(event as BeforeInstallPromptEvent);
    });
  }

  return {
    subscribe,
    prompt: async () => {
      const event = get({ subscribe });

      if (!event) {
        return;
      }

      const result = await event.prompt();
      set(null);

      return result.outcome === 'accepted';
    },
  };
}
