<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import {
    type AvailableLanguageTag,
    availableLanguageTags,
    i18n,
    isAvailableLanguageTag,
    languageTag,
  } from "$lib/features/i18n/index.ts";

  function switchToLanguage(newLanguage: string) {
    if (!isAvailableLanguageTag(newLanguage)) {
      console.error(`Invalid language tag: ${newLanguage}`);
      return;
    }

    const canonicalPath = i18n.route($page.url.pathname);
    const localizedPath = i18n.resolveRoute(canonicalPath, newLanguage);
    goto(localizedPath);
  }

  const tagToFlag: Record<AvailableLanguageTag, string> = {
    en: "🇬🇧",
    fr: "🇫🇷",
  };

  const tagToTitle: Record<AvailableLanguageTag, string> = {
    en: "English",
    fr: "Français",
  };

  const currentLanguage = languageTag();
</script>

<div class="locale-picker-container">
  <select onchange={(ev) => switchToLanguage(ev.currentTarget.value)}>
    {#each availableLanguageTags as tag}
      <option
        selected={currentLanguage == tag}
        value={tag}
        aria-label={tagToTitle[tag]}
      >
        {tagToFlag[tag]}
      </option>
    {/each}
  </select>
</div>

<style>
  .locale-picker-container {
    width: var(--ni-48);
    height: var(--ni-48);
    border-radius: 50%;

    &:hover {
      background-color: color-mix(
        in srgb,
        var(--color-background) 30%,
        transparent 70%
      );

      backdrop-filter: blur(8px);
    }
  }

  select {
    width: 100%;
    font-size: var(--ni-32);
    line-height: var(--ni-52);
    border: none;
    border-radius: 5px;
    background-color: transparent;
    text-align: center;
    appearance: none;
    cursor: pointer;
  }

  select:focus {
    outline: none;
    border-color: var(--color-primary);
  }
</style>
