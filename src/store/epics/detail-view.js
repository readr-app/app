
import not from 'ramda/src/not';
import prop from 'ramda/src/prop';
import uniq from 'ramda/src/uniq';
import length from 'ramda/src/length';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import {
    GET_INITIAL_DETAIL,
    SET_KEYS,
    APPEND_ARTICLE,

    setKeys,
    setDetailArticles,
    setArticleColor,
    setIsAppendingArticle,
} from '../actions';
import { get, getKeys } from '../../modules/storage/';

const removeCurrentArticleIdFromKeys = (keys, articleId) => {
    const index = keys.indexOf(articleId);
    return [
        ...keys.slice(0, index),
        ...keys.slice(index + 1),
    ];
};

const loadArticleAndKeys = articleId => Observable
    .fromPromise(Promise.all([
        get(articleId),
        getKeys(),
    ]))
    .map(([article, keys]) => ({ article, keys }));

const dispatchInitialData = dispatch => ({ article, keys }) => {
    const { color, id } = article;
    const articles = [{ ...article, ...{ id } }];
    const newKeys = removeCurrentArticleIdFromKeys(uniq(keys), id);
    dispatch(setKeys(newKeys));
    dispatch(setArticleColor(color));
    return setDetailArticles(articles);
};

const loadArticles = ({ getState }) => () => {
    const { detail: props } = getState();
    const { articles } = props;
    const [nextId, ...keys] = props.keys;
    return Observable.fromPromise(get(nextId))
        .switchMap(article => Observable.of({
            article,
            articles,
            nextId,
            keys,
        }));
};

const dispatchResult = state => (result) => {
    const { article, articles, nextId, keys } = result;
    const newArticles = [...articles, {
        ...article,
        ...{ id: nextId },
    }];
    state.dispatch(setKeys(keys));
    return setDetailArticles(newArticles);
};

const getInitialDetail = (action$, state) => action$.ofType(GET_INITIAL_DETAIL)
    .map(prop('payload'))
    .switchMap(loadArticleAndKeys)
    .map(dispatchInitialData(state.dispatch));

const appendArticle = (action$, state) => action$.ofType(APPEND_ARTICLE)
    .switchMap(loadArticles(state))
    .map(dispatchResult(state));

const updatePolling = action$ => action$.ofType(SET_KEYS)
    .map(prop('payload'))
    .map(length)
    .map(not)
    .map(setIsAppendingArticle);

export default combineEpics(
    appendArticle,
    updatePolling,
    getInitialDetail);
