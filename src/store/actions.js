
export const SET_FETCHING_ARTICLE = 'SET_FETCHING_ARTICLE';

export const setFetchingArticle = payload => ({
    type: SET_FETCHING_ARTICLE,
    payload,
});

export const SET_PROGRESS_TIMEOUT = 'SET_PROGRESS_TIMEOUT';

export const setProgressTimeout = payload => ({
    type: SET_PROGRESS_TIMEOUT,
    payload,
});

export const CLEAR_PROGRESS_TIMEOUT = 'CLEAR_PROGRESS_TIMEOUT';

export const clearProgressTimeout = () => ({
    type: CLEAR_PROGRESS_TIMEOUT,
});

export const SET_SUCCESS = 'SET_SUCCESS';

export const setSuccess = payload => ({
    type: SET_SUCCESS,
    payload,
});

export const SET_HAS_LOADING_ERROR = 'SET_HAS_LOADING_ERROR';

export const setHasLoadingError = payload => ({
    type: SET_HAS_LOADING_ERROR,
    payload,
});

export const SET_HAS_STORING_ERROR = 'SET_HAS_STORING_ERROR';

export const setHasStoringError = payload => ({
    type: SET_HAS_STORING_ERROR,
    payload,
});

export const SET_ARTICLES = 'SET_ARTICLES';

export const setArticles = payload => ({
    type: SET_ARTICLES,
    payload,
});

export const SET_KEYS = 'SET_KEYS';

export const setKeys = payload => ({
    type: SET_KEYS,
    payload,
});

export const SET_ARTICLE_COLOR = 'SET_ARTICLE_COLOR';

export const setArticleColor = payload => ({
    type: SET_ARTICLE_COLOR,
    payload,
});

export const SET_IS_APPENDING_ARTICLE = 'SET_IS_APPENDING_ARTICLE';

export const setIsAppendingArticle = payload => ({
    type: SET_IS_APPENDING_ARTICLE,
    payload,
});
