import angular from 'angular';
import addons from '@storybook/addons';
import {REGISTER_SUBSCRIPTION, STORY_CHANGED} from '@storybook/core-events';

export const APP_NAME = 'ring-ui.story.app';

export default function angularDecorator() {
  const channel = addons.getChannel();
  let node = null;
  let app = null;

  const unmount = () => {
    if (!app) {
      return;
    }
    app.get('$rootScope').$destroy();
    app = null;
    node.innerHTML = '';
    node = null;
  };

  const subscription = () => {
    channel.on(STORY_CHANGED, unmount);
    return () => {
      unmount();
      channel.removeListener(STORY_CHANGED, unmount);
    };
  };


  return story => {
    channel.emit(REGISTER_SUBSCRIPTION, subscription);

    node = document.createElement('div');
    node.innerHTML = story();

    app = angular.bootstrap(node, [APP_NAME], {strictDi: true});

    return node;
  };
}
