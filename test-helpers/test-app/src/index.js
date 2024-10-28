import {StrictMode} from '@jetbrains/ring-ui-built/node_modules/react';
import {createRoot} from '@jetbrains/ring-ui-built/node_modules/react-dom/client';

import App from './app';

const rootElement = document.getElementById('root');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
