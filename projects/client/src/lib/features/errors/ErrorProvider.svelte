<script lang="ts">
  import Error503Page from "$lib/pages/errors/Error503Page.svelte";
  import { useWellKnownErrors } from "./useWellKnownErrors";

  const { children }: ChildrenProps = $props();

  const { error503 } = useWellKnownErrors();
</script>

<!-- TODO map errors to components? have generic well known error page, use params to change content -->
{#if $error503}
  <Error503Page />
{:else}
  {@render children()}
{/if}

<!-- svelte:boundary not usable for errors outside of rendering process -->
<!-- <svelte:boundary>
  {@render children()}

  {#snippet failed(error, reset)}
    <h1>ERROR</h1>
    <p>{error}</p>
  {/snippet}
</svelte:boundary> -->
