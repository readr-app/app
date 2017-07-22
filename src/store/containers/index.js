import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import merge from 'ramda/src/merge';
import {
    DOWNLOAD_ARTICLE,
    DOWNLOAD_SUCCESS,
    SHOW_SUCCESS,
    HIDE_SUCCESS,
    SHOW_ERROR,
    HIDE_ERROR,
    SET_ARTICLES,
    fetchArticles,
    downloadArticle,
    deleteArticle,
} from '../actions';

const initialState = {
    isLoading: false,
    success: false,
    error: false,
    articles: [],
};

export const reducer = (state = initialState, action) => {
    const assign = merge(state);
    switch (action.type) {
        case DOWNLOAD_ARTICLE:
            return assign({
                isLoading: true,
            });
        case DOWNLOAD_SUCCESS:
            return assign({
                success: true,
                isLoading: false,
            });
        case SHOW_SUCCESS:
            return assign({
                success: true,
            });
        case HIDE_SUCCESS:
            return assign({
                success: false,
            });
        case SHOW_ERROR:
            return assign({
                isLoading: false,
                error: action.payload,
            });
        case HIDE_ERROR:
            return assign({
                error: false,
            });
        case SET_ARTICLES:
            return assign({
                articles: action.payload,
            });
        default:
            return state;
    }
};

const mapStateToProps = ({ index }) => ({ ...index });

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            fetchArticles,
            downloadArticle,
            deleteArticle,
        },
        dispatch
    );

export default function connectIndex(view) {
    return connect(mapStateToProps, mapDispatchToProps)(view);
}
