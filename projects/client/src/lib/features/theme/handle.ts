import { ThemeEndpoint } from '$lib/features/theme/ThemeEndpoint.ts';
import { THEME_STORE_NAME } from '$lib/features/theme/constants.ts';
import { Theme } from '$lib/features/theme/models/Theme.ts';
import { coerceTheme } from '$lib/features/theme/utils/coerceTheme.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { Handle } from '@sveltejs/kit';

const THEME_PLACEHOLDER = '%theme.current%';

export type ThemeResponse = { theme: Theme };

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith(ThemeEndpoint.Set)) {
    const { theme } = await event.request.json() as { theme: Theme };

    return new Response(
      JSON.stringify({ theme }),
      {
        headers: {
          'Set-Cookie': event.cookies.serialize(
            THEME_STORE_NAME,
            theme,
            {
              path: '/',
              maxAge: time.years(5) / time.seconds(1),
            },
          ),
        },
      },
    );
  }

  const { cookies } = event;

  const response = await resolve(
    event,
    {
      transformPageChunk: ({ html }) => {
        const currentTheme = coerceTheme(cookies.get(THEME_STORE_NAME));
        return html.replace(THEME_PLACEHOLDER, `${currentTheme}`);
      },
    },
  );

  return response;
};
