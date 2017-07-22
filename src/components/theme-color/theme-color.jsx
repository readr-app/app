import { Children, PropTypes } from 'react';
import withSideEffect from 'react-side-effect';
import memoize from 'ramda/src/memoize';

const metaElement = memoize(() => {
    const elem = document.createElement('meta');
    elem.name = 'theme-color';
    return document.querySelector('meta[name="theme-color"]') || document.head.appendChild(elem);
});

const reducePropsToState = propsList => {
    const props = propsList.slice().pop();
    return props && props.color;
};

const handleStateChange = color => (metaElement().content = color);

const ThemeColor = ({ children }) => {
    if (children) {
        return Children.only(children);
    }
    return null;
};

ThemeColor.proptTypes = {
    color: PropTypes.string.isRequired,
};

export default withSideEffect(reducePropsToState, handleStateChange)(ThemeColor);
