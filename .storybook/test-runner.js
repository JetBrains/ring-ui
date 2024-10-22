import {injectAxe, configureAxe, checkA11y} from 'axe-playwright';
import {getStoryContext} from '@storybook/test-runner';

module.exports = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);
    const {rules} = storyContext.parameters?.a11y?.options || {};
    await configureAxe(page, {
      rules: rules && Object.entries(rules).map(([id, value]) => ({id, ...value})),
    });
    await checkA11y(page, '#storybook-root', {
      verbose: false,
      detailedReport: true,
    });
  },
  tags: {skip: ['skip-test']},
};
