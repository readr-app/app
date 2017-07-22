/* eslint "react/no-danger": 0 */

import React, { PropTypes } from 'react';
import logo from './logo.markup.svg';
import styles from './logo.sass';

const Logo = ({ color }) =>
    <div>
        <div className={styles.logo} style={{ color }} dangerouslySetInnerHTML={{ __html: logo }} />
    </div>;

Logo.propTypes = {
    color: PropTypes.string.isRequired,
};

export default Logo;
