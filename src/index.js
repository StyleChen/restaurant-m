import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import './styles/base.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './reducer';

const store =  process.env.NODE_ENV === 'development' ? createStore(reducer, applyMiddleware(thunk, createLogger)) : createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();

console.log(process.env.NODE_ENV)