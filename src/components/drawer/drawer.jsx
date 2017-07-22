
/* eslint "jsx-a11y/no-static-element-interactions": 0 */

import React, { PropTypes } from 'react';
import classnames from 'classnames';
import mdlLayout from 'material-design-lite/src/layout/_layout.scss';
import blur from '../../modules/util/blur';
import styles from './drawer.sass';

const Drawer = ({ children, isVisible, toggleDrawer }) => {
    const drawerClass = classnames(styles.drawer, mdlLayout['mdl-layout__drawer'], {
        [mdlLayout['is-visible']]: isVisible,
    });
    const obfuscatorClass = classnames(mdlLayout['mdl-layout__obfuscator'], {
        [mdlLayout['is-visible']]: isVisible,
    });
    const hidden = (!isVisible).toString();

    return (<div id="drawer">
        <div className={drawerClass} aria-hidden={hidden}>
            <button
                aria-expanded={isVisible.toString()}
                title="Close navigation"
                className={styles.close}
                onClick={() => toggleDrawer(false)}
                onMouseUp={blur}
            >&times;</button>
            {children}
        </div>
        <div
            aria-hidden={hidden}
            className={obfuscatorClass}
            onClick={() => toggleDrawer(false)}
        />
    </div>);
};

Drawer.propTypes = {
    children: PropTypes.element,
    isVisible: PropTypes.bool.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
};

export default Drawer;
