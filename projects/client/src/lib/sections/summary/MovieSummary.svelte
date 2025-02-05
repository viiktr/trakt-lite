<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import type { MediaCrew } from "$lib/requests/models/MediaCrew";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import type { MediaStats } from "$lib/requests/models/MediaStats";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry";

  import CastList from "../lists/CastList.svelte";
  import RelatedList from "../lists/RelatedList.svelte";
  import Lists from "./components/lists/Lists.svelte";
  import MediaSummary from "./components/media/MediaSummary.svelte";
  import type { MediaSummaryProps } from "./components/media/MediaSummaryProps";

  const {
    media,
    ratings,
    stats,
    watchers,
    studios,
    intl,
    crew,
    lists,
  }: MediaSummaryProps<MovieEntry> & {
    stats: MediaStats;
    studios: MediaStudio[];
    crew: MediaCrew;
    lists: MediaListSummary[];
  } = $props();
</script>

<MediaSummary
  {media}
  {ratings}
  {stats}
  {watchers}
  {studios}
  {crew}
  {intl}
  type="movie"
/>

<CastList title={m.actors()} cast={crew.cast} />

<Lists {lists} />

<RelatedList title={m.related_movies_title()} slug={media.slug} type="movie" />
