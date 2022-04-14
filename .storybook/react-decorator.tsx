/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {useEffect, useMemo} from '@storybook/client-api';
import {Story, StoryContext} from '@storybook/react';

const reactDecorator = (StoryFn: Story, context: StoryContext) => {
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
      <StoryFn/>
    </StrictMode>
  ));
  return node;
};

export default () => reactDecorator;
