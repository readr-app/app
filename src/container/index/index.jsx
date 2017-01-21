
/* eslint "camelcase": 0 */

import React, { PureComponent } from 'react';
import { theme_color } from '../../../config/manifest';
import { trackEvent } from '../../modules/tracking/';
import fetchArticle from '../../modules/fetch/';
import { set, getAll, remove } from '../../modules/storage/';
import ThemeColor from '../../components/theme-color/theme-color';
import Form from '../../components/form/form';
import Progress from '../../components/progress/progress';
import List from '../../components/list/list';
import FallbackText from '../../components/fallback-text/fallback-text';
import styles from './index.sass';

const MIN_LOADING_DURATION = 1500;

const SHOW_FEEDBACK_DURATION = 2000;

const minLoadingTime = () => new Promise(resolve =>
    setTimeout(() => resolve(), MIN_LOADING_DURATION));

export default class Main extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            isLoading: false,
            success: false,
            loadingError: false,
            storingError: false,
            hideProgressTimeout: null,
        };
        this.startDownload = this.startDownload.bind(this);
        this.saveArticle = this.saveArticle.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
        this.hideProgress = this.hideProgress.bind(this);
    }

    componentWillMount() {
        getAll().then(articles =>
            this.setState({ articles }));
    }

    getProgressProperty() {
        const {
            isLoading,
            success,
            loadingError,
            storingError,
        } = this.state;

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
        this.setState({ isLoading: true });
        trackEvent('Start download', articleUrl);
        Promise.all([
            fetchArticle(articleUrl),
            minLoadingTime(),
        ])
        .then(this.saveArticle(articleUrl))
        .catch(() => {
            trackEvent('Download failed', articleUrl);
            this.setState({
                isLoading: false,
                loadingError: true,
                hideProgressTimeout: setTimeout(this.hideProgress,
                    SHOW_FEEDBACK_DURATION),
            });
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
            }).then(() => getAll().then(articles =>
                this.setState({
                    isLoading: false,
                    success: true,
                    hideProgressTimeout: setTimeout(
                        this.hideProgress, SHOW_FEEDBACK_DURATION),
                    articles,
                })))
            .catch(() => {
                trackEvent('Storing failed', articleUrl);
                this.setState({
                    isLoading: false,
                    storingError: true,
                    hideProgressTimeout: setTimeout(
                        this.hideProgress, SHOW_FEEDBACK_DURATION),
                });
            });
        };
    }

    deleteArticle(articleId) {
        return () => remove(articleId).then(() =>
            getAll().then(articles =>
                this.setState({ articles })));
    }

    hideProgress() {
        const { hideProgressTimeout } = this.state;
        clearTimeout(hideProgressTimeout);
        this.setState({
            isLoading: false,
            success: false,
            loadingError: false,
            storingError: false,
            hideProgressTimeout: null,
        });
    }

    render() {
        const progressProperty = this.getProgressProperty();

        return (<ThemeColor color={theme_color}>
            <main className={styles.content}>
                {progressProperty ?
                    (<Progress {...progressProperty} />) :
                    (<Form startDownload={this.startDownload} />)}
                {this.state.articles.length ?
                    (<List
                        articles={this.state.articles}
                        deleteArticle={this.deleteArticle}
                    />) :
                    (<FallbackText text="Not articles saved yet." />)}
            </main>
        </ThemeColor>);
    }

}
