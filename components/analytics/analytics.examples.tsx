import linkStyles from '@jetbrains/ring-ui/components/link/link.css';

import analytics from '@jetbrains/ring-ui/components/analytics/analytics';
import AnalyticsCustomPlugin from '@jetbrains/ring-ui/components/analytics/analytics__custom-plugin';

export default {
  title: 'Components/Analytics',

  parameters: {
    notes:
      'Provides a façade to Google Analytics and other web analytics services through a system of plugins.',
    hermione: {skip: true}
  },
  argTypes: {onAnalytics: {}}
};

interface AnalyticsProps {
  onAnalytics: (message: string, category: string, action: string) => void
}
export const Analytics = ({onAnalytics}: AnalyticsProps) => {
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

  const customPlugin = new AnalyticsCustomPlugin(
    events => onAnalytics('Custom plugin receives:', events[0].category, events[0].action),
    false,
    FLUSH_INTERVAL
  );

  analytics.config([customPlugin]);

  node.querySelector('#click-me')?.addEventListener('click', event => {
    analytics.trackEvent('test-category', 'test-action');
    event.preventDefault();
  });

  return node;
};
