import {useEffect} from '@storybook/client-api';

import {injectStyleSheet} from '../components/global/inject-styles';

const stylesDecorator = (story, context) => {
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
