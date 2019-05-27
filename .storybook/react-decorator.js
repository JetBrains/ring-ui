import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import addons from '@storybook/addons';
import {REGISTER_SUBSCRIPTION, STORY_CHANGED} from '@storybook/core-events';

const reactDecorator = () => {
  // NOTE: this node is being reused across decorated stories. May cause side effects
  const node = document.createElement('div');
  const channel = addons.getChannel();

  const unmount = () => ReactDOM.unmountComponentAtNode(node);

  const subscription = () => {
    channel.on(STORY_CHANGED, unmount);
    return () => {
      unmount();
      channel.removeListener(STORY_CHANGED, unmount);
    };
  };


  return story => {
    channel.emit(REGISTER_SUBSCRIPTION, subscription);
    ReactDOM.render((
      <StrictMode>
        {story()}
      </StrictMode>
    ), node);
    return node;
  };
};

export default reactDecorator;
