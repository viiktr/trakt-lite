import type { MediaInput, MediaInputDefault } from '$lib/models/MediaInput';
import type { MediaType } from '$lib/models/MediaType';
import type { Snippet } from 'svelte';
import type { MediaStyleProps } from './MediaStyleProps';

export type MediaItemProps<T = MediaInputDefault> =
  & {
    type: MediaType;
    tags?: Snippet<[MediaInput<T>['media']]>;
    action?: Snippet;
  }
  & MediaInput<T>
  & MediaStyleProps;
