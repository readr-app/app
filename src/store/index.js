import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import reducers from './reducers';
import rootEpic from './epics/';
import { SET_IS_APPENDING_ARTICLE } from './actions';

const middlewares = [createEpicMiddleware(rootEpic)];

if (__DEV__) {
    // eslint-disable-next-line global-require
    const { createLogger } = require('redux-logger');
    const loggerOptions = {
        collapsed: true,
        predicate: (getState, action) => action.type !== SET_IS_APPENDING_ARTICLE,
    };
    middlewares.push(createLogger(loggerOptions));
}

const store = createStore(reducers, applyMiddleware(...middlewares));

export default function getStore() {
    return store;
}
