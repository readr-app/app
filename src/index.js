
import 'babel-polyfill';
import { createElement } from 'react';
import { render } from 'react-dom';
import Routes from './routes/routes';
import initCache from './modules/cache/cache';

const mountNode = document.getElementById('readr');
const App = createElement(Routes);

render(App, mountNode);

initCache();
