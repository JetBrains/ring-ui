import {type StoryContext} from '@storybook/react-webpack5';
import {type FunctionComponent, useLayoutEffect} from 'react';

import {injectStyleSheet} from '../src/global/inject-styles';

interface Props {
  children: React.ReactNode;
  storyStyles?: string;
}

function StylesDecoratorWrapper({children, storyStyles}: Props) {
  useLayoutEffect(() => {
    if (storyStyles) {
      // We want styles string to contain "<style>" tag to push WebStorm to parse it as CSS
      const pureStyles = storyStyles.replace('<style>', '').replace('</style>', '');
      const stylesNode = injectStyleSheet(pureStyles);
      return () => stylesNode.remove();
    }
    return undefined;
  }, [storyStyles]);

  return children;
}

const stylesDecorator = (Story: FunctionComponent, context: StoryContext) => (
  <StylesDecoratorWrapper storyStyles={context.parameters?.storyStyles}>
    <Story />
  </StylesDecoratorWrapper>
);

export default () => stylesDecorator;
