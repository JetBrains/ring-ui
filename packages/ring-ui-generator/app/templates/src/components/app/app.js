import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';

import './app.scss';

const rootEl = document.getElementById('app__root');

let renderApp = () => {
  const AppRoot = require('./app__root');
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

  module.hot.accept('./app__root', () => {
    setTimeout(renderApp);
  });
}

renderApp();
