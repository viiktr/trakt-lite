<script lang="ts">
  import { DEFAULT_COVER } from "$lib/utils/constants";
  import { useCover } from "./_internal/useCover";

  const { children }: ChildrenProps = $props();

  useCover({
    src: DEFAULT_COVER,
    type: "main",
  });
</script>

{@render children()}
