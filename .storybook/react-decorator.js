import ReactDOM from 'react-dom';
import addons from '@storybook/addons';
import {REGISTER_SUBSCRIPTION, STORY_CHANGED} from '@storybook/core-events';

const reactDecorator = () => {
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

  channel.emit(REGISTER_SUBSCRIPTION, subscription);

  return story => {
    ReactDOM.render(story(), node);
    return node;
  };
};

export default reactDecorator;
