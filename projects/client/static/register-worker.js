if ('serviceWorker' in navigator) {
  globalThis.addEventListener('beforeinstallprompt', (event) => {
    globalThis.install = event;
  });

  globalThis.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
  })
}
