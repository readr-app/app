/* eslint "camelcase": 0 */

import React, { PureComponent, PropTypes } from 'react';
import connectIndex from '../../store/containers/index';
import { theme_color } from '../../../config/manifest';
import { trackEvent } from '../../modules/tracking/';
import ThemeColor from '../../components/theme-color/theme-color';
import Form from '../../components/form/form';
import Progress from '../../components/progress/progress';
import List from '../../components/list/list';
import FallbackText from '../../components/fallback-text/fallback-text';
import { articleShape } from '../../components/article/article';
import styles from './index.sass';

class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.startDownload = this.startDownload.bind(this);
    }

    componentWillMount() {
        this.props.fetchArticles();
    }

    getProgressProperty() {
        const { isLoading, success, error } = this.props;

        if (isLoading) {
            return { isLoading };
        }

        if (success) {
            return { success };
        }

        if (error) {
            return { error };
        }

        return null;
    }

    startDownload(articleUrl) {
        trackEvent('Start download', articleUrl);
        this.props.downloadArticle(articleUrl);
    }

    render() {
        const progressProperty = this.getProgressProperty();

        return (
            <ThemeColor color={theme_color}>
                <main className={styles.content}>
                    {progressProperty
                        ? <Progress {...progressProperty} />
                        : <Form startDownload={this.startDownload} />}
                    {this.props.articles.length
                        ? <List
                              articles={this.props.articles}
                              deleteArticle={articleId => this.props.deleteArticle(articleId)}
                          />
                        : <FallbackText id="index-fallback-text" text="No articles saved yet." />}
                </main>
            </ThemeColor>
        );
    }
}

Index.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    articles: PropTypes.arrayOf(PropTypes.shape(articleShape)).isRequired,
    fetchArticles: PropTypes.func.isRequired,
    downloadArticle: PropTypes.func.isRequired,
    deleteArticle: PropTypes.func.isRequired,
};

export default connectIndex(Index);
