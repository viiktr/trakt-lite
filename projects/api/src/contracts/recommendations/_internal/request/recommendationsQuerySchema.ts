import { z } from '../../../_internal/z.ts';

export const recommendationsQuerySchema = z.object({
  ignore_collected: z.boolean().optional().openapi({
    description: 'Ignore collected items.',
  }),
  ignore_watchlisted: z.boolean().optional().openapi({
    description: 'Ignore watchlisted items.',
  }),
  limit: z.number().int().positive().optional().openapi({
    description: 'Limit the number of results.',
  }),
  days: z.number().int().positive().optional().openapi({
    description: 'Limit the number of days to consider.',
  }),
});
