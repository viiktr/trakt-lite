<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  const { to }: { to: string } = $props();

  onMount(() => {
    goto(to, {
      replaceState: true,
    });
  });
</script>
