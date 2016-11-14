import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';

import styles from './app.css';

const appEl = document.querySelector('.<%= camelCaseName %>');
appEl.classList.add(...styles.<%= camelCaseName %>.split(' '));
const rootEl = document.createElement('div');

let renderApp = () => {
  const AppRoot = require('./app-root');
  render(
    <AppRoot />,
    rootEl
  );
};

/* Hot Replacement support, won't be bundled to production */
/* eslint-disable modules/no-exports-typo */
if (module.hot) {
  const renderAppHot = renderApp;
  const renderError = error => {
    const RedBox = require('redbox-react').default;

    render(
      <RedBox error={error}/>,
      rootEl
    );
  };

  renderApp = () => {
    try {
      renderAppHot();
    } catch (error) {
      renderError(error);
    }
  };

  module.hot.accept('./app-root', () => {
    setTimeout(renderApp);
  });
}

renderApp();
appEl.appendChild(rootEl);
