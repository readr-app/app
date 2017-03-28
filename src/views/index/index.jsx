
/* eslint "camelcase": 0 */

import React, { PureComponent, PropTypes } from 'react';
import connectIndex from '../../store/containers/index';
import { theme_color } from '../../../config/manifest';
import { trackEvent } from '../../modules/tracking/';
import fetchArticle from '../../modules/fetch/';
import { set, getAll, remove } from '../../modules/storage/';
import ThemeColor from '../../components/theme-color/theme-color';
import Form from '../../components/form/form';
import Progress from '../../components/progress/progress';
import List from '../../components/list/list';
import FallbackText from '../../components/fallback-text/fallback-text';
import { articleShape } from '../../components/article/article';
import styles from './index.sass';

const MIN_LOADING_DURATION = 1500;

const SHOW_FEEDBACK_DURATION = 2000;

const minLoadingTime = () => new Promise(resolve =>
    setTimeout(() => resolve(), MIN_LOADING_DURATION));

class Index extends PureComponent {

    constructor(props) {
        super(props);
        this.startDownload = this.startDownload.bind(this);
        this.saveArticle = this.saveArticle.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
        this.hideProgress = this.hideProgress.bind(this);
    }

    componentWillMount() {
        getAll().then(articles =>
            this.props.setArticles(articles));
    }

    getProgressProperty() {
        const {
            isLoading,
            success,
            loadingError,
            storingError,
        } = this.props;

        if (isLoading) {
            return { isLoading };
        }

        if (success) {
            return { success };
        }

        if (loadingError) {
            return { loadingError };
        }

        if (storingError) {
            return { storingError };
        }

        return null;
    }

    startDownload(articleUrl) {
        this.props.setFetchingArticle(true);
        trackEvent('Start download', articleUrl);
        Promise.all([
            fetchArticle(articleUrl),
            minLoadingTime(),
        ])
        .then(this.saveArticle(articleUrl))
        .catch(() => {
            trackEvent('Download failed', articleUrl);
            this.props.setFetchingArticle(false);
            this.props.setProgressTimeout(setTimeout(
                this.hideProgress, SHOW_FEEDBACK_DURATION));
            this.props.setHasLoadingError(true);
        });
    }

    saveArticle(articleUrl) {
        return ([article]) => {
            trackEvent('Download succeeded', articleUrl);
            return set(article.id, {
                title: article.title,
                intro: article.intro,
                content: article.content,
                color: article.color,
                url: articleUrl,
                created_at: Date.now(),
            }).then(() => getAll().then((articles) => {
                this.props.setFetchingArticle(false);
                this.props.setProgressTimeout(setTimeout(
                    this.hideProgress, SHOW_FEEDBACK_DURATION));
                this.props.setSuccess(true);
                this.props.setArticles(articles);
            })).catch(() => {
                trackEvent('Storing failed', articleUrl);
                this.props.setFetchingArticle(false);
                this.props.setProgressTimeout(setTimeout(
                    this.hideProgress, SHOW_FEEDBACK_DURATION));
                this.props.setHasStoringError(true);
            });
        };
    }

    deleteArticle(articleId) {
        return () => remove(articleId).then(() =>
            getAll().then(articles =>
                this.props.setArticles(articles)));
    }

    hideProgress() {
        const { hideProgressTimeout } = this.props;
        clearTimeout(hideProgressTimeout);
        this.props.setFetchingArticle(false);
        this.props.clearProgressTimeout();
        this.props.setSuccess(false);
        this.props.setHasLoadingError(false);
        this.props.setHasStoringError(false);
    }

    render() {
        const progressProperty = this.getProgressProperty();

        return (<ThemeColor color={theme_color}>
            <main className={styles.content}>
                {progressProperty ?
                    (<Progress {...progressProperty} />) :
                    (<Form startDownload={this.startDownload} />)}
                {this.props.articles.length ?
                    (<List
                        articles={this.props.articles}
                        deleteArticle={this.deleteArticle}
                    />) :
                    (<FallbackText text="Not articles saved yet." />)}
            </main>
        </ThemeColor>);
    }

}

Index.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    hideProgressTimeout: PropTypes.number,
    success: PropTypes.bool.isRequired,
    loadingError: PropTypes.bool.isRequired,
    storingError: PropTypes.bool.isRequired,
    articles: PropTypes.arrayOf(PropTypes.shape(articleShape)).isRequired,
    setFetchingArticle: PropTypes.func.isRequired,
    setProgressTimeout: PropTypes.func.isRequired,
    clearProgressTimeout: PropTypes.func.isRequired,
    setSuccess: PropTypes.func.isRequired,
    setHasLoadingError: PropTypes.func.isRequired,
    setHasStoringError: PropTypes.func.isRequired,
    setArticles: PropTypes.func.isRequired,
};

export default connectIndex(Index);
