/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import {useEffect, useMemo} from '@storybook/client-api';
import {Story, StoryContext} from '@storybook/react';

const reactDecorator = (StoryFn: Story, context: StoryContext) => {
  const node = useMemo(
    () => document.createElement('div'),
    [context.kind, context.name]
  );
  useEffect(() => () => ReactDOM.unmountComponentAtNode(node), [node]);
  ReactDOM.render((
    <StrictMode>
      <StoryFn/>
    </StrictMode>
  ), node);
  return node;
};

export default () => reactDecorator;
