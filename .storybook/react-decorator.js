/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {useEffect, useMemo} from '@storybook/client-api';

const reactDecorator = (story, context) => {
  const node = useMemo(
    () => document.createElement('div'),
    [context.kind, context.name]
  );
  const root = useMemo(
    () => createRoot(node),
    [node]
  );
  useEffect(() => () => root.unmount(), [root]);
  root.render((
    <StrictMode>
      {story()}
    </StrictMode>
  ));
  return node;
};

export default () => reactDecorator;
