import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import merge from 'ramda/src/merge';
import {
    SET_KEYS,
    SET_DETAIL_ARTICLES,
    SET_ARTICLE_COLOR,
    SET_IS_APPENDING_ARTICLE,
    getInitialDetail,
    appendArticle,
    setArticleColor,
    setIsAppendingArticle,
} from '../actions';

const initialState = {
    keys: [],
    articles: [],
    color: null,
    appending: false,
};

export const reducer = (state = initialState, action) => {
    const assign = merge(state);
    switch (action.type) {
        case SET_ARTICLE_COLOR:
            return assign({
                color: action.payload,
            });
        case SET_KEYS:
            return assign({
                keys: action.payload,
            });
        case SET_DETAIL_ARTICLES:
            return assign({
                articles: action.payload,
            });
        case SET_IS_APPENDING_ARTICLE:
            return assign({
                appending: action.payload,
            });
        default:
            return assign({});
    }
};

const mapStateToProps = ({ detail }, { params, router }) => ({
    ...detail,
    id: params.id,
    replaceUrl: router.replace,
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getInitialDetail,
            appendArticle,
            setArticleColor,
            setIsAppendingArticle,
        },
        dispatch
    );

export default function connectDetail(view) {
    return connect(mapStateToProps, mapDispatchToProps)(view);
}
