
/* eslint
    "react/no-danger": 0,
    "jsx-a11y/anchor-has-content": 0
    "camelcase": 0
*/

import React, { PropTypes } from 'react';
import { Link, Helpers } from 'react-scroll';
import classnames from 'classnames';
import mdlBtn from 'material-design-lite/src/button/_button.scss';
import TimeAgo from '../time-ago/time-ago';
import CopyButton, { hasClipboardSupport } from '../copy-button/copy-button';
import styles from './article.sass';

const btnClass = classnames(styles.button, mdlBtn['mdl-button']);

const copyToClipBoardBtn = (url) => {
    if (hasClipboardSupport()) {
        return (<CopyButton
            className={btnClass}
            caption="Copy article-URL"
            data={url}
        />);
    }
    return null;
};

const Article = ({ name, id, url, color, title, intro, content, created_at, onSetActive }) =>
    (<article className={styles.article}>
        <Link
            aria-hidden="true"
            name={name}
            to={name}
            onSetActive={() =>
                onSetActive({ color, id, url, title, created_at })}
            spy
        />
        <h1>{title}</h1>
        <div className={styles.time}>
            Saved <TimeAgo timestamp={created_at} /> ago
        </div>
        <p>
            <em>{intro}</em>
        </p>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <footer className={styles.bottom}>
            <a
                href={url}
                className={btnClass}
                target="_blank"
                rel="noopener noreferrer"
            >
                View original article
            </a>
            {copyToClipBoardBtn(url)}
        </footer>
    </article>);

Article.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    intro: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.number.isRequired,
    onSetActive: PropTypes.func.isRequired,
};

export default Helpers.Element(Article);
