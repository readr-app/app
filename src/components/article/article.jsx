
import React, { PropTypes } from 'react';
import { trackEvent } from '../../modules/tracking/';
import TimeAgo from '../time-ago/time-ago';
import styles from './article.sass';

const Article = ({ url, title, intro, content, created_at}) => {
    trackEvent('View article', { url, title, created_at });
    return (<article className={styles.article}>
        <h1>{title}</h1>
        <div className={styles.time}>
            Saved <TimeAgo timestamp={created_at} /> ago
        </div>
        <p>
            <em>{intro}</em>
        </p>
        <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>);
};

Article.propTypes = {
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    intro: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.number.isRequired,
};

export default Article;
