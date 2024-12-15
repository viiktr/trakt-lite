import { beforeNavigate } from '$app/navigation';
import { page } from '$app/stores';
import { get, writable } from 'svelte/store';

const isMatch = (href: string | Nil, route: string | Nil) => href === route;

export function useActiveLink(href: string | Nil) {
  const isActive = writable(isMatch(href, get(page).url.pathname));

  beforeNavigate((nav) => {
    if (nav.type === 'leave') {
      return;
    }

    isActive.set(isMatch(
      href,
      nav.to?.url.pathname,
    ));
  });

  return {
    isActive,
  };
}
