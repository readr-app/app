
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import mdlprogress from 'material-design-lite/src/progress/_progress.scss';
import { ERROR_DOWNLOAD, ERROR_STORING } from '../../store/actions';
import styles from './progress.sass';

const ID_LOADING = 'progress-loading';

const ID_SUCCESS = 'progress-success';

const ID_ERROR = 'progress-error';

const getErrorText = (errorType) => {
    if (errorType === ERROR_DOWNLOAD) {
        return 'Could not load the article.';
    }
    if (errorType === ERROR_STORING) {
        return 'Could not store the article in the database.';
    }
    return null;
};

const getProgressBar = () => {
    const outer = classnames(styles.bar, mdlprogress['mdl-progress'],
        mdlprogress['mdl-progress__indeterminate']);
    const progress = classnames(mdlprogress.progressbar,
        mdlprogress.bar, mdlprogress.bar1);
    const buffer = classnames(mdlprogress.bufferbar,
        mdlprogress.bar, mdlprogress.bar2);
    const aux = classnames(mdlprogress.auxbar,
        mdlprogress.bar, mdlprogress.bar3);
    return (
        <div className={outer}>
            <div className={progress} style={{ width: '0%' }} />
            <div className={buffer} style={{ width: '100%' }} />
            <div className={aux} style={{ width: '0%', mask: 'none' }} />
        </div>
    );
};

const Progress = (props) => {
    const {
        isLoading,
        success,
        error,
    } = props;
    const errorTxt = getErrorText(error);

    if (isLoading) {
        return (<div className={styles.progress} id={ID_LOADING}>
            {getProgressBar()}
            <span className={styles.caption}>Loading the article. Gimme a sec &hellip;</span>
        </div>);
    }

    if (success) {
        return (<div className={styles.progress} id={ID_SUCCESS}>
            <span className={styles.caption}>
                Article successfully stored. Happy reading!
            </span>
        </div>);
    }

    if (errorTxt) {
        return (<div className={styles.progress} id={ID_ERROR}>
            <span className={styles.caption}>{errorTxt}</span>
        </div>);
    }

    return null;
};

Progress.propTypes = {
    isLoading: PropTypes.bool,
    success: PropTypes.bool,
    error: PropTypes.bool,
};

export default Progress;
