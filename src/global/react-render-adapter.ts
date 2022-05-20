// Allows overriding ReactDOM.render when using React 18:
// import * as client from 'react-dom/client'
// import {setClient} from '@ring-ui/global/react-render-adapter'
//
// setClient(client)
import type {ReactChild, ReactElement, ReactNode} from 'react';
import {
  render as legacyRender,
  unmountComponentAtNode as legacyUnmountComponentAtNode,
  hydrate as legacyHydrate
} from 'react-dom';

/* eslint-disable import/no-mutable-exports */
export let render: (element: ReactElement, container: Element | DocumentFragment) => void =
  legacyRender;
export let unmountComponentAtNode = legacyUnmountComponentAtNode;
export let hydrate: (element: ReactElement, container: Element | Document) => void =
  legacyHydrate;
/* eslint-enable */

interface Root {
  render(children: ReactChild | Iterable<ReactNode>): void;
  unmount(): void;
}

interface RootOptions {
  /**
   * Prefix for `useId`.
   */
  identifierPrefix?: string;
  onRecoverableError?: (error: unknown) => void;
}

interface HydrationOptions {
  /**
   * Prefix for `useId`.
   */
  identifierPrefix?: string;
  onRecoverableError?: (error: unknown) => void;
}

interface Client {
  createRoot(container: Element | DocumentFragment, options?: RootOptions): Root
  hydrateRoot(
    container: Element | Document,
    initialChildren: ReactChild | Iterable<ReactNode>,
    options?: HydrationOptions,
  ): Root
}

export function setClient({createRoot, hydrateRoot}: Client) {
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
