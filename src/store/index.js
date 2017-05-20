
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { createLogger } from 'redux-logger';
import reducers from './reducers';
import rootEpic from './epics/';

const epicMiddleware = createEpicMiddleware(rootEpic);
const logger = createLogger({ collapsed: true });
const store = createStore(reducers, applyMiddleware(epicMiddleware, logger));

export default function getStore() {
    return store;
}
