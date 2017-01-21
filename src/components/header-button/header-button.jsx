
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import mdlLayout from 'material-design-lite/src/layout/_layout.scss';
import blur from '../../modules/util/blur';
import styles from './header-button.sass';

const innerClass = classnames(mdlLayout['mdl-layout__drawer-button'], styles.inner);

const MenuButton = ({ color, toggleDrawer, drawerOpen }) => (
    <button
        aria-expanded={drawerOpen.toString()}
        style={{ color }}
        className={innerClass}
        onClick={toggleDrawer}
        onMouseUp={blur}
    >
        <span className={styles.text}>Toggle Navigation</span>
    </button>
);

MenuButton.propTypes = {
    color: PropTypes.string.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
};

const BackButton = ({ color }) => (
    <Link
        to="/"
        style={{ color }}
        className={innerClass}
    >
        <span className={styles.text}>back</span>
    </Link>
);

BackButton.propTypes = {
    color: PropTypes.string.isRequired,
};

const ButtonIcon = ({ isIndex, drawerOpen }) => {
    const iconClass = classnames(styles.icon, {
        [styles.navIcon]: isIndex,
        [styles.backIcon]: !isIndex,
        [styles.hidden]: drawerOpen,
    });
    return (<i className={iconClass} />);
};

ButtonIcon.propTypes = {
    isIndex: PropTypes.bool.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
};

const HeaderButton = ({ isIndex, color, toggleDrawer, drawerOpen }) => (
    <span className={styles.button}>
        {isIndex ?
            (<MenuButton color={color} toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />) :
            (<BackButton color={color} />)}
        <ButtonIcon isIndex={isIndex} drawerOpen={drawerOpen} />
    </span>
);

HeaderButton.propTypes = {
    isIndex: PropTypes.bool.isRequired,
    color: PropTypes.string.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
};

export default HeaderButton;
