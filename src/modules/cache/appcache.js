export default function initAppCache() {
    const manifestLoader = document.createElement('iframe');
    manifestLoader.src = MANIFEST_LOADER;
    manifestLoader.style.display = 'none';
    document.body.appendChild(manifestLoader);

    manifestLoader.contentWindow.addEventListener(
        'load',
        () => {
            const win = manifestLoader.contentWindow;
            win.applicationCache.addEventListener(
                'updateready',
                () => {
                    if (win.applicationCache.status === win.applicationCache.UPDATEREADY) {
                        win.applicationCache.swapCache();
                        if (
                            // eslint-disable-next-line no-alert
                            confirm('A new version of Readr is available. Load it?')
                        ) {
                            location.reload();
                        }
                    }
                },
                false
            );
        },
        false
    );
}
