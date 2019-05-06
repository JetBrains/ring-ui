import angular from 'angular';

import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import LinkNG from '../link-ng/link-ng';
import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import AnalyticsNG from './analytics-ng';


storiesOf('Legacy Angular|Analytics Ng', module).
  addParameters({
    notes: 'Provides an Angular wrapper for Analytics.',
    hermione: {skip: true}
  }).
  addDecorator(angularDecorator()).
  add('analytics', () => {
    angular.module(APP_NAME, [AnalyticsNG, LinkNG]).
      config(function config(analyticsProvider, AnalyticsCustomPlugin/*, AnalyticsGAPlugin*/) {
        const analyticsEnabled = true;
        if (analyticsEnabled) {
          const isDevelopment = true;
          const customPlugin = new AnalyticsCustomPlugin(
            data => action('analytics')('Here you can send data to server', data),
            isDevelopment,
            600
          );
          // const gaId = 'GA-XXXXX-ID';
          analyticsProvider.plugins([
            customPlugin //, new AnalyticsGAPlugin(gaId)
          ]);
        }
      }).
      controller('TrackEventDemoCtrl', function controller(analytics) {
        analytics.trackEvent('track-event-demo', 'show');
      });

    return `
      <div>
        <p>Hover or click the links below and check the console output:</p>
        <div>
          <rg-link href="" rg-analytics="overview:view-doc">
            Link with an onclick analytics trigger
          </rg-link>
        </div>
        <div>
          <rg-link href="" rg-analytics="overview:view-doc" rg-analytics-on="mouseover">
            Link with an onmouseover analytics trigger
          </rg-link>
        </div>
        <div ng-controller="TrackEventDemoCtrl"></div>
      </div>
    `;
  });
