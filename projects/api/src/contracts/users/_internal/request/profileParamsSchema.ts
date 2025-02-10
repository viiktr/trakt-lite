import { z } from '../../../_internal/z.ts';

export const profileParamsSchema = z.object({
  id: z.enum(['me']).or(z.string()).openapi({
    description:
      `The slug that identifies the user, or "me" for the authenticated user.`,
  }),
});
