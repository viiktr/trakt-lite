import { writable } from 'svelte/store';

const error503 = writable(false);

// TODO more generic, better names, explicit setters/getters? etc.
export function useWellKnownErrors() {
  if (typeof window === 'undefined') {
    return {
      error503: writable(false),
    };
  }

  return {
    error503,
  };
}
