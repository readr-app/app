
import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { onRouteChange } from '../modules/tracking/';
import Main from '../container/main/main';
import Index from '../container/index/index';
import Detail from '../container/detail/detail';
import About from '../container/about/about';
import './routes.sass';

const Routes = () => (
    <Router
        history={browserHistory}
        onUpdate={onRouteChange}
    >
        <Route path="/" component={Main}>
            <IndexRoute component={Index} />
            <Route path="about" component={About} />
            <Route path="article/:id" component={Detail} />
        </Route>
    </Router>
);

export default Routes;
