import { get, writable } from 'svelte/store';

export function useInstallPrompt() {
  const { subscribe, set } = writable<BeforeInstallPromptEvent | null>(
    globalThis.install,
  );

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
