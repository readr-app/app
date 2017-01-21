
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import mdlLayout from 'material-design-lite/src/layout/_layout.scss';

const Navigation = ({ toggleDrawer }) => (
    <nav className={mdlLayout['mdl-navigation']}>
        <Link
            className={mdlLayout['mdl-navigation__link']}
            onClick={() => toggleDrawer(false)}
            to="/about"
        >About</Link>
    </nav>
);

Navigation.propTypes = {
    toggleDrawer: PropTypes.func.isRequired,
};

export default Navigation;
