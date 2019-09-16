import angular from 'angular';
import {useEffect} from '@storybook/client-api';

export const APP_NAME = 'ring-ui.story.app';

const angularDecorator = story => {
  const node = document.createElement('div');
  node.innerHTML = story();
  const app = angular.bootstrap(node, [APP_NAME], {strictDi: true});

  useEffect(() => () => {
    app.get('$rootScope').$destroy();
    node.innerHTML = '';
  });

  return node;
};

export default () => angularDecorator;
