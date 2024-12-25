<script lang="ts">
  import CoverImageSetter from "$lib/components/background/CoverImageSetter.svelte";
  import TraktPage from "$lib/components/layout/TraktPage.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import Profile from "$lib/sections/profile/Profile.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";

  const { current } = useUser();
</script>

<TraktPage image={DEFAULT_SHARE_COVER} title={m.profile()}>
  {#if current() != null}
    <CoverImageSetter src={current().cover.url} type="main" />
    <Profile />
  {/if}
</TraktPage>
