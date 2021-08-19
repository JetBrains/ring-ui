import React from 'react';
import {render} from 'react-dom';

import AppRoot from './app-root';
import './app.css';

const appEl = document.querySelector('.app-root');
const rootEl = document.createElement('div');

let renderApp = () => {
  render(
    <AppRoot/>,
    rootEl
  );
};

/* Hot Replacement support, won't be bundled to production */
if (module.hot) {
  const renderAppHot = renderApp;
  const renderError = error => {
    render(
      <pre style={{color: 'red'}}>${error.toString()}</pre>,
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
