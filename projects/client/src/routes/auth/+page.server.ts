import type { Actions } from '@sveltejs/kit';
import { action as resolve } from '$lib/features/auth/action.ts';
import { initiateDeviceAuth } from '$lib/requests/auth/initiateDeviceAuth.ts';

export const actions = {
  resolve,
  initiate: initiateDeviceAuth,
} satisfies Actions;
