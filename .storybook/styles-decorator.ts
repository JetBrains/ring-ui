/* eslint-disable react-hooks/rules-of-hooks */
import {useEffect} from '@storybook/client-api';

import {StoryContext} from '@storybook/html';

import {injectStyleSheet} from '../src/global/inject-styles';

const stylesDecorator = (story: () => string | Node, context: StoryContext) => {
  const storyStyles = context.parameters?.storyStyles;

  useEffect(() => {
    if (storyStyles != null) {
      // We want styles string to contain "<style>" tag to push WebStorm to parse it as CSS
      const pureStyles = storyStyles.replace('<style>', '').
        replace('</style>', '');
      const stylesNode = injectStyleSheet(pureStyles);
      return () => stylesNode.remove();
    }
    return undefined;
  }, [storyStyles]);

  return story();
};

export default () => stylesDecorator;
