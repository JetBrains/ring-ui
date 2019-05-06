import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import analytics from '../analytics/analytics';
import linkStyles from '../link/link.css';
import AnalyticsCustomPlugin from '../analytics/analytics__custom-plugin';

storiesOf('Components|Analytics', module).
  addParameters({
    notes: 'Provides a façade to Google Analytics and other web analytics services through a system of plugins.',
    hermione: {skip: true}
  }).
  add('analytics', () => {

    const node = document.createElement('div');

    node.innerHTML = `
      <div>
        <p>Click the link below and check the console output:</p>
        <div>
          <a href id="click-me" class="${linkStyles.link}">
            Track click event
          </a>
        </div>
      </div>
    `;

    const FLUSH_INTERVAL = 100;

    const customPlugin = new AnalyticsCustomPlugin(events => (
      action('analytics')('Custom plugin receives:', events[0].category, events[0].action)
    ), false, FLUSH_INTERVAL);

    analytics.config([customPlugin]);

    node.querySelector('#click-me').addEventListener('click', event => {
      analytics.trackEvent('test-category', 'test-action');
      event.preventDefault();
    });

    return node;
  });
