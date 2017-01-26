
/* eslint "camelcase": 0 */

import React, { PureComponent, PropTypes } from 'react';
import uniq from 'ramda/src/uniq';
import { trackEvent } from '../../modules/tracking/';
import { get, getKeys } from '../../modules/storage/';
import ThemeColor from '../../components/theme-color/theme-color';
import FallbackText from '../../components/fallback-text/fallback-text';
import TimeAgo from '../../components/time-ago/time-ago';
import styles from './detail.sass';

class Detail extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            article: null,
            keys: null,
        };
        this.loadNext = this.loadNext.bind(this);
    }

    componentWillMount() {
        Promise.all([
            get(this.props.params.id),
            getKeys(),
        ]).then(([article, allKeys]) => {
            const keys = this.removeCurrentArticleIdFromKeys(
                uniq(allKeys), this.props.params.id);
            this.setState({ article, keys });
        });
    }

    removeCurrentArticleIdFromKeys(keys, articleId) {
        const index = keys.indexOf(articleId);
        return [
            ...keys.slice(0, index),
            ...keys.slice(index + 1),
        ];
    }

    loadNext() {
        const { router } = this.props;
        const [ nextId, ...keys ] = this.state.keys;
        router.replace(`/article/${nextId}`);
        get(nextId).then(article =>
            this.setState({ article, keys }));
    }

    render() {
        /* eslint "react/no-danger": 0 */
        if (this.state.article === null) {
            return (<FallbackText
                className={styles.loading}
                text="Loading &hellip;"
            />);
        }

        const { id } = this.props.params;
        const { url, title, intro, content, color, created_at } = this.state.article;

        trackEvent('View article', { id, url, title, created_at });

        return (<ThemeColor color={color}>
            <article className={styles.article}>
                <h1>{title}</h1>
                <div className={styles.time}>
                    Saved <TimeAgo timestamp={created_at} /> ago
                </div>
                <p>
                    <em>{intro}</em>
                </p>
                <div dangerouslySetInnerHTML={{ __html: content }} />
                {this.state.keys.length ?
                    <button onClick={this.loadNext}>Load next</button> : null}
            </article>
        </ThemeColor>);
    }

}

Detail.propTypes = {
    params: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
};

export default Detail;
