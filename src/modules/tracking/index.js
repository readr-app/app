
/* eslint "no-console": 0 */

const CATEGORY = 'ReadrEvnt';

/* eslint "prefer-rest-params": 0 */
const tracker = window.ga = window.ga || function tracker() {
    (window.ga.q = window.ga.q || []).push(arguments);
};

tracker.l = Date.now();

tracker('create', 'UA-90319400-1', 'auto');
tracker('set', 'anonymizeIp', true);
tracker('send', 'pageview');

const trackPageView = (pathname) => {
    if (__DEV__) {
        console.log('Track pageView', pathname);
        return;
    }
    tracker('set', 'page', pathname);
    tracker('send', 'pageview');
};

export const trackEvent = (action, data) => {
    if (__DEV__) {
        console.log('Track event', action, data);
        return;
    }
    const label = typeof data === 'string' ?
        data : JSON.stringify(data);
    tracker('send', 'event', CATEGORY, action, label);
};

export const onRouteChange = () =>
    trackPageView(location.pathname);
