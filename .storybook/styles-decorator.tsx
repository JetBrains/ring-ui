/* eslint-disable react-hooks/rules-of-hooks */
import {useEffect} from '@storybook/preview-api';

import {StoryContext, StoryFn} from '@storybook/react';

import {injectStyleSheet} from '../src/global/inject-styles';

const stylesDecorator = (Story: StoryFn, context: StoryContext) => {
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

  return <Story/>;
};

export default () => stylesDecorator;
