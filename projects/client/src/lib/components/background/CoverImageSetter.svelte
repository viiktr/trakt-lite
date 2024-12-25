<script lang="ts">
  import type { MediaType } from "$lib/models/MediaType";
  import { get } from "svelte/store";
  import { useCover } from "./_internal/useCover";

  type ImageBackgroundProps = {
    src: string;
    type: MediaType | "main";
  };

  const { src, type }: ImageBackgroundProps = $props();

  const { cover, state } = useCover();

  $effect.pre(() => {
    const current = get(cover);

    if (current.src === src) {
      return;
    }

    cover.set({
      src,
      type,
    });

    state.set("change");
    queueMicrotask(() => state.set("ready"));
  });
</script>
