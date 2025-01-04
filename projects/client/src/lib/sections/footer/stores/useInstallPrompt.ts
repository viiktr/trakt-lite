import { get, writable } from 'svelte/store';

export function useInstallPrompt() {
  const { subscribe, set } = writable<BeforeInstallPromptEvent | null>(
    globalThis.install,
  );

  const interval = setInterval(() => {
    if (globalThis.install) {
      set(globalThis.install);
      clearInterval(interval);
    }
  }, 50);

  setTimeout(() => clearInterval(interval), 1000);

  return {
    subscribe,
    prompt: async () => {
      const event = get({ subscribe });

      if (!event) {
        return;
      }

      const result = await event.prompt();

      const isAccepted = result.outcome === 'accepted';

      if (isAccepted) {
        set(null);
      }

      return isAccepted;
    },
  };
}
