
import { connect } from 'react-redux';
import merge from 'ramda/src/merge';
import {
    SET_KEYS,
    SET_ARTICLES,
    SET_ARTICLE_COLOR,
    SET_IS_APPENDING_ARTICLE,

    setKeys,
    setArticles,
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
    case SET_ARTICLES:
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
    replace: router.replace,
});

const mapDispatchToProps = dispatch => ({
    setKeys: keys => dispatch(setKeys(keys)),
    setArticles: articles => dispatch(setArticles(articles)),
    setArticleColor: color => dispatch(setArticleColor(color)),
    setIsAppendingArticle: bool => dispatch(setIsAppendingArticle(bool)),
});

export default function connectDetail(view) {
    return connect(mapStateToProps, mapDispatchToProps)(view);
}
