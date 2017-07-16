
import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import { onRouteChange } from '../modules/tracking/';
import getStore from '../store/';
import Main from '../views/main/main';
import Index from '../views/index/index';
import Detail from '../views/detail/detail';
import About from '../views/about/about';
import './routes.sass';

const store = getStore();
const history = syncHistoryWithStore(browserHistory, store);

const Routes = () => (
    <Provider store={store}>
        <Router
            history={history}
            onUpdate={onRouteChange}
        >
            <Route path="/" component={Main}>
                <IndexRoute component={Index} />
                <Route path="about" component={About} />
                <Route path="article/:id" component={Detail} />
            </Route>
        </Router>
    </Provider>
);

export default Routes;
