import { api, type ApiParams } from '$lib/requests/api.ts';

type UnlikeCommentParams = { id: number } & ApiParams;

// TODO invalidator
export function unlikeCommentRequest(
  { fetch, id }: UnlikeCommentParams,
): Promise<boolean> {
  return api({ fetch })
    .comments
    .like({
      params: {
        id: `${id}`,
      },
    })
    .then(({ status }) => status === 204);
}
