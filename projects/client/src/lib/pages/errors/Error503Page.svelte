<script>
  import Link from "$lib/components/link/Link.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ErrorPage from "./ErrorPage.svelte";
</script>

<ErrorPage
  title="Trakt service unreachable"
  message="The connection is... absent. Like a forgotten memory."
>
  <Link href={UrlBuilder.og.status()} color="classic">Trakt service status</Link
  >
</ErrorPage>
