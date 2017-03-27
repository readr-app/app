
import { connect } from 'react-redux';
import merge from 'ramda/src/merge';
import {
    SET_FETCHING_ARTICLE,
    SET_PROGRESS_TIMEOUT,
    CLEAR_PROGRESS_TIMEOUT,
    SET_SUCCESS,
    SET_HAS_LOADING_ERROR,
    SET_HAS_STORING_ERROR,
    SET_ARTICLES,

    setFetchingArticle,
    setProgressTimeout,
    clearProgressTimeout,
    setSuccess,
    setHasLoadingError,
    setHasStoringError,
    setArticles,
} from '../actions';

const initialState = {
    isLoading: false,
    hideProgressTimeout: null,
    success: false,
    loadingError: false,
    storingError: false,
    articles: [],
};

export const reducer = (state = initialState, action) => {
    const assign = merge(state);
    switch (action.type) {
    case SET_FETCHING_ARTICLE:
        return assign({
            isLoading: action.payload,
        });
    case SET_PROGRESS_TIMEOUT:
        return assign({
            hideProgressTimeout: action.payload,
        });
    case CLEAR_PROGRESS_TIMEOUT:
        return assign({
            hideProgressTimeout: null,
        });
    case SET_SUCCESS:
        return assign({
            success: action.payload,
        });
    case SET_HAS_LOADING_ERROR:
        return assign({
            loadingError: action.payload,
        });
    case SET_HAS_STORING_ERROR:
        return assign({
            storingError: action.payload,
        });
    case SET_ARTICLES:
        return assign({
            articles: action.payload,
        });
    default:
        return assign({});
    }
};

const mapStateToProps = ({ index }) => ({
    isLoading: index.isLoading,
    hideProgressTimeout: index.hideProgressTimeout,
    success: index.success,
    loadingError: index.loadingError,
    storingError: index.storingError,
    articles: index.articles,
});

const mapDispatchToProps = dispatch => ({
    setFetchingArticle: bool => dispatch(setFetchingArticle(bool)),
    setProgressTimeout: num => dispatch(setProgressTimeout(num)),
    clearProgressTimeout: () => dispatch(clearProgressTimeout()),
    setSuccess: bool => dispatch(setSuccess(bool)),
    setHasLoadingError: bool => dispatch(setHasLoadingError(bool)),
    setHasStoringError: bool => dispatch(setHasStoringError(bool)),
    setArticles: articles => dispatch(setArticles(articles)),
});

export default function connectIndex(view) {
    return connect(mapStateToProps, mapDispatchToProps)(view);
}
