
export const FETCH_ARTICLES = 'FETCH_ARTICLES';

export const fetchArticles = () => ({
    type: FETCH_ARTICLES,
});

export const DOWNLOAD_ARTICLE = 'DOWNLOAD_ARTICLE';

export const downloadArticle = payload => ({
    type: DOWNLOAD_ARTICLE,
    payload,
});

export const DOWNLOAD_SUCCESS = 'DOWNLOAD_SUCCESS';

export const downloadSuccess = payload => ({
    type: DOWNLOAD_SUCCESS,
    payload,
});

export const SHOW_SUCCESS = 'SHOW_SUCCESS';

export const showSuccess = () => ({
    type: SHOW_SUCCESS,
});

export const HIDE_SUCCESS = 'HIDE_SUCCESS';

export const hideSuccess = () => ({
    type: HIDE_SUCCESS,
});

export const SHOW_ERROR = 'SHOW_ERROR';

export const ERROR_DOWNLOAD = 'ERROR_DOWNLOAD';
export const ERROR_STORING = 'ERROR_STORING';

export const showError = payload => ({
    type: SHOW_ERROR,
    payload,
});

export const HIDE_ERROR = 'HIDE_ERROR';

export const hideError = () => ({
    type: HIDE_ERROR,
});

export const SET_ARTICLES = 'SET_ARTICLES';

export const setArticles = payload => ({
    type: SET_ARTICLES,
    payload,
});

export const DELETE_ARTICLE = 'DELETE_ARTICLE';

export const deleteArticle = payload => ({
    type: DELETE_ARTICLE,
    payload,
});

export const GET_INITIAL_DETAIL = 'GET_INITIAL_DETAIL';

export const getInitialDetail = payload => ({
    type: GET_INITIAL_DETAIL,
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
