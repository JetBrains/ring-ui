import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import {useEffect, useMemo} from '@storybook/client-api';

const reactDecorator = (story, context) => {
  const node = useMemo(
    () => document.createElement('div'),
    [context.kind, context.name]
  );
  useEffect(() => () => ReactDOM.unmountComponentAtNode(node), [node]);
  ReactDOM.render((
    <StrictMode>
      {story()}
    </StrictMode>
  ), node);
  return node;
};

export default () => reactDecorator;
