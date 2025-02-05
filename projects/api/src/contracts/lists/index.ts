import { builder } from '../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { z } from '../_internal/z.ts';
import { watchlistedMoviesResponseSchema } from '../users/_internal/response/watchlistedMoviesResponseSchema.ts';
import { watchlistedShowsResponseSchema } from '../users/_internal/response/watchlistedShowsResponseSchema.ts';

export const lists = builder.router({
  items: {
    path: '/items/movies,shows',
    method: 'GET',
    pathParams: idParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: z.union([
        watchlistedMoviesResponseSchema,
        watchlistedShowsResponseSchema,
      ]).array(),
    },
  },
}, {
  pathPrefix: '/lists/:id',
});
