// importing a css file requires adding the .css extension at the end. Webpack is able to handle css file as well
// notice we don't specify a relative path here. Webpack will assume this is an npm module, which is correct in this case
// notice we don't have import something from here, because this is different from importing javascript file and we don't actually use the assigned variable anyway
import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';
// development only axios helpers!
import axios from 'axios';
window.axios = axios;

/**
 * The purpose of redux-thunk as a middleware is to inspect the values returned by the action creators
 * If the action creator doesn't return an action (vanilla Redux), but instead return a function, redux-thunk
 * will automatically call that returned function, passing in the dispatch function as an argument, so we have direct access
 * to dispatch the action whenever we want
 */
const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  // use the provider to provide the state directly to all components in App
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
