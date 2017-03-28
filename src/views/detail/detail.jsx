
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
import Article from '../../components/article/article';
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
        this.state = {
            articles: [],
            keys: [],
            color: null,
        };
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
            this.setState({ articles, color, keys });
        });
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll);
    }

    shouldComponentUpdate(_, nextState) {
        return !equals(this.state, nextState);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }

    onScroll() {
        return requestAnimationFrame(() => {
            if (this.appendingNext) {
                return;
            }
            this.appendingNext = true;
            const { height } = mountNode.getBoundingClientRect();
            const position = window.innerHeight + scrollOffset.y + 20;
            if (position > height) {
                this.loadNext();
            } else {
                this.appendingNext = false;
            }
        });
    }

    setActive({ color, id, url, title, created_at }) {
        this.props.replace(`/article/${id}`);
        this.setState({ color });
        trackEvent('View article', { url, title, created_at });
    }

    loadNext() {
        const [nextId, ...keys] = this.state.keys;
        get(nextId).then((article) => {
            const articles = [...this.state.articles, {
                ...article,
                ...{ id: nextId },
            }];
            this.setState({ articles, keys }, () => {
                if (keys.length) {
                    this.appendingNext = false;
                }
            });
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
            <div className={styles.outer}>
                {this.state.articles.map((article, i) => (
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
    id: PropTypes.string.isRequired,
    replace: PropTypes.func.isRequired,
};

export default connectDetail(Detail);
