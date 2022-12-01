let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register("/rdrive.sw.js");
}