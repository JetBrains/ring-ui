/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
import React, {StrictMode} from 'react';
import {useEffect, useMemo} from '@storybook/preview-api';
import {Story, StoryContext} from '@storybook/react';

import {
  render,
  unmountComponentAtNode
} from '../src/global/react-render-adapter';

const reactDecorator = (StoryFn: Story, context: StoryContext) => {
  const node = useMemo(
    () => document.createElement('div'),
    [context.kind, context.name]
  );

  useEffect(() => () => unmountComponentAtNode(node), [node]);

  render(
    (
      <StrictMode>
        <StoryFn/>
      </StrictMode>
    ),
    node
  );

  return node;
};

export default () => reactDecorator;
