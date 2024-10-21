import Link from '../link/link';

import analytics from './analytics';
import AnalyticsCustomPlugin from './analytics__custom-plugin';

export default {
  title: 'Components/Analytics',

  parameters: {
    notes: 'Provides a façade to Google Analytics and other web analytics services through a system of plugins.',
    screenshots: {skip: true},
  },
};

export const Analytics = () => {
  const FLUSH_INTERVAL = 100;

  const customPlugin = new AnalyticsCustomPlugin(
    // eslint-disable-next-line no-console
    events => console.log('Custom plugin receives:', events[0].category, events[0].action),
    false,
    FLUSH_INTERVAL,
  );

  analytics.config([customPlugin]);

  return (
    <div>
      <p>Click the link below and check the console output:</p>
      <div>
        <Link
          pseudo
          onClick={event => {
            analytics.trackEvent('test-category', 'test-action');
            event.preventDefault();
          }}
        >
          Track click event
        </Link>
      </div>
    </div>
  );
};
