/* eslint-disable react-hooks/rules-of-hooks */
import {type StoryContext} from '@storybook/react-webpack5';
import {type FunctionComponent, useLayoutEffect} from 'react';

import {injectStyleSheet} from '../src/global/inject-styles';

const stylesDecorator = (Story: FunctionComponent, context: StoryContext) => {
  const storyStyles = context.parameters?.storyStyles;

  useLayoutEffect(() => {
    if (storyStyles) {
      // We want styles string to contain "<style>" tag to push WebStorm to parse it as CSS
      const pureStyles = storyStyles.replace('<style>', '').replace('</style>', '');
      const stylesNode = injectStyleSheet(pureStyles);
      return () => stylesNode.remove();
    }
    return undefined;
  }, [storyStyles]);

  return <Story />;
};

export default () => stylesDecorator;
