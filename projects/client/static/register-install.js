if ('serviceWorker' in navigator) {
  globalThis.addEventListener('load', () => {
    globalThis.addEventListener('beforeinstallprompt', (event) => {
      globalThis.install = event;
    });
  });
}
