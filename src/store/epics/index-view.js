
import prop from 'ramda/src/prop';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/if';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/onErrorResumeNext';
import 'rxjs/add/operator/switchMap';
import {
    FETCH_ARTICLES,
    DOWNLOAD_ARTICLE,
    DOWNLOAD_SUCCESS,
    SHOW_SUCCESS,
    SHOW_ERROR,
    DELETE_ARTICLE,

    ERROR_DOWNLOAD,

    fetchArticles,
    setArticles,
    downloadSuccess,
    showSuccess,
    hideSuccess,
    showError,
    hideError,
} from '../actions';
import { getAll, set, remove } from '../../modules/storage/';
import fetchArticle from '../../modules/fetch/';

const SHOW_FEEDBACK_DURATION = 2000;

const ifArticleElse = (article, if$, else$) =>
    Observable.if(() => Boolean(article), if$, else$);

const saveArticleInDb = article => Observable.fromPromise(set(article.id, article))
    .onErrorResumeNext(() => Observable.of(null))
    .switchMap(result => ifArticleElse(result,
        Observable.of(showSuccess()),
        Observable.of(showError())));

const loadArticlesFromDb = () => Observable.fromPromise(getAll())
    .onErrorResumeNext(() => Observable.of([]))
    .map(setArticles);

const loadArticles = action$ => Observable.merge(
    action$.ofType(FETCH_ARTICLES), action$.ofType(SHOW_SUCCESS))
        .switchMap(loadArticlesFromDb);

const downloadArticle = action$ =>
    action$.ofType(DOWNLOAD_ARTICLE)
        .switchMap(({ payload }) =>
            Observable.fromPromise(fetchArticle(payload))
                .catch(() => Observable.of(null)))
        .switchMap(article => ifArticleElse(article,
            Observable.of(downloadSuccess(article)),
            Observable.of(showError(ERROR_DOWNLOAD))));

const saveArticle = action$ =>
    action$.ofType(DOWNLOAD_SUCCESS)
    .map(prop('payload'))
    .switchMap(saveArticleInDb);

const toggleFeedback = (type, hideAction) => action$ =>
    action$.ofType(type)
        .delay(SHOW_FEEDBACK_DURATION)
        .mapTo(hideAction());

const deleteArticle = action$ => action$.ofType(DELETE_ARTICLE)
    .map(prop('payload'))
    .switchMap(articleId => Observable.fromPromise(remove(articleId)))
    .mapTo(fetchArticles());

export default combineEpics(
    loadArticles,
    downloadArticle,
    saveArticle,
    deleteArticle,
    toggleFeedback(SHOW_SUCCESS, hideSuccess),
    toggleFeedback(SHOW_ERROR, hideError));
