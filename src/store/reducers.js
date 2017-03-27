
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as indexReducr } from './containers/index';

export default combineReducers({
    routing: routerReducer,
    index: indexReducr,
});
