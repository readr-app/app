
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './fallback-text.sass';

const FallbackText = ({ text, className = '' }) => (
    <p className={classnames(styles.text, className)}>{text}</p>
);

FallbackText.propTypes = {
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default FallbackText;
