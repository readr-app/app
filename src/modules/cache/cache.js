import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import initAppCache from './appcache';
import { trackEvent } from '../tracking/';

export default function main() {
    if (__PROD__) {
        if ('serviceWorker' in navigator) {
            trackEvent('Initialize Service Worker');
            runtime.register();
        } else {
            trackEvent('Initialize AppCache');
            initAppCache();
        }
    }
}
