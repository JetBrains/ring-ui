import addons from '@storybook/addons';
import {REGISTER_SUBSCRIPTION, STORY_CHANGED} from '@storybook/core-events';

import {injectStyleSheet} from '../components/global/inject-styles';

const stylesDecorator = () => {
  const channel = addons.getChannel();
  let stylesNode = null;

  const unmount = () => {
    if (!stylesNode) {
      return;
    }
    stylesNode.remove();
    stylesNode = null;
  };

  const subscription = () => {
    channel.on(STORY_CHANGED, unmount);
    return () => {
      unmount();
      channel.removeListener(STORY_CHANGED, unmount);
    };
  };


  return (storyFn, story) => {
    const storyStyles = story.parameters?.storyStyles;

    if (!storyStyles) {
      return storyFn();
    }
    channel.emit(REGISTER_SUBSCRIPTION, subscription);

    // We want styles string to contain "<style>" tag to push WebStorm to parse it as CSS
    const pureStyles = storyStyles.replace('<style>', '').
      replace('</style>', '');
    stylesNode = injectStyleSheet(pureStyles);

    return storyFn();
  };
};

export default stylesDecorator;
