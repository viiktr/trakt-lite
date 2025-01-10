import { z } from '../../../_internal/z.ts';

export const calendarRequestParamsSchema = z.object({
  target: z.enum(['my', 'all']),
  start_date: z.string().openapi({
    description:
      'The start date of the calendar. Must be formatted as "YYYY-MM-DD".',
  }),
  days: z.number().openapi({
    description: 'The number of days to retrieve.',
  }),
});
