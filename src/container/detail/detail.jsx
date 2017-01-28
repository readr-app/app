
/* eslint "camelcase": 0 */

import React, { PureComponent, PropTypes } from 'react';
import uniq from 'ramda/src/uniq';
import { trackEvent } from '../../modules/tracking/';
import { get, getKeys } from '../../modules/storage/';
import ThemeColor from '../../components/theme-color/theme-color';
import FallbackText from '../../components/fallback-text/fallback-text';
import Article from '../../components/article/article';
import styles from './detail.sass';

class Detail extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            keys: [],
            color: null,
        };
        this.loadNext = this.loadNext.bind(this);
    }

    componentWillMount() {
        Promise.all([
            get(this.props.params.id),
            getKeys(),
        ]).then(([article, allKeys]) => {
            const { color } = article;
            const articles = [ article ];
            const keys = this.removeCurrentArticleIdFromKeys(
                uniq(allKeys), this.props.params.id);
            this.setState({ articles, color, keys });
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
        get(nextId).then(article => {
            const { url, title, created_at, color } = article;
            const articles = [ ...this.state.articles, article ];
            trackEvent('Load article inline', { url, title, created_at });
            this.setState({ articles, color, keys });
        });
    }

    render() {
        /* eslint "react/no-danger": 0 */
        if (!this.state.articles.length) {
            return (<FallbackText
                className={styles.loading}
                text="Loading &hellip;"
            />);
        }

        const { color } = this.state;

        return (<ThemeColor color={color}>
            <div>
                {this.state.articles.map((article, i) => (
                    <Article
                        key={i}
                        url={article.url}
                        title={article.title}
                        created_at={article.created_at}
                        intro={article.intro}
                        content={article.content}
                    />))}
                {this.state.keys.length ?
                    <button onClick={this.loadNext}>Load next</button> : null}
            </div>
        </ThemeColor>);
    }

}

Detail.propTypes = {
    params: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
};

export default Detail;
