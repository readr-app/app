/* eslint "no-console": 0 */

import equals from 'ramda/src/equals';

const CATEGORY = 'ReadrEvnt';

let lastPathname = null;
let lastEventData = null;

const tracker = (window.ga =
    window.ga ||
    function tracker(...args) {
        (window.ga.q = window.ga.q || []).push(args);
    });

tracker.l = Date.now();

tracker('create', 'UA-90319400-1', 'auto');
tracker('set', 'anonymizeIp', true);
tracker('send', 'pageview');

const trackPageView = pathname => {
    if (pathname === lastPathname) {
        return;
    }
    lastPathname = pathname;
    if (__DEV__) {
        console.log('Track pageView', pathname);
        return;
    }
    tracker('set', 'page', pathname);
    tracker('send', 'pageview');
};

export const trackEvent = (action, data) => {
    if (equals(data, lastEventData)) {
        return;
    }
    lastEventData = data;
    if (__DEV__) {
        console.log('Track event', action, data);
        return;
    }
    const label = typeof data === 'string' ? data : JSON.stringify(data);
    tracker('send', 'event', CATEGORY, action, label);
};

export const onRouteChange = () => trackPageView(location.pathname);
