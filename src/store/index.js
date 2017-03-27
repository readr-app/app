
import { createStore } from 'redux';
import reducers from './reducers';

const store = createStore(reducers);

export default function getStore() {
    return store;
}
