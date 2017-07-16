
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as indexReducer } from './containers/index';
import { reducer as detailReducer } from './containers/detail';

export default combineReducers({
    routing: routerReducer,
    index: indexReducer,
    detail: detailReducer,
});
