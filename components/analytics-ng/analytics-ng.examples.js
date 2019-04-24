/* eslint-disable angular/no-controller */
import angular from 'angular';

import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import LinkNG from '../link-ng/link-ng';

import AnalyticsNG from './analytics-ng';


storiesOf('Legacy Angular|Analytics Ng', module).
  add('analytics', () => {
    angular.module('Example.analyticsDemo', [AnalyticsNG, LinkNG]).
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

    const node = document.createElement('div');
    node.innerHTML = `
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

    angular.bootstrap(node, ['Example.analyticsDemo'], {strictDi: true});

    return node;
  });
