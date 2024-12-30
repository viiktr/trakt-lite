<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-summary-header">
  {@render children()}
</div>

<style>
  .trakt-summary-header {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
  }
</style>
