/* eslint "no-nested-ternary": 0 */

const supportPageOffset = window.pageXOffset !== undefined;
const isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';

const scrollOffset = {
    get x() {
        return supportPageOffset
            ? window.pageXOffset
            : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
    },

    get y() {
        return supportPageOffset
            ? window.pageYOffset
            : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
    },
};

export default scrollOffset;
