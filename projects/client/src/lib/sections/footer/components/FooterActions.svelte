<script>
  import LocalePicker from "$lib/features/i18n/components/LocalePicker.svelte";
  import ThemePicker from "$lib/features/theme/components/ThemePicker.svelte";
  import ExternalLinks from "./ExternalLinks.svelte";
</script>

<div class="trakt-footer-actions">
  <LocalePicker />
  <ThemePicker />
  <ExternalLinks />
</div>

<style>
  .trakt-footer-actions {
    width: 100%;
    display: flex;
    align-items: center;

    :global(.trakt-external-links) {
      margin-left: auto;
    }
  }
</style>
