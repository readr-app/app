
/* eslint "camelcase": 0 */

import React, { Component, PropTypes } from 'react';
import uniq from 'ramda/src/uniq';
import equals from 'ramda/src/equals';
import connectDetail from '../../store/containers/detail';
import mountNode from '../../';
import { trackEvent } from '../../modules/tracking/';
import { get, getKeys } from '../../modules/storage/';
import scrollOffset from '../../modules/util/scroll-offset';
import ThemeColor from '../../components/theme-color/theme-color';
import FallbackText from '../../components/fallback-text/fallback-text';
import Article, { articleShape } from '../../components/article/article';
import styles from './detail.sass';

const removeCurrentArticleIdFromKeys = (keys, articleId) => {
    const index = keys.indexOf(articleId);
    return [
        ...keys.slice(0, index),
        ...keys.slice(index + 1),
    ];
};

class Detail extends Component {

    constructor(props) {
        super(props);
        this.onScroll = this.onScroll.bind(this);
        this.setActive = this.setActive.bind(this);
    }

    componentWillMount() {
        const { id } = this.props;
        Promise.all([
            get(id),
            getKeys(),
        ]).then(([article, allKeys]) => {
            const { color } = article;
            const articles = [{ ...article, ...{ id } }];
            const keys = removeCurrentArticleIdFromKeys(uniq(allKeys), id);
            this.props.setArticles(articles);
            this.props.setKeys(keys);
            this.props.setArticleColor(color);
        });
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll);
    }

    shouldComponentUpdate(nextProps) {
        return !equals(this.props, nextProps);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }

    onScroll() {
        return requestAnimationFrame(() => {
            if (this.props.appending) {
                return;
            }
            this.props.setIsAppendingArticle(true);
            const { height } = mountNode.getBoundingClientRect();
            const position = window.innerHeight + scrollOffset.y + 20;
            if (position > height) {
                this.loadNext();
            } else {
                this.props.setIsAppendingArticle(false);
            }
        });
    }

    setActive({ color, id, url, title, created_at }) {
        this.props.replace(`/article/${id}`);
        this.props.setArticleColor(color);
        trackEvent('View article', { url, title, created_at });
    }

    loadNext() {
        const [nextId, ...keys] = this.props.keys;
        get(nextId).then((article) => {
            const articles = [...this.props.articles, {
                ...article,
                ...{ id: nextId },
            }];
            this.props.setKeys(keys);
            this.props.setArticles(articles);
            if (keys.length) {
                this.props.setIsAppendingArticle(false);
            }
        });
    }

    render() {
        /* eslint "react/no-danger": 0 */
        if (!this.props.articles.length) {
            return (<FallbackText
                className={styles.loading}
                text="Loading &hellip;"
            />);
        }

        const { color } = this.props;

        return (<ThemeColor color={color}>
            <div className={styles.outer}>
                {this.props.articles.map((article, i) => (
                    <Article
                        name={`article-${i}`}
                        key={i}
                        id={article.id}
                        url={article.url}
                        color={article.color}
                        title={article.title}
                        created_at={article.created_at}
                        intro={article.intro}
                        content={article.content}
                        onSetActive={this.setActive}
                    />))}
            </div>
        </ThemeColor>);
    }

}

Detail.propTypes = {
    keys: PropTypes.array.isRequired,
    articles: PropTypes.arrayOf(PropTypes.shape(articleShape)).isRequired,
    color: PropTypes.string,
    appending: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    replace: PropTypes.func.isRequired,
    setKeys: PropTypes.func.isRequired,
    setArticles: PropTypes.func.isRequired,
    setArticleColor: PropTypes.func.isRequired,
    setIsAppendingArticle: PropTypes.func.isRequired,
};

export default connectDetail(Detail);
