// Allows overriding ReactDOM.render when using React 18:
// import * as client from 'react-dom/client'
// import {setClient} from '@ring-ui/global/react-render-adapter'
//
// setClient(client)
import {
  render as legacyRender,
  unmountComponentAtNode as legacyUnmountComponentAtNode,
  hydrate as legacyHydrate
} from 'react-dom';

/* eslint-disable import/no-mutable-exports */
export let render = legacyRender;
export let unmountComponentAtNode = legacyUnmountComponentAtNode;
export let hydrate = legacyHydrate;
/* eslint-enable */

export function setClient({createRoot, hydrateRoot}) {
  const roots = new WeakMap();

  render = (element, container) => {
    let root = roots.get(container);
    if (root == null) {
      root = createRoot(container);
      roots.set(container, root);
    }
    root.render(element);
  };

  unmountComponentAtNode = container => roots.get(container)?.unmount();

  hydrate = (element, container) => {
    const root = hydrateRoot(container, element);
    roots.set(container, root);
  };
}
