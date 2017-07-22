import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './fallback-text.sass';

const FallbackText = ({ text, id = '', className = '' }) =>
    <p className={classnames(styles.text, className)} id={id}>
        {text}
    </p>;

FallbackText.propTypes = {
    id: PropTypes.string,
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default FallbackText;
